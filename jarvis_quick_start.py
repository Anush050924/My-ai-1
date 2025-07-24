"""
JARVIS Voice Assistant - Quick Start Version
This is a minimal working example you can run right away!

Requirements:
pip install SpeechRecognition pyttsx3 pyaudio

For Windows users, you might need:
pip install pywin32

For Linux users, you might need:
sudo apt-get install espeak espeak-data libespeak1 libespeak-dev
"""

import speech_recognition as sr
import pyttsx3
import threading
import time
import sys

class SimpleJarvis:
    def __init__(self):
        print("Initializing JARVIS...")

        # Initialize speech recognition
        self.recognizer = sr.Recognizer()
        self.microphone = sr.Microphone()

        # Initialize text-to-speech
        self.tts_engine = pyttsx3.init()

        # Configure female voice if available
        self.setup_voice()

        # Adjust for ambient noise
        print("Adjusting for ambient noise... Please wait.")
        with self.microphone as source:
            self.recognizer.adjust_for_ambient_noise(source, duration=2)
        print("Ready!")

    def setup_voice(self):
        """Configure the voice to be female if possible"""
        voices = self.tts_engine.getProperty('voices')

        # Try to find a female voice
        female_voice = None
        for voice in voices:
            if voice.id:
                # Common female voice indicators
                if any(word in voice.name.lower() for word in ['female', 'woman', 'zira', 'hazel', 'susan']):
                    female_voice = voice.id
                    break

        if female_voice:
            self.tts_engine.setProperty('voice', female_voice)
            print(f"Using female voice: {voices[0].name if voices else 'System default'}")
        else:
            print("Using default voice (female voice not found)")

        # Set speech rate and volume
        self.tts_engine.setProperty('rate', 180)  # Speed (words per minute)
        self.tts_engine.setProperty('volume', 0.9)  # Volume (0.0 to 1.0)

    def speak(self, text):
        """Convert text to speech"""
        print(f"JARVIS: {text}")
        self.tts_engine.say(text)
        self.tts_engine.runAndWait()

    def listen(self, timeout=5):
        """Listen for voice input"""
        try:
            print("Listening...")
            with self.microphone as source:
                # Listen for audio with timeout
                audio = self.recognizer.listen(source, timeout=timeout, phrase_time_limit=5)

            print("Processing...")
            # Use Google's free speech recognition
            text = self.recognizer.recognize_google(audio)
            print(f"You said: {text}")
            return text.lower()

        except sr.WaitTimeoutError:
            return ""
        except sr.UnknownValueError:
            return ""
        except sr.RequestError as e:
            print(f"Could not request results; {e}")
            return ""

    def process_command(self, command):
        """Process voice commands"""
        if not command:
            return True

        # Activation words
        if any(word in command for word in ['jarvis', 'hey jarvis', 'hello jarvis']):
            responses = [
                "Yes, how can I help you?",
                "I'm here. What do you need?",
                "Hello! How may I assist you?",
                "At your service. What can I do for you?"
            ]
            import random
            self.speak(random.choice(responses))
            return True

        # Basic commands
        if 'hello' in command or 'hi' in command:
            self.speak("Hello! I'm JARVIS, your AI assistant. Say 'Hey JARVIS' to get my attention.")

        elif 'time' in command:
            import datetime
            now = datetime.datetime.now()
            time_str = now.strftime("%I:%M %p")
            self.speak(f"The current time is {time_str}")

        elif 'date' in command:
            import datetime
            now = datetime.datetime.now()
            date_str = now.strftime("%A, %B %d, %Y")
            self.speak(f"Today is {date_str}")

        elif 'weather' in command:
            self.speak("I don't have access to weather data yet, but I'm learning! This feature will be added soon.")

        elif 'who are you' in command or 'what are you' in command:
            self.speak("I am JARVIS, your personal AI assistant. I'm here to help you with various tasks through voice commands.")

        elif 'what can you do' in command or 'help' in command:
            self.speak("I can tell you the time and date, respond to greetings, and have basic conversations. Say 'Hey JARVIS' to get my attention, or say 'goodbye' to exit.")

        elif 'goodbye' in command or 'exit' in command or 'quit' in command:
            self.speak("Goodbye! It was nice talking with you. Have a great day!")
            return False

        else:
            # If command contains 'jarvis' but we don't understand it
            if 'jarvis' in command:
                responses = [
                    "I heard you, but I'm not sure how to help with that yet. Try asking for help to see what I can do.",
                    "I'm still learning. Could you try rephrasing that?",
                    "I didn't understand that command. Say 'help' to see what I can do."
                ]
                import random
                self.speak(random.choice(responses))

        return True

    def run(self):
        """Main loop for the voice assistant"""
        self.speak("Hello! I'm JARVIS, your AI assistant. I'm ready to help you!")
        self.speak("Say 'Hey JARVIS' to get my attention, or 'help' to see what I can do.")

        try:
            while True:
                command = self.listen()
                if command:
                    should_continue = self.process_command(command)
                    if not should_continue:
                        break
                time.sleep(0.5)  # Small delay to prevent overwhelming the system

        except KeyboardInterrupt:
            self.speak("Shutting down. Goodbye!")
            sys.exit(0)

if __name__ == "__main__":
    print("=" * 50)
    print("JARVIS AI Assistant - Quick Start Version")
    print("=" * 50)
    print()
    print("Make sure you have a microphone connected and working.")
    print("Speak clearly and wait for the 'Listening...' prompt.")
    print("Press Ctrl+C to exit at any time.")
    print()

    try:
        jarvis = SimpleJarvis()
        jarvis.run()
    except Exception as e:
        print(f"Error: {e}")
        print("\nTroubleshooting tips:")
        print("1. Make sure your microphone is working")
        print("2. Check that you have an internet connection (for speech recognition)")
        print("3. Try running: pip install SpeechRecognition pyttsx3 pyaudio")
        print("4. On Linux, you might need: sudo apt-get install espeak")
