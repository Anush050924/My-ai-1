# Building Your Free JARVIS-like AI Assistant 

**Hardware Assessment for Your Setup:**
- **i5 2GB RAM PC**: Limited but usable for basic voice assistant features
- **i9 13th Gen 8GB RAM Laptop**: Ideal for running advanced local AI models
- **Recommendation**: Start development on the i9 laptop, then deploy lightweight version to i5 PC

## Path 1: Quick Start - Mozilla DeepSpeech + Python (RECOMMENDED FOR BEGINNERS)

### Why This Path?
- ✅ Works on both your devices
- ✅ Completely free
- ✅ Good starting point to learn AI assistant development
- ✅ Can upgrade to more powerful solutions later

### Setup Instructions

#### Step 1: Install Prerequisites
```bash
# Install Python 3.8+ (if not already installed)
# Download from python.org

# Install required packages
pip install deepspeech pyttsx3 SpeechRecognition pyaudio
```

#### Step 2: Download DeepSpeech Model
```bash
# Download the English model (47MB)
wget https://github.com/mozilla/DeepSpeech/releases/download/v0.9.3/deepspeech-0.9.3-models.pbmm
wget https://github.com/mozilla/DeepSpeech/releases/download/v0.9.3/deepspeech-0.9.3-models.scorer
```

#### Step 3: Basic Voice Assistant Code
```python
import speech_recognition as sr
import pyttsx3
import deepspeech
import numpy as np
import wave

class JarvisAssistant:
    def __init__(self):
        self.recognizer = sr.Recognizer()
        self.microphone = sr.Microphone()
        self.tts_engine = pyttsx3.init()
        
        # Configure female voice
        voices = self.tts_engine.getProperty('voices')
        for voice in voices:
            if 'female' in voice.name.lower():
                self.tts_engine.setProperty('voice', voice.id)
                break
        
        self.tts_engine.setProperty('rate', 180)
    
    def speak(self, text):
        print(f"Assistant: {text}")
        self.tts_engine.say(text)
        self.tts_engine.runAndWait()
    
    def listen(self):
        with self.microphone as source:
            self.recognizer.adjust_for_ambient_noise(source)
        
        print("Listening...")
        with self.microphone as source:
            audio = self.recognizer.listen(source, timeout=1, phrase_time_limit=5)
        
        try:
            text = self.recognizer.recognize_google(audio)
            print(f"You said: {text}")
            return text.lower()
        except sr.UnknownValueError:
            return ""
        except sr.RequestError:
            return ""
    
    def process_command(self, command):
        if "hello" in command or "hi" in command:
            self.speak("Hello! I'm your AI assistant. How can I help you?")
        elif "time" in command:
            import datetime
            now = datetime.datetime.now()
            self.speak(f"The current time is {now.strftime('%I:%M %p')}")
        elif "weather" in command:
            self.speak("I'm still learning to check the weather. This feature is coming soon!")
        elif "goodbye" in command or "exit" in command:
            self.speak("Goodbye! Have a great day!")
            return False
        else:
            self.speak("I heard you, but I'm not sure how to help with that yet.")
        return True
    
    def run(self):
        self.speak("Hello! I'm your AI assistant. Say 'hello' to start.")
        
        while True:
            command = self.listen()
            if command:
                continue_running = self.process_command(command)
                if not continue_running:
                    break

if __name__ == "__main__":
    assistant = JarvisAssistant()
    assistant.run()
```

## Path 2: Google Cloud Free Tier (EASIEST SETUP)

### Benefits
- Professional quality speech recognition and synthesis
- 60 minutes of speech-to-text free per month
- 4 million characters of text-to-speech free per month
- Works on both devices

### Setup Instructions

#### Step 1: Create Google Cloud Account
1. Go to cloud.google.com
2. Create account (requires credit card but won't charge for free tier)
3. Create a new project

#### Step 2: Enable APIs
```bash
# Enable required APIs in Google Cloud Console
# - Speech-to-Text API
# - Text-to-Speech API
# - Cloud Translation API (optional)
```

#### Step 3: Install Google Cloud Libraries
```bash
pip install google-cloud-speech google-cloud-texttospeech
```

#### Step 4: Enhanced Assistant Code
```python
from google.cloud import speech
from google.cloud import texttospeech
import pyaudio
import wave

class GoogleCloudJarvis:
    def __init__(self):
        self.speech_client = speech.SpeechClient()
        self.tts_client = texttospeech.TextToSpeechClient()
        
        # Configure female voice
        self.voice = texttospeech.VoiceSelectionParams(
            language_code="en-US",
            ssml_gender=texttospeech.SsmlVoiceGender.FEMALE,
            name="en-US-Wavenet-F"
        )
        
        self.audio_config = texttospeech.AudioConfig(
            audio_encoding=texttospeech.AudioEncoding.MP3
        )
    
    def speak(self, text):
        synthesis_input = texttospeech.SynthesisInput(text=text)
        response = self.tts_client.synthesize_speech(
            input=synthesis_input,
            voice=self.voice,
            audio_config=self.audio_config
        )
        
        # Play the audio
        with open("output.mp3", "wb") as out:
            out.write(response.audio_content)
        
        # Play the file (you'll need to add audio playback)
        print(f"Assistant: {text}")
    
    def listen(self):
        # Record audio
        chunk = 1024
        format = pyaudio.paInt16
        channels = 1
        rate = 16000
        record_seconds = 5
        
        p = pyaudio.PyAudio()
        
        stream = p.open(format=format,
                       channels=channels,
                       rate=rate,
                       input=True,
                       frames_per_buffer=chunk)
        
        frames = []
        for i in range(0, int(rate / chunk * record_seconds)):
            data = stream.read(chunk)
            frames.append(data)
        
        stream.stop_stream()
        stream.close()
        p.terminate()
        
        # Convert to Google Cloud Speech format
        audio = speech.RecognitionAudio(content=b''.join(frames))
        config = speech.RecognitionConfig(
            encoding=speech.RecognitionConfig.AudioEncoding.LINEAR16,
            sample_rate_hertz=16000,
            language_code="en-US",
        )
        
        response = self.speech_client.recognize(config=config, audio=audio)
        
        if response.results:
            return response.results[0].alternatives[0].transcript
        return ""
```

## Path 3: Advanced Local Setup (i9 Laptop Only)

### Using Ollama + Whisper for Maximum Privacy

#### Step 1: Install Ollama
```bash
# Download and install Ollama from ollama.ai
curl -fsSL https://ollama.com/install.sh | sh

# Download a small, efficient model
ollama pull llama3.2:1b
```

#### Step 2: Install Whisper
```bash
pip install openai-whisper
```

#### Step 3: Integration Script
```python
import whisper
import subprocess
import json

class LocalJarvis:
    def __init__(self):
        self.whisper_model = whisper.load_model("base")
        
    def listen(self):
        # Record audio to temporary file
        import sounddevice as sd
        import soundfile as sf
        
        duration = 5  # seconds
        sample_rate = 16000
        
        print("Listening...")
        audio = sd.rec(int(duration * sample_rate), 
                      samplerate=sample_rate, 
                      channels=1)
        sd.wait()
        
        # Save temporarily
        sf.write("temp_audio.wav", audio, sample_rate)
        
        # Transcribe with Whisper
        result = self.whisper_model.transcribe("temp_audio.wav")
        return result["text"]
    
    def think(self, user_input):
        # Use Ollama for AI responses
        prompt = f"You are a helpful AI assistant named Jarvis. Respond to: {user_input}"
        
        result = subprocess.run([
            "ollama", "run", "llama3.2:1b", prompt
        ], capture_output=True, text=True)
        
        return result.stdout.strip()
    
    def speak(self, text):
        # Use system TTS
        subprocess.run(["espeak", "-v", "en+f3", "-s", "160", text])
        print(f"Jarvis: {text}")
```

## Cross-Device Synchronization Setup

### Option 1: Simple File Sync
```python
import json
import os
from datetime import datetime

class SyncManager:
    def __init__(self, sync_folder="~/jarvis_sync"):
        self.sync_folder = os.path.expanduser(sync_folder)
        os.makedirs(self.sync_folder, exist_ok=True)
        
    def save_conversation(self, user_input, assistant_response):
        conversation = {
            "timestamp": datetime.now().isoformat(),
            "user": user_input,
            "assistant": assistant_response
        }
        
        filename = f"{self.sync_folder}/conversation_{datetime.now().strftime('%Y%m%d')}.json"
        
        # Load existing conversations
        if os.path.exists(filename):
            with open(filename, 'r') as f:
                conversations = json.load(f)
        else:
            conversations = []
        
        conversations.append(conversation)
        
        # Save updated conversations
        with open(filename, 'w') as f:
            json.dump(conversations, f, indent=2)
    
    def get_conversation_history(self, days=7):
        # Return recent conversation history for context
        conversations = []
        for i in range(days):
            date = datetime.now() - timedelta(days=i)
            filename = f"{self.sync_folder}/conversation_{date.strftime('%Y%m%d')}.json"
            if os.path.exists(filename):
                with open(filename, 'r') as f:
                    conversations.extend(json.load(f))
        return conversations[-50:]  # Last 50 conversations
```

### Option 2: Using Cloud Storage
```python
# Use Google Drive API, Dropbox API, or OneDrive API
# to sync conversation history and settings between devices
```

## Female Voice Configuration

### For pyttsx3 (Local TTS):
```python
def setup_female_voice(tts_engine):
    voices = tts_engine.getProperty('voices')
    
    # Try to find a female voice
    female_voice = None
    for voice in voices:
        if 'female' in voice.name.lower() or 'woman' in voice.name.lower():
            female_voice = voice.id
            break
        elif 'zira' in voice.name.lower():  # Windows female voice
            female_voice = voice.id
            break
    
    if female_voice:
        tts_engine.setProperty('voice', female_voice)
    
    # Adjust speech rate and pitch
    tts_engine.setProperty('rate', 180)  # Speed
    tts_engine.setProperty('volume', 0.9)  # Volume
```

### For Google Cloud TTS:
```python
voice = texttospeech.VoiceSelectionParams(
    language_code="en-US",
    ssml_gender=texttospeech.SsmlVoiceGender.FEMALE,
    name="en-US-Neural2-F"  # High-quality neural voice
)
```

## Deployment Strategy

### Phase 1: Development (Week 1)
1. Set up basic voice assistant on i9 laptop
2. Test speech recognition and TTS
3. Implement basic command processing

### Phase 2: Enhancement (Week 2-3)
1. Add AI conversation capabilities
2. Implement female voice personality
3. Add cross-device sync

### Phase 3: Deployment (Week 4)
1. Deploy lightweight version to i5 PC
2. Set up automatic startup
3. Configure network access for cross-device use

## Next Steps

1. **Choose your path** based on your technical comfort level
2. **Start with Path 1** (Mozilla DeepSpeech) if you're new to AI development
3. **Upgrade to Path 2** (Google Cloud) for better quality
4. **Move to Path 3** (Local Ollama) for maximum privacy and unlimited usage

## Troubleshooting

### Common Issues:
- **Microphone not working**: Check audio device permissions
- **TTS not speaking**: Verify audio output devices
- **Import errors**: Ensure all dependencies are installed
- **Performance issues on i5 PC**: Use lighter models or cloud services

### Getting Help:
- Join Reddit communities: r/LocalLLaMA, r/MachineLearning
- GitHub repositories for each solution have active communities
- Discord servers for AI development projects