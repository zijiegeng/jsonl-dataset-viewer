import json
from pathlib import Path
from typing import Optional, Dict, Any, List
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from pydantic import BaseModel


class LoadDatasetRequest(BaseModel):
    path: str


class DatasetManager:
    def __init__(self):
        self.file_path: Optional[Path] = None
        self.offsets: List[int] = []

    def load_dataset(self, path: str) -> int:
        """Build line offset index and return total count."""
        file_path = Path(path).expanduser()

        if not file_path.exists():
            raise FileNotFoundError(f"File not found: {path}")

        if not file_path.is_file():
            raise ValueError(f"Path is not a file: {path}")

        # Build offset index
        offsets = []
        with open(file_path, 'rb') as f:
            while True:
                offset = f.tell()
                line = f.readline()
                if not line:
                    break
                # Only add offset if line is not empty/whitespace
                if line.strip():
                    offsets.append(offset)

        self.file_path = file_path
        self.offsets = offsets
        return len(offsets)

    def get_sample(self, index: int) -> Dict[str, Any]:
        """Get sample at given index."""
        if self.file_path is None:
            raise ValueError("No dataset loaded")

        if index < 0 or index >= len(self.offsets):
            raise IndexError(f"Index {index} out of range [0, {len(self.offsets)})")

        # Seek to offset and read line
        with open(self.file_path, 'rb') as f:
            f.seek(self.offsets[index])
            line = f.readline()

        # Parse JSON
        try:
            data = json.loads(line)
        except json.JSONDecodeError as e:
            raise ValueError(f"Invalid JSON at index {index}: {e}")

        # Extract and normalize messages field
        return self._normalize_sample(data)

    def get_count(self) -> int:
        """Return total number of samples."""
        return len(self.offsets)

    def _normalize_sample(self, data: Dict[str, Any]) -> Dict[str, Any]:
        """Extract messages field and normalize sample structure.

        Returns the sample with:
        - messages: the default (top-level preferred) messages array
        - _messages_sources: list of {key, messages} for all found sources (only when >1)
        """
        # Collect all sources: top-level first, then nested
        sources: List[Dict[str, Any]] = []

        if "messages" in data:
            sources.append({"key": "messages", "messages": data["messages"]})

        for key, value in data.items():
            if isinstance(value, dict) and "messages" in value:
                sources.append({"key": f"{key}.messages", "messages": value["messages"]})

        if not sources:
            raise ValueError("No messages field found in sample")

        result = data.copy()
        # Default: use the first source (top-level takes priority)
        result["messages"] = sources[0]["messages"]

        # Expose all sources so the frontend can offer a switcher
        if len(sources) > 1:
            result["_messages_sources"] = [
                {"key": s["key"], "messages": s["messages"]} for s in sources
            ]

        return result


# Initialize FastAPI app
app = FastAPI(title="JSONL Dataset Viewer API")

# Enable CORS for local development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize dataset manager
dataset_manager = DatasetManager()


@app.post("/api/load_dataset")
async def load_dataset(request: LoadDatasetRequest):
    """Load a dataset from the given file path."""
    try:
        count = dataset_manager.load_dataset(request.path)
        return {"success": True, "count": count}
    except FileNotFoundError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@app.get("/api/sample")
async def get_sample(id: int):
    """Get sample at given index."""
    try:
        sample = dataset_manager.get_sample(id)
        return sample
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except IndexError as e:
        raise HTTPException(status_code=404, detail=str(e))


@app.get("/api/count")
async def get_count():
    """Get total number of samples in loaded dataset."""
    try:
        count = dataset_manager.get_count()
        return {"count": count}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


# Serve static files (frontend) in production
static_dir = Path(__file__).parent / "static"
if static_dir.exists():
    # Only mount assets if the directory exists (for built React frontend)
    assets_dir = static_dir / "assets"
    if assets_dir.exists():
        app.mount("/assets", StaticFiles(directory=assets_dir), name="assets")

    @app.get("/")
    async def serve_frontend():
        return FileResponse(static_dir / "index.html")


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
