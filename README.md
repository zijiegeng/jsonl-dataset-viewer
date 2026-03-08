# JSONL Dataset Viewer

A lightweight browser-based tool to inspect and visualize LLM training datasets stored as JSONL files.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Python](https://img.shields.io/badge/python-3.9+-blue.svg)

## ✨ Features

- 🚀 **Fast Navigation**: Efficiently browse through large datasets with line-offset indexing
- 💬 **Rich Message Display**: Visualize conversations with role-specific icons (User, Assistant, System, Tool)
- 🔧 **Tool Call Visualization**: Display function calls and their results with formatted JSON
- 🧠 **Thinking Sections**: Collapsible reasoning traces for better understanding
- 📊 **Metadata Display**: Show additional fields like correctness, categories, etc.
- ⌨️ **Keyboard Shortcuts**: Navigate with arrow keys for faster browsing
- 🎨 **Clean UI**: Single-card interface maximizing data display area
- 🔨 **No Build Step**: Pure Python backend with vanilla JavaScript frontend

## 🚀 Quick Start

### Prerequisites

- Python 3.9 or higher
- pip (Python package manager)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/YOUR_USERNAME/jsonl-dataset-viewer.git
cd jsonl-dataset-viewer
```

2. Install Python dependencies:
```bash
cd backend
python3 -m pip install -r requirements.txt
```

3. Run the application:
```bash
./run.sh
```

Or manually:
```bash
cd backend
python3 main.py
```

4. Open your browser and navigate to:
```
http://localhost:8000
```

5. Load a dataset by entering the full path to your JSONL file and clicking "Load".

Try the included sample dataset: `test_dataset.jsonl` (use absolute path)

## 📖 Usage

### Navigation
- **Previous/Next buttons**: Navigate through samples sequentially
- **Arrow keys**: Use ← and → for quick navigation
- **Jump**: Enter a sample number (0-indexed) and click "Go"

### Interface
- **Thinking sections**: Click to expand/collapse reasoning traces
- **Tool calls**: View function calls with formatted arguments
- **Metadata**: Additional fields displayed inline (excludes `prompt` field)

## 📝 Dataset Format

The tool expects JSONL files where each line is a JSON object with a `messages` field:

```json
{
  "messages": [
    {"role": "system", "content": "You are a helpful assistant."},
    {"role": "user", "content": "Hello!"},
    {"role": "assistant", "content": "Hi! How can I help you?"}
  ],
  "question": "Optional metadata field",
  "answer": "Optional metadata field",
  "correct": true
}
```

### Supported Message Types

- **System**: System prompts and instructions
- **User**: User queries and inputs
- **Assistant**: AI responses (may include `tool_calls` and `<thinking>` tags)
- **Tool**: Tool execution results (linked via `tool_call_id`)

### Example with Tool Calls

```json
{
  "messages": [
    {
      "role": "user",
      "content": "What's the weather in Tokyo?"
    },
    {
      "role": "assistant",
      "content": "<thinking>I need to call the weather API for Tokyo.</thinking>\n\nLet me check the weather for you.",
      "tool_calls": [{
        "id": "call_1",
        "type": "function",
        "function": {
          "name": "get_weather",
          "arguments": "{\"city\": \"Tokyo\"}"
        }
      }]
    },
    {
      "role": "tool",
      "content": "{\"temperature\": 22, \"condition\": \"sunny\"}",
      "tool_call_id": "call_1",
      "name": "get_weather"
    },
    {
      "role": "assistant",
      "content": "The weather in Tokyo is sunny with a temperature of 22°C."
    }
  ]
}
```

## 🏗️ Architecture

### Backend (Python/FastAPI)
- **Line-offset indexing**: Efficient random access to large files without loading entire dataset
- **Messages field detection**: Automatically finds messages in top-level or nested structures
- **RESTful API**: Simple endpoints for loading datasets and fetching samples

### Frontend (Vanilla JavaScript)
- **Single HTML file**: No build step required
- **Tailwind CSS**: Styling via CDN
- **Marked.js**: Markdown rendering for message content
- **Responsive design**: Clean, modern interface

## 📦 Building a Standalone Executable

Create a single executable that doesn't require Python installation:

```bash
cd backend
pip install pyinstaller
pyinstaller --onefile --add-data "static:static" main.py
```

The executable will be in `backend/dist/main` (or `main.exe` on Windows).

Users can then just run the executable and open http://localhost:8000 in their browser.

## 🛠️ Development

### Project Structure

```
jsonl-dataset-viewer/
├── backend/
│   ├── main.py              # FastAPI server
│   ├── requirements.txt     # Python dependencies
│   └── static/
│       └── index.html       # Frontend (single file)
├── test_dataset.jsonl       # Sample dataset
├── run.sh                   # Startup script
└── README.md
```

### API Endpoints

- `POST /api/load_dataset`: Load a dataset from file path
- `GET /api/sample?id={index}`: Fetch sample at specific index
- `GET /api/count`: Get total number of samples

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Built with [FastAPI](https://fastapi.tiangolo.com/)
- Styled with [Tailwind CSS](https://tailwindcss.com/)
- Markdown rendering by [Marked.js](https://marked.js.org/)

## 📧 Contact

For questions or feedback, please open an issue on GitHub.
