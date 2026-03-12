# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

JSONL Dataset Viewer — a browser-based tool to inspect LLM training datasets stored as JSONL files. It renders conversations with role-specific formatting, collapsible thinking sections, and tool call visualization.

## Running the App

There are two modes:

**Production mode** (backend serves static HTML, no build step):
```bash
cd backend && python3 -m pip install -r requirements.txt  # one-time setup
./run.sh  # starts server at http://localhost:8000
```

**Development mode** (React frontend with hot reload):
```bash
./start.sh  # starts backend at :8000 and Vite dev server at :5173
```

For frontend-only dev:
```bash
cd frontend && npm install && npm run dev
```

Build React frontend into backend static dir:
```bash
cd frontend && npm run build
# Output goes to frontend/dist — copy to backend/static/ for production
```

## Architecture

The project has two frontend implementations:

1. **`backend/static/index.html`** — production frontend, single HTML file with vanilla JS, Tailwind CSS via CDN, Marked.js for markdown. This is what `run.sh` serves.

2. **`frontend/`** — React + TypeScript + Vite frontend (development version). Components in `frontend/src/components/`: `DatasetLoader`, `Navigation`, `Metadata`, `Conversation`. Uses `@radix-ui/react-accordion` for collapsible sections and `react-markdown` for rendering.

**Backend** (`backend/main.py`): FastAPI server with a single `DatasetManager` class that:
- Builds a byte-offset index on load (stores file position of each line) for O(1) random access without loading the full file into memory
- Normalizes the `messages` field — checks top-level first, then one level deep in nested objects, raises an error if both exist simultaneously

## API Endpoints

- `POST /api/load_dataset` — `{"path": "/abs/path/to/file.jsonl"}` → `{"success": true, "count": N}`
- `GET /api/sample?id={index}` — returns the normalized sample JSON
- `GET /api/count` — returns `{"count": N}`

## Key Design Constraints

**Messages field detection** (enforced in `DatasetManager._normalize_sample`):
- Top-level `messages` takes priority over nested `messages`
- If both top-level and nested `messages` exist simultaneously → error
- If multiple nested objects each have `messages` → error

**JSONL format**: Each line is a JSON object with a `messages` array (OpenAI-compatible format). Optional metadata fields (`question`, `answer`, `correct`, etc.) are displayed dynamically. The `prompt` field is excluded from metadata display. The `answer` field must always be shown if present.

## Standalone Executable

To package as a single binary (no Python required for end users):
```bash
cd backend && pip install pyinstaller
pyinstaller --onefile --add-data "static:static" main.py
# Output: backend/dist/main
```
