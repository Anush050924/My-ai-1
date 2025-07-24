// JARVIS-like AI Assistant Application - Fixed Navigation

class LinaAIAssistant {
    constructor() {
        this.currentSection = 'welcome';
        this.isListening = false;
        this.isProcessing = false;
        this.conversationHistory = [];
        this.currentFile = 'stt';
        
        this.init();
    }

    init() {
        // Initialize in correct order with delays to ensure DOM is ready
        setTimeout(() => {
            this.setupNavigation();
        }, 50);
        
        setTimeout(() => {
            this.setupCodeFunctionality();
        }, 100);
        
        setTimeout(() => {
            this.setupDemo();
        }, 150);
        
        setTimeout(() => {
            this.setupConfiguration();
        }, 200);
        
        this.updateStatus('System Ready');
    }

    // Navigation System - Completely rewritten for reliability
    setupNavigation() {
        console.log('Setting up navigation...');
        
        // Get all navigation elements
        const navButtons = document.querySelectorAll('.nav-btn');
        const sections = document.querySelectorAll('.section');
        
        console.log('Found nav buttons:', navButtons.length);
        console.log('Found sections:', sections.length);

        // Clear any existing event listeners and add new ones
        navButtons.forEach((btn, index) => {
            // Create a clean event handler
            const handleNavClick = (e) => {
                e.preventDefault();
                e.stopPropagation();
                
                const targetSection = btn.getAttribute('data-section');
                console.log(`Navigation clicked: ${targetSection}`);
                
                if (targetSection && targetSection !== this.currentSection) {
                    this.switchSection(targetSection);
                }
            };
            
            // Remove any existing listeners and add new one
            btn.removeEventListener('click', handleNavClick);
            btn.addEventListener('click', handleNavClick);
            
            console.log(`Added listener to button ${index}: ${btn.getAttribute('data-section')}`);
        });
    }

    switchSection(targetSection) {
        console.log(`Switching to section: ${targetSection}`);
        
        // Get all navigation buttons and sections fresh each time
        const navButtons = document.querySelectorAll('.nav-btn');
        const sections = document.querySelectorAll('.section');
        
        // Remove active class from all nav buttons
        navButtons.forEach(btn => {
            btn.classList.remove('active');
        });
        
        // Add active class to target button
        const targetButton = document.querySelector(`[data-section="${targetSection}"]`);
        if (targetButton) {
            targetButton.classList.add('active');
            console.log(`Activated button for: ${targetSection}`);
        }
        
        // Hide all sections
        sections.forEach(section => {
            section.classList.remove('active');
            console.log(`Hiding section: ${section.id}`);
        });
        
        // Show target section
        const targetSectionElement = document.getElementById(targetSection);
        if (targetSectionElement) {
            targetSectionElement.classList.add('active');
            console.log(`Showing section: ${targetSection}`);
            
            // Update current section
            this.currentSection = targetSection;
            
            // Update status
            const sectionName = targetSection.charAt(0).toUpperCase() + targetSection.slice(1);
            this.updateStatus(`Viewing ${sectionName}`);
            
            // Initialize section-specific functionality
            this.initializeSectionFeatures(targetSection);
        } else {
            console.error(`Section element not found: ${targetSection}`);
        }
    }

    initializeSectionFeatures(section) {
        switch(section) {
            case 'demo':
                this.setupDemoFeatures();
                break;
            case 'code':
                this.setupCodeFeatures();
                break;
            case 'config':
                this.setupConfigFeatures();
                break;
        }
    }

    // Code Section Functionality - Simplified
    setupCodeFunctionality() {
        console.log('Setting up code functionality...');
        this.setupFileTabs();
    }

    setupCodeFeatures() {
        // Re-initialize file tabs when entering code section
        this.setupFileTabs();
    }

    setupFileTabs() {
        const tabButtons = document.querySelectorAll('.tab-btn');
        const fileContents = document.querySelectorAll('.file-content');
        
        console.log('Found tab buttons:', tabButtons.length);
        
        tabButtons.forEach((btn, index) => {
            const handleTabClick = (e) => {
                e.preventDefault();
                e.stopPropagation();
                
                const targetFile = btn.getAttribute('data-file');
                console.log(`File tab clicked: ${targetFile}`);
                
                if (targetFile) {
                    // Update active tab
                    tabButtons.forEach(t => t.classList.remove('active'));
                    btn.classList.add('active');
                    
                    // Update active file content
                    fileContents.forEach(f => f.classList.remove('active'));
                    const targetContent = document.getElementById(`file-${targetFile}`);
                    if (targetContent) {
                        targetContent.classList.add('active');
                        this.currentFile = targetFile;
                        console.log(`Switched to file: ${targetFile}`);
                    }
                }
            };
            
            // Remove existing listener and add new one
            btn.removeEventListener('click', handleTabClick);
            btn.addEventListener('click', handleTabClick);
        });
    }

    // Demo Section Functionality
    setupDemo() {
        console.log('Setting up demo...');
        this.initializeDemoResponses();
    }

    setupDemoFeatures() {
        console.log('Initializing demo features...');
        
        // Setup chat interface
        const chatInput = document.getElementById('chatInput');
        const sendBtn = document.getElementById('sendBtn');

        if (chatInput && sendBtn) {
            console.log('Setting up chat interface...');
            
            const handleSend = (e) => {
                e.preventDefault();
                this.sendMessage();
            };
            
            // Remove existing listeners
            sendBtn.removeEventListener('click', handleSend);
            sendBtn.addEventListener('click', handleSend);

            chatInput.removeEventListener('keypress', this.handleChatKeypress);
            this.handleChatKeypress = (e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    this.sendMessage();
                }
            };
            chatInput.addEventListener('keypress', this.handleChatKeypress);
        }

        // Setup voice button
        const voiceBtn = document.getElementById('voiceBtn');
        const toggleVoiceBtn = document.getElementById('toggleVoice');

        if (voiceBtn) {
            const handleVoice = (e) => {
                e.preventDefault();
                this.toggleVoiceRecognition();
            };
            
            voiceBtn.removeEventListener('click', handleVoice);
            voiceBtn.addEventListener('click', handleVoice);
        }

        if (toggleVoiceBtn) {
            const handleToggleVoice = (e) => {
                e.preventDefault();
                this.toggleVoiceRecognition();
            };
            
            toggleVoiceBtn.removeEventListener('click', handleToggleVoice);
            toggleVoiceBtn.addEventListener('click', handleToggleVoice);
        }

        // Setup demo controls
        const testTTSBtn = document.getElementById('testTTS');
        const responseModeSelect = document.getElementById('responseMode');

        if (testTTSBtn) {
            const handleTTS = (e) => {
                e.preventDefault();
                this.testTextToSpeech();
            };
            
            testTTSBtn.removeEventListener('click', handleTTS);
            testTTSBtn.addEventListener('click', handleTTS);
        }

        if (responseModeSelect) {
            const handleModeChange = (e) => {
                this.updateResponseMode(e.target.value);
            };
            
            responseModeSelect.removeEventListener('change', handleModeChange);
            responseModeSelect.addEventListener('change', handleModeChange);
        }
    }

    initializeDemoResponses() {
        this.aiResponses = {
            helpful: [
                "I'm here to help! What would you like to know?",
                "How can I assist you today?",
                "I'd be happy to help you with that.",
                "Let me help you find the information you need.",
                "Is there anything specific I can help you with?"
            ],
            creative: [
                "That's an interesting question! Let me think creatively about this...",
                "I love exploring new ideas! Here's a creative perspective...",
                "Let's approach this from a unique angle...",
                "That sparks some creative thoughts! Consider this...",
                "What an imaginative question! Here's what I'm thinking..."
            ],
            analytical: [
                "Let me analyze this systematically for you.",
                "Based on the data and logic, here's my assessment:",
                "Breaking this down analytically...",
                "From a technical perspective, I would say:",
                "Let me process this information logically..."
            ]
        };

        this.currentResponseMode = 'helpful';
    }

    // Chat System
    sendMessage() {
        const chatInput = document.getElementById('chatInput');
        if (!chatInput) {
            console.log('Chat input not found');
            return;
        }
        
        const message = chatInput.value.trim();
        
        if (!message) {
            console.log('Empty message');
            return;
        }

        console.log('Sending message:', message);

        // Add user message to chat
        this.addMessageToChat(message, 'user');
        chatInput.value = '';

        // Show processing state
        this.updateStatus('Processing...');
        this.isProcessing = true;

        // Simulate AI processing delay
        setTimeout(() => {
            const aiResponse = this.generateAIResponse(message);
            this.addMessageToChat(aiResponse, 'ai');
            this.updateStatus('Ready');
            this.isProcessing = false;
        }, 1000 + Math.random() * 2000); // 1-3 second delay
    }

    addMessageToChat(message, sender) {
        const chatMessages = document.getElementById('chatMessages');
        if (!chatMessages) {
            console.log('Chat messages container not found');
            return;
        }
        
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${sender}-message`;

        const now = new Date();
        const timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

        messageDiv.innerHTML = `
            <div class="message-content">${message}</div>
            <div class="message-time">${timeString}</div>
        `;

        chatMessages.appendChild(messageDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;

        // Store in conversation history
        this.conversationHistory.push({ sender, message, timestamp: now });
        
        console.log(`Added ${sender} message:`, message);
    }

    generateAIResponse(userMessage) {
        const lowerMessage = userMessage.toLowerCase();
        
        // Context-aware responses
        if (lowerMessage.includes('hello') || lowerMessage.includes('hi')) {
            return "Hello! I'm Lina, your AI assistant. I'm excited to help you today!";
        }
        
        if (lowerMessage.includes('jarvis') || lowerMessage.includes('iron man')) {
            return "Indeed! I'm inspired by JARVIS from Iron Man. I aim to be just as helpful and intelligent, though I'm still learning and growing!";
        }
        
        if (lowerMessage.includes('voice') || lowerMessage.includes('speak')) {
            return "My voice synthesis is powered by XTTS-v2, giving me a natural female voice with emotional expression. In the full implementation, I can speak your responses aloud!";
        }
        
        if (lowerMessage.includes('code') || lowerMessage.includes('programming')) {
            return "I can help with coding! The complete implementation includes Python modules for speech recognition, text-to-speech, and AI chat. Check out the Code Structure section for all the details!";
        }
        
        if (lowerMessage.includes('install') || lowerMessage.includes('setup')) {
            return "Setting me up is straightforward! Follow the Setup Guide section - you'll need Python 3.11+, install the dependencies, download the AI models, and run the code. I'll guide you through each step!";
        }

        if (lowerMessage.includes('thank')) {
            return "You're very welcome! I'm always here to help. Is there anything else you'd like to know about my capabilities?";
        }

        // Default responses based on mode
        const responses = this.aiResponses[this.currentResponseMode];
        const randomResponse = responses[Math.floor(Math.random() * responses.length)];
        
        // Add some context to the response
        const contextualResponses = [
            `${randomResponse} You asked about "${userMessage}" - that's a great question!`,
            `${randomResponse} Regarding "${userMessage}", I can provide some insights.`,
            `${randomResponse} Your question about "${userMessage}" is quite interesting!`
        ];
        
        return contextualResponses[Math.floor(Math.random() * contextualResponses.length)];
    }

    // Voice Recognition Simulation
    toggleVoiceRecognition() {
        const voiceBtn = document.getElementById('voiceBtn');
        const toggleVoiceBtn = document.getElementById('toggleVoice');
        
        this.isListening = !this.isListening;
        
        if (this.isListening) {
            this.startVoiceRecognition();
            if (voiceBtn) voiceBtn.classList.add('active');
            if (toggleVoiceBtn) toggleVoiceBtn.textContent = 'Stop Listening';
            this.updateStatus('Listening...');
        } else {
            this.stopVoiceRecognition();
            if (voiceBtn) voiceBtn.classList.remove('active');
            if (toggleVoiceBtn) toggleVoiceBtn.textContent = 'Start Listening';
            this.updateStatus('Ready');
        }
    }

    startVoiceRecognition() {
        // Simulate voice recognition
        this.voiceTimeout = setTimeout(() => {
            if (this.isListening) {
                const demoInputs = [
                    "Hello Lina, how are you today?",
                    "Can you tell me about your capabilities?",
                    "How do I install and set you up?",
                    "What programming languages do you support?",
                    "Can you help me with coding questions?"
                ];
                
                const randomInput = demoInputs[Math.floor(Math.random() * demoInputs.length)];
                const chatInput = document.getElementById('chatInput');
                if (chatInput) {
                    chatInput.value = randomInput;
                }
                
                // Auto-send after a short delay
                setTimeout(() => {
                    if (this.isListening) {
                        this.sendMessage();
                        this.toggleVoiceRecognition(); // Stop listening
                    }
                }, 1000);
            }
        }, 2000 + Math.random() * 3000); // 2-5 second delay
    }

    stopVoiceRecognition() {
        if (this.voiceTimeout) {
            clearTimeout(this.voiceTimeout);
            this.voiceTimeout = null;
        }
    }

    // Text-to-Speech Demo
    testTextToSpeech() {
        const testTTSBtn = document.getElementById('testTTS');
        if (!testTTSBtn) return;
        
        const originalText = testTTSBtn.textContent;
        
        testTTSBtn.textContent = 'Speaking...';
        testTTSBtn.disabled = true;
        
        this.updateStatus('Synthesizing speech...');
        
        // Simulate TTS processing
        setTimeout(() => {
            this.addMessageToChat("This is a demonstration of my text-to-speech capabilities. In the full implementation, you would hear my natural female voice speaking this message!", 'ai');
            
            testTTSBtn.textContent = originalText;
            testTTSBtn.disabled = false;
            this.updateStatus('Ready');
        }, 2000);
    }

    updateResponseMode(mode) {
        this.currentResponseMode = mode;
        this.updateStatus(`Response mode: ${mode}`);
        
        const modeMessages = {
            helpful: "I'm now in helpful assistant mode. I'll focus on providing clear, practical assistance.",
            creative: "I'm now in creative mode. I'll approach questions with imagination and original thinking.",
            analytical: "I'm now in analytical mode. I'll provide logical, data-driven responses."
        };
        
        this.addMessageToChat(modeMessages[mode], 'ai');
    }

    // Configuration Management
    setupConfiguration() {
        console.log('Setting up configuration...');
    }

    setupConfigFeatures() {
        console.log('Initializing config features...');
        
        const saveBtn = document.querySelector('.config-actions .btn--primary');
        if (saveBtn) {
            const handleSave = (e) => {
                e.preventDefault();
                this.saveConfiguration();
            };
            
            saveBtn.removeEventListener('click', handleSave);
            saveBtn.addEventListener('click', handleSave);
        }
    }

    saveConfiguration() {
        this.updateStatus('Configuration saved');
        
        // Simulate saving
        setTimeout(() => {
            this.updateStatus('Ready');
        }, 1000);
    }

    // Utility Functions
    updateStatus(message) {
        const statusText = document.getElementById('statusText');
        const statusDot = document.getElementById('statusDot');
        const aiStatus = document.getElementById('aiStatus');
        
        if (statusText) statusText.textContent = message;
        if (aiStatus) aiStatus.textContent = message;
        
        // Update status dot color based on state
        if (statusDot) {
            statusDot.className = 'status-dot';
            if (message.includes('Processing') || message.includes('Listening')) {
                statusDot.style.background = 'var(--color-warning)';
            } else if (message.includes('Error')) {
                statusDot.style.background = 'var(--color-error)';
            } else {
                statusDot.style.background = 'var(--jarvis-accent)';
            }
        }
        
        console.log('Status updated:', message);
    }

    showCopyFeedback(button, message = 'Copied!') {
        const originalText = button.textContent;
        button.textContent = message;
        button.style.background = 'var(--color-success)';
        
        setTimeout(() => {
            button.textContent = originalText;
            button.style.background = '';
        }, 1500);
    }
}

// Global utility functions for copy functionality
function copyToClipboard(text) {
    if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(text).then(() => {
            console.log('Text copied to clipboard');
        }).catch(err => {
            console.error('Failed to copy text: ', err);
            fallbackCopyTextToClipboard(text);
        });
    } else {
        fallbackCopyTextToClipboard(text);
    }
}

function fallbackCopyTextToClipboard(text) {
    const textArea = document.createElement("textarea");
    textArea.value = text;
    textArea.style.top = "0";
    textArea.style.left = "0";
    textArea.style.position = "fixed";
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    
    try {
        document.execCommand('copy');
        console.log('Fallback: Text copied to clipboard');
    } catch (err) {
        console.error('Fallback: Failed to copy text: ', err);
    }
    
    document.body.removeChild(textArea);
}

// Specific copy functions called by onclick handlers
function copyRequirements() {
    const requirementsText = `vosk==0.3.45
whisper-cpp-python==1.1.0
pyaudio==0.2.14
TTS==0.22.0
webrtcvad==2.0.10
pyttsx3==2.90
ollama-python==0.1.7
langchain==0.2.0
sentence-transformers==2.7.0
faiss-cpu==1.8.0
fastapi==0.111.0
uvicorn[standard]==0.30.0
websockets==12.0
pydantic==2.8
python-dotenv`;
    
    copyToClipboard(requirementsText);
    
    const button = event.target;
    const originalText = button.textContent;
    button.textContent = 'Copied!';
    button.style.background = 'var(--color-success)';
    
    setTimeout(() => {
        button.textContent = originalText;
        button.style.background = '';
    }, 1500);
}

function copyFileContent(fileType) {
    const fileContents = {
        stt: `from vosk import Model, KaldiRecognizer
import pyaudio, queue, json, threading

MODEL_PATH = "models/vosk-model-small-en-us"
model = Model(MODEL_PATH)
rec = KaldiRecognizer(model, 16000)
audio_q = queue.Queue()

def mic_worker():
    pa = pyaudio.PyAudio()
    stream = pa.open(format=pyaudio.paInt16, channels=1, rate=16000,
                     input=True, frames_per_buffer=8000)
    while True:
        audio_q.put(stream.read(4000, exception_on_overflow=False))

threading.Thread(target=mic_worker, daemon=True).start()

def listen():
    while True:
        if rec.AcceptWaveform(audio_q.get()):
            res = json.loads(rec.Result())["text"]
            if res: yield res`,
        tts: `from TTS.api import TTS
tts = TTS("tts_models/multilingual/multi-dataset/xtts_v2", gpu=False)

def speak(text, ref_voice=None, lang="en"):
    tts.tts_to_file(text=text, file_path="tmp.wav", 
                    speaker_wav=ref_voice, language=lang)
    import playsound
    playsound.playsound("tmp.wav", False)`,
        chat: `from ollama import Client
from langchain.llms.ollama import Ollama
from datetime import datetime

ollama_client = Client(host="http://localhost:11434")
llm = Ollama(model="phi3:mini", temperature=0.4, base_url=ollama_client.host)

SYSTEM_PROMPT = """
You are Lina, a warm female AI assistant.
You must only obey your owner Anushwer.
Be concise, empathetic if user sounds upset.
"""

def chat(history, user):
    msgs = [{"role":"system","content":SYSTEM_PROMPT}] + history + [{"role":"user","content":user}]
    resp = llm.invoke(msgs, stream=False)
    return resp`,
        server: `from fastapi import FastAPI, WebSocket
from speech import stt, tts
from llm.chat import chat
import asyncio

app = FastAPI()
history=[]

@app.websocket("/ws")
async def jarvis(ws: WebSocket):
    await ws.accept()
    async for line in stream_stt():
        answer = chat(history, line)
        history.append({"role":"user","content":line})
        history.append({"role":"assistant","content":answer})
        await ws.send_json({"text":answer})
        tts.speak(answer)

async def stream_stt():
    for text in stt.listen():
        yield text

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, port=8000)`,
        main: `import subprocess, threading, webbrowser, os

threading.Thread(target=lambda: subprocess.run("ollama serve"),daemon=True).start()
threading.Thread(target=lambda: os.system("python api/server.py"),daemon=True).start()
webbrowser.open("http://localhost:8000")

while True: pass`
    };
    
    const content = fileContents[fileType];
    if (content) {
        copyToClipboard(content);
        
        const button = event.target;
        const originalText = button.textContent;
        button.textContent = 'Copied!';
        button.style.background = 'var(--color-success)';
        
        setTimeout(() => {
            button.textContent = originalText;
            button.style.background = '';
        }, 1500);
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded, initializing Lina AI...');
    
    // Initialize with a slight delay to ensure everything is ready
    setTimeout(() => {
        window.linaAI = new LinaAIAssistant();
        console.log('Lina AI initialized');
        
        // Add welcome animations
        setTimeout(() => {
            const welcomeElements = document.querySelectorAll('.feature-card');
            welcomeElements.forEach((element, index) => {
                setTimeout(() => {
                    element.style.transform = 'translateY(0)';
                    element.style.opacity = '1';
                }, index * 200);
            });
        }, 500);
    }, 300);
});

// Set initial loading state for animations
document.addEventListener('DOMContentLoaded', () => {
    const featureCards = document.querySelectorAll('.feature-card');
    featureCards.forEach(card => {
        card.style.transform = 'translateY(20px)';
        card.style.opacity = '0';
        card.style.transition = 'all 0.6s ease';
    });
});

// Export for testing
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { LinaAIAssistant, copyToClipboard };
}