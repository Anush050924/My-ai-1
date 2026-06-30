/**
 * Radha AI - Step 1 Frontend
 * Futuristic dashboard with browser-native speech recognition and synthesis
 * Exclusive to user: Anushwer
 */

class RadhaAI {
    constructor() {
        this.userId = "Anushwer";
        this.currentModule = "chat";
        this.conversationHistory = [];
        this.isListening = false;
        this.isSpeaking = false;
        this.speechEnabled = false;
        this.backendUrl = "http://localhost:5000";
        
        // Browser API support detection
        this.SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        this.speechSynthesis = window.speechSynthesis;
        
        this.init();
    }

    async init() {
        console.log("✨ Initializing Radha AI for", this.userId);
        this.setupEventListeners();
        this.setupModuleNavigation();
        this.setupChatInterface();
        this.setupSonicLab();
        await this.checkBackendConnection();
    }

    // ===== MODULE NAVIGATION =====
    setupModuleNavigation() {
        const navItems = document.querySelectorAll(".nav-item");
        navItems.forEach(item => {
            item.addEventListener("click", (e) => {
                const module = item.dataset.module;
                this.switchModule(module);
            });
        });
    }

    switchModule(module) {
        // Update sidebar
        document.querySelectorAll(".nav-item").forEach(item => {
            item.classList.remove("active");
        });
        document.querySelector(`[data-module="${module}"]`).classList.add("active");

        // Update module display
        document.querySelectorAll(".module-panel").forEach(panel => {
            panel.classList.remove("active");
        });
        document.getElementById(`${module}Module`).classList.add("active");

        // Update header
        const titles = {
            chat: { title: "Radha Core Chat", subtitle: "Conversational interface with full history" },
            creative: { title: "Creative Studio", subtitle: "Advanced writing and content creation tools" },
            visual: { title: "Visual Forge", subtitle: "Design interface with 3D visualization canvas" },
            sonic: { title: "Sonic Lab", subtitle: "Music generation and control" },
            film: { title: "Film Studio", subtitle: "Story workspace with timeline management" }
        };

        const info = titles[module];
        document.getElementById("moduleTitle").textContent = info.title;
        document.getElementById("moduleSubtitle").textContent = info.subtitle;

        this.currentModule = module;
    }

    // ===== CHAT INTERFACE =====
    setupChatInterface() {
        const userInput = document.getElementById("userInput");
        const sendBtn = document.getElementById("sendBtn");
        const voiceBtn = document.getElementById("voiceBtn");
        const clearChatBtn = document.getElementById("clearChatBtn");
        const speakToggle = document.getElementById("speakToggle");

        // Send message
        sendBtn.addEventListener("click", () => this.sendMessage());
        userInput.addEventListener("keypress", (e) => {
            if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                this.sendMessage();
            }
        });

        // Voice input
        if (this.SpeechRecognition) {
            voiceBtn.addEventListener("click", () => this.toggleVoiceRecognition());
        } else {
            voiceBtn.disabled = true;
            voiceBtn.title = "Voice recognition not supported";
        }

        // Clear chat
        clearChatBtn.addEventListener("click", () => this.clearChat());

        // Speech toggle
        if (this.speechSynthesis) {
            speakToggle.addEventListener("click", () => this.toggleSpeech());
        } else {
            speakToggle.disabled = true;
        }
    }

    async sendMessage() {
        const userInput = document.getElementById("userInput");
        const message = userInput.value.trim();

        if (!message) return;

        // Add user message to chat
        this.addMessageToChat(message, "user");
        userInput.value = "";

        // Update status
        this.updateStatus("Processing...");

        try {
            // Send to backend
            const response = await fetch(`${this.backendUrl}/api/chat`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    user_id: this.userId,
                    message: message,
                    history: this.conversationHistory
                })
            });

            if (!response.ok) {
                throw new Error(`API error: ${response.status}`);
            }

            const data = await response.json();

            if (data.success) {
                const radhResponse = data.radha_response;
                this.addMessageToChat(radhResponse, "ai");
                
                // Store in history
                this.conversationHistory.push({
                    role: "user",
                    content: message
                });
                this.conversationHistory.push({
                    role: "assistant",
                    content: radhResponse
                });

                // Speak response if enabled
                if (this.speechEnabled) {
                    this.speak(radhResponse);
                }
            }
        } catch (error) {
            console.error("Error:", error);
            this.addMessageToChat("Sorry, I encountered an error. Please try again.", "ai");
        }

        this.updateStatus("Ready");
    }

    addMessageToChat(message, sender) {
        const chatWindow = document.getElementById("chatWindow");

        // Remove welcome message on first message
        if (sender === "user" && chatWindow.querySelector(".welcome-message")) {
            chatWindow.innerHTML = "";
        }

        const messageDiv = document.createElement("div");
        messageDiv.className = `chat-message ${sender}`;

        const contentDiv = document.createElement("div");
        contentDiv.className = "message-content";
        contentDiv.innerHTML = this.parseMarkdown(message);

        messageDiv.appendChild(contentDiv);
        chatWindow.appendChild(messageDiv);
        chatWindow.scrollTop = chatWindow.scrollHeight;
    }

    parseMarkdown(text) {
        // Basic markdown parsing
        let parsed = text;
        
        // Bold
        parsed = parsed.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
        
        // Italic
        parsed = parsed.replace(/\*(.*?)\*/g, "<em>$1</em>");
        
        // Links
        parsed = parsed.replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" target="_blank">$1</a>');
        
        // Line breaks
        parsed = parsed.replace(/\n/g, "<br>");
        
        return parsed;
    }

    clearChat() {
        const chatWindow = document.getElementById("chatWindow");
        this.conversationHistory = [];
        chatWindow.innerHTML = `
            <div class="welcome-message">
                <div class="welcome-icon">✨</div>
                <h2>Welcome to Radha</h2>
                <p>Your personal AI companion, built exclusively for you, Anushwer.</p>
            </div>
        `;
    }

    // ===== VOICE RECOGNITION =====
    toggleVoiceRecognition() {
        if (!this.SpeechRecognition) {
            alert("Speech recognition not supported in your browser");
            return;
        }

        if (this.isListening) {
            this.stopListening();
        } else {
            this.startListening();
        }
    }

    startListening() {
        const recognition = new this.SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = true;
        recognition.language = "en-US";

        const voiceBtn = document.getElementById("voiceBtn");
        const userInput = document.getElementById("userInput");

        recognition.onstart = () => {
            this.isListening = true;
            voiceBtn.classList.add("active");
            this.updateStatus("Listening...");
        };

        recognition.onresult = (event) => {
            let interimTranscript = "";
            for (let i = event.resultIndex; i < event.results.length; i++) {
                const transcript = event.results[i][0].transcript;
                if (event.results[i].isFinal) {
                    userInput.value += transcript + " ";
                } else {
                    interimTranscript += transcript;
                }
            }
            if (interimTranscript) {
                userInput.placeholder = `Hearing: ${interimTranscript}`;
            }
        };

        recognition.onerror = (event) => {
            console.error("Speech recognition error:", event.error);
            this.updateStatus("Mic error");
        };

        recognition.onend = () => {
            this.isListening = false;
            voiceBtn.classList.remove("active");
            userInput.placeholder = "Type your message or use voice...";
            this.updateStatus("Ready");
        };

        recognition.start();
    }

    stopListening() {
        if (this.isListening && this.SpeechRecognition) {
            // Implementation would stop the current recognition
            this.isListening = false;
        }
    }

    // ===== TEXT-TO-SPEECH =====
    toggleSpeech() {
        this.speechEnabled = !this.speechEnabled;
        const speakToggle = document.getElementById("speakToggle");
        speakToggle.textContent = this.speechEnabled ? "🔊 On" : "🔊 Off";
    }

    speak(text) {
        if (!this.speechSynthesis || this.isSpeaking) return;

        // Cancel any ongoing speech
        this.speechSynthesis.cancel();

        const utterance = new SpeechSynthesisUtterance(text);
        
        // Find female voice
        const voices = this.speechSynthesis.getVoices();
        const femaleVoice = voices.find(voice => 
            voice.name.includes("Female") || 
            voice.name.includes("female") ||
            voice.name.includes("woman") ||
            voice.name.includes("Zira") ||
            voice.name.includes("Samantha") ||
            voice.name.includes("Victoria")
        ) || voices.find(voice => voice.lang.startsWith("en")) || voices[0];

        if (femaleVoice) {
            utterance.voice = femaleVoice;
        }

        utterance.rate = 0.95;
        utterance.pitch = 1.0;
        utterance.volume = 0.8;

        utterance.onstart = () => {
            this.isSpeaking = true;
        };

        utterance.onend = () => {
            this.isSpeaking = false;
        };

        this.speechSynthesis.speak(utterance);
    }

    // ===== SONIC LAB =====
    setupSonicLab() {
        const tempoRange = document.querySelector("#sonicModule input[type='range']");
        if (tempoRange) {
            tempoRange.addEventListener("input", (e) => {
                document.getElementById("tempoValue").textContent = e.target.value;
            });
        }
    }

    // ===== UTILITY =====
    updateStatus(message) {
        const statusText = document.getElementById("statusText");
        const statusDot = document.getElementById("statusIndicator");
        
        if (statusText) statusText.textContent = message;
        
        if (statusDot) {
            if (message === "Ready") {
                statusDot.style.background = "var(--accent-primary)";
            } else if (message.includes("Error")) {
                statusDot.style.background = "#ff6b6b";
            } else {
                statusDot.style.background = "#ffd93d";
            }
        }
    }

    async checkBackendConnection() {
        try {
            const response = await fetch(`${this.backendUrl}/api/health`);
            if (response.ok) {
                console.log("✅ Backend connected successfully");
                this.updateStatus("Ready");
            }
        } catch (error) {
            console.warn("⚠️ Backend not available:", error);
            this.updateStatus("Offline mode");
        }
    }

    setupEventListeners() {
        // Ensure voices are loaded before using them
        if (this.speechSynthesis) {
            this.speechSynthesis.onvoiceschanged = () => {
                console.log("Voices loaded");
            };
        }
    }
}

// Initialize Radha AI when DOM is ready
document.addEventListener("DOMContentLoaded", () => {
    console.log("🚀 Radha AI Dashboard Loading...");
    window.radhaAI = new RadhaAI();
});
