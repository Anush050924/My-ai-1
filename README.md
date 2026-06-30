# Radha AI - Step 1 Dashboard

**Radha AI Dashboard** - Custom built for Anushwer

A futuristic, multi-modal AI assistant dashboard with browser-native voice recognition and synthesis, powered by a cloud-safe Flask backend.

## Features

🎙️ **Radha Core Chat** - Conversational AI interface with full conversation history
📝 **Creative Studio** - Advanced writing and content creation tools
🎨 **Visual Forge** - Design interface with 3D visualization canvas
🎵 **Sonic Lab** - Music generation and control system
🎬 **Film Studio** - Story workspace with timeline management

## System Architecture

- **Backend**: Python Flask server (port 5000) with CORS enabled
- **Frontend**: HTML5, CSS3, JavaScript with browser-native APIs
- **Speech Recognition**: `window.SpeechRecognition` (Chrome, Edge, Firefox)
- **Text-to-Speech**: `window.speechSynthesis` with automatic female voice selection
- **Data**: Dynamic CSV loading for extensible knowledge base

## Quick Start

### Prerequisites
- Python 3.8+
- Modern web browser (Chrome, Firefox, Edge, Safari 14.1+)

### Installation

```bash
# Clone or navigate to the project directory
cd My-ai-1

# Install Python dependencies
pip install -r requirements.txt
```

### Running the Application

**Terminal 1: Start the Backend Server**
```bash
python app.py
```
Backend will run on `http://localhost:5000`

**Terminal 2: Start the Frontend Server**
```bash
python3 -m http.server 8000
```
Frontend will run on `http://localhost:8000`

### Access the Dashboard

Open your browser and navigate to:
```
http://localhost:8000
```

## API Endpoints

### Authentication
All endpoints require `user_id=Anushwer` parameter. Requests from other users will be rejected.

### `/api/chat` (POST)
Send a message and receive a response from Radha

**Request:**
```json
{
  "user_id": "Anushwer",
  "message": "What can you do?",
  "history": []
}
```

**Response:**
```json
{
  "success": true,
  "user_message": "What can you do?",
  "radha_response": "I have five main modules...",
  "tone": "helpful",
  "timestamp": "2024-01-15T10:30:00"
}
```

### `/api/health` (GET)
Check backend service status

### `/api/features` (GET)
Get available AI assistant options (requires `user_id` query parameter)

### `/api/implementation` (GET)
Get implementation guide data (requires `user_id` query parameter)

### `/api/system-info` (GET)
Get system information and available modules (requires `user_id` query parameter)

## Configuration

The system loads data from two CSV files:
- `ai_assistant_options.csv` - Available AI solutions and their features
- `implementation_guide.csv` - Implementation guides ranked by complexity

These files are loaded dynamically and Radha uses them to provide intelligent responses about available options.

## Browser Support

| Feature | Chrome | Firefox | Safari | Edge |
|---------|--------|---------|--------|------|
| Speech Recognition | ✅ | ✅ | ⚠️ | ✅ |
| Text-to-Speech | ✅ | ✅ | ✅ | ✅ |
| Full Dashboard | ✅ | ✅ | ✅ | ✅ |

## Architecture Overview

```
┌─────────────────────────────────────────┐
│      Radha AI Dashboard (Frontend)      │
│  HTML5 / CSS3 / JavaScript (ES6+)       │
│                                         │
│  ┌─────────────────────────────────┐   │
│  │  Browser Native APIs:           │   │
│  │  • SpeechRecognition (🎤)       │   │
│  │  • speechSynthesis (🔊)         │   │
│  │  • Web Audio API                │   │
│  └─────────────────────────────────┘   │
└─────────────────────────────────────────┘
              ⬇️ HTTP/REST
┌─────────────────────────────────────────┐
│    Flask Backend (Python)               │
│    Port 5000 | CORS Enabled             │
│                                         │
│  ┌─────────────────────────────────┐   │
│  │  /api/chat - Main endpoint      │   │
│  │  • User verification            │   │
│  │  • Response generation          │   │
│  │  • CSV data integration         │   │
│  └─────────────────────────────────┘   │
│                                         │
│  ┌─────────────────────────────────┐   │
│  │  Data Sources:                  │   │
│  │  • ai_assistant_options.csv     │   │
│  │  • implementation_guide.csv     │   │
│  └─────────────────────────────────┘   │
└─────────────────────────────────────────┘
```

## Development

### Adding New Modules

Edit `index.html` to add new sections in the modules container, then update `style.css` with corresponding styles.

### Extending Backend Responses

Modify the `generate_radha_response()` function in `app.py` to add new response patterns.

### Custom Female Voices

The frontend automatically detects and selects female voices. Priority order:
1. Google UK English Female
2. Microsoft Zira
3. macOS Samantha/Victoria
4. System default female voice

## Security Notes

- ⚠️ **Authorization**: Only user "Anushwer" is authorized to access the dashboard
- ⚠️ **No Desktop Dependencies**: Removed all system-level dependencies (pyaudio, pyttsx3, alsa) to prevent security issues
- ⚠️ **CORS Enabled**: Backend allows cross-origin requests from localhost:8000
- ⚠️ **Local Processing**: All voice processing happens browser-side (no cloud upload)

## Troubleshooting

### Backend won't start
```
Error: Port 5000 already in use
Solution: Kill the process or use a different port
```

### Microphone not working
- Check browser permissions for microphone access
- Ensure you're using HTTPS or localhost
- Try Firefox or Chrome if using Safari

### Text-to-speech not working
- Verify browser supports `speechSynthesis` API
- Check system audio output is working
- Try a different voice in browser settings

### CORS errors
- Ensure backend is running on port 5000
- Check that `flask-cors` is installed
- Verify frontend is accessing `http://localhost:8000`

## Dependencies

```
Flask 3.0.0
Flask-CORS 4.0.0
Pandas 2.1.4
```

No system-level audio libraries required. Uses browser-native APIs exclusively.

## License

Built exclusively for Anushwer. All rights reserved.

## Support

For issues or questions, check the backend console output and browser developer tools for error messages.

---

**Status**: Step 1 Complete ✅
**Created**: 2024
**Authorized User**: Anushwer
