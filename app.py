"""
Radha AI - Step 1: Core Backend Server
A futuristic, multi-modal AI dashboard for Anushwer
Running on Flask with CORS enabled and cloud-safe architecture
"""

from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
import json
import os
from datetime import datetime

# Initialize Flask app
app = Flask(__name__)
CORS(app)

# Configuration
AUTHORIZED_USER = "Anushwer"
CSV_DATA = {}

def load_csv_data():
    """Dynamically load CSV data for Radha's knowledge base"""
    global CSV_DATA
    
    # Load AI assistant options
    if os.path.exists('ai_assistant_options.csv'):
        try:
            ai_options_df = pd.read_csv('ai_assistant_options.csv')
            CSV_DATA['ai_options'] = ai_options_df.to_dict('records')
        except Exception as e:
            print(f"Error loading ai_assistant_options.csv: {e}")
            CSV_DATA['ai_options'] = []
    
    # Load implementation guide
    if os.path.exists('implementation_guide.csv'):
        try:
            impl_guide_df = pd.read_csv('implementation_guide.csv')
            CSV_DATA['implementation'] = impl_guide_df.to_dict('records')
        except Exception as e:
            print(f"Error loading implementation_guide.csv: {e}")
            CSV_DATA['implementation'] = []

def verify_user(user_id):
    """
    Verify that the user is authorized
    Only 'Anushwer' is allowed access
    """
    return user_id == AUTHORIZED_USER

def generate_radha_response(user_message, conversation_history=None):
    """
    Generate Radha's response based on user input
    Uses CSV data to provide intelligent responses about features and architecture
    """
    if conversation_history is None:
        conversation_history = []
    
    user_lower = user_message.lower()
    
    # Greeting responses
    if any(word in user_lower for word in ['hello', 'hi', 'hey', 'greetings']):
        return {
            'response': "Hello! I'm Radha, your AI companion created exclusively for you, Anushwer. Welcome to Step 1 of the Radha AI dashboard. How can I assist you today?",
            'tone': 'warm'
        }
    
    # About Radha
    if any(word in user_lower for word in ['who are you', 'what are you', 'about radha', 'tell me about yourself']):
        return {
            'response': "I'm Radha, your personal AI assistant dashboard. I'm designed with multiple creative studios: a chat interface, creative writing tools, visual design forge, sonic lab for music, and film studio for storytelling. I'm built exclusively for you, Anushwer, with cloud-safe architecture.",
            'tone': 'informative'
        }
    
    # Features and capabilities
    if any(word in user_lower for word in ['features', 'capabilities', 'what can you do', 'modules']):
        features = [
            "🎙️ **Radha Core Chat** - Conversational interface with full history",
            "📝 **Creative Studio** - Advanced writing and content creation tools",
            "🎨 **Visual Forge** - Design interface with 3D visualization canvas",
            "🎵 **Sonic Lab** - Music generation and control (prompt, genre, mood, tempo, instruments)",
            "🎬 **Film Studio** - Story workspace with timeline management"
        ]
        return {
            'response': f"I have five main modules: {' | '.join(features)}",
            'tone': 'helpful'
        }
    
    # Architecture questions
    if any(word in user_lower for word in ['architecture', 'backend', 'how are you built', 'tech stack', 'technologies']):
        return {
            'response': f"I'm built on Flask with CORS enabled for cloud-safe operation. My backend loads dynamic data from CSV files, uses browser-native speech recognition and synthesis, and communicates via REST API. Zero desktop dependencies - completely web-based and secure.",
            'tone': 'technical'
        }
    
    # Setup and installation
    if any(word in user_lower for word in ['setup', 'install', 'how to run', 'start', 'launch']):
        return {
            'response': "To run me, open two terminals: First, run `python app.py` (I'll start on port 5000). Second, run `python3 -m http.server 8000` (frontend on port 8000). Then visit http://localhost:8000 in your browser. No complex dependencies needed!",
            'tone': 'helpful'
        }
    
    # AI models and options
    if any(word in user_lower for word in ['models', 'ai options', 'assistant options', 'which solution']):
        if CSV_DATA.get('ai_options'):
            models_list = ", ".join([opt.get('Name', 'Unknown') for opt in CSV_DATA['ai_options'][:3]])
            return {
                'response': f"I support multiple AI solutions including: {models_list}. Each has different strengths - some are best for local privacy, others excel at cloud features. Which interests you?",
                'tone': 'informative'
            }
    
    # Implementation guide
    if any(word in user_lower for word in ['implementation', 'guide', 'how to build', 'development']):
        if CSV_DATA.get('implementation'):
            return {
                'response': f"I have a complete implementation guide with {len(CSV_DATA['implementation'])} solutions ranked by setup time and capability. From quick-start (1-2 hours) to enterprise (4-6 hours). Which approach interests you?",
                'tone': 'helpful'
            }
    
    # Default creative response
    return {
        'response': f"Interesting question about '{user_message}'. I'm still learning about this topic. Feel free to ask about my features, architecture, setup instructions, or available AI models!",
        'tone': 'thoughtful'
    }

@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        'status': 'operational',
        'service': 'Radha AI Step 1',
        'timestamp': datetime.now().isoformat()
    }), 200

@app.route('/api/chat', methods=['POST'])
def chat_endpoint():
    """
    Main chat endpoint
    Requires 'user_id' and 'message' in JSON body
    Only 'Anushwer' is authorized
    """
    try:
        data = request.get_json()
        
        if not data:
            return jsonify({'error': 'No JSON data provided'}), 400
        
        user_id = data.get('user_id')
        message = data.get('message', '').strip()
        conversation_history = data.get('history', [])
        
        # Verify user authorization
        if not user_id:
            return jsonify({'error': 'user_id is required'}), 400
        
        if not verify_user(user_id):
            return jsonify({
                'error': f'Unauthorized: Access granted only to Anushwer. Received: {user_id}'
            }), 403
        
        if not message:
            return jsonify({'error': 'message cannot be empty'}), 400
        
        # Generate Radha's response
        radha_response = generate_radha_response(message, conversation_history)
        
        # Build response payload
        response_payload = {
            'success': True,
            'user_id': user_id,
            'user_message': message,
            'radha_response': radha_response['response'],
            'tone': radha_response.get('tone', 'neutral'),
            'timestamp': datetime.now().isoformat(),
            'conversation_length': len(conversation_history) + 1
        }
        
        return jsonify(response_payload), 200
    
    except Exception as e:
        return jsonify({
            'error': 'Internal server error',
            'details': str(e)
        }), 500

@app.route('/api/features', methods=['GET'])
def get_features():
    """Retrieve available AI assistant options"""
    user_id = request.args.get('user_id')
    
    if not user_id or not verify_user(user_id):
        return jsonify({'error': 'Unauthorized'}), 403
    
    return jsonify({
        'features': CSV_DATA.get('ai_options', []),
        'count': len(CSV_DATA.get('ai_options', []))
    }), 200

@app.route('/api/implementation', methods=['GET'])
def get_implementation():
    """Retrieve implementation guide data"""
    user_id = request.args.get('user_id')
    
    if not user_id or not verify_user(user_id):
        return jsonify({'error': 'Unauthorized'}), 403
    
    return jsonify({
        'guide': CSV_DATA.get('implementation', []),
        'count': len(CSV_DATA.get('implementation', []))
    }), 200

@app.route('/api/system-info', methods=['GET'])
def get_system_info():
    """Get system information for authorized users"""
    user_id = request.args.get('user_id')
    
    if not user_id or not verify_user(user_id):
        return jsonify({'error': 'Unauthorized'}), 403
    
    return jsonify({
        'service': 'Radha AI Step 1',
        'version': '1.0.0',
        'author': 'Built for Anushwer',
        'modules': [
            'Radha Core Chat',
            'Creative Studio',
            'Visual Forge',
            'Sonic Lab',
            'Film Studio'
        ],
        'api_version': 'v1',
        'timestamp': datetime.now().isoformat()
    }), 200

@app.errorhandler(404)
def not_found(error):
    """Handle 404 errors"""
    return jsonify({'error': 'Endpoint not found'}), 404

@app.errorhandler(500)
def server_error(error):
    """Handle 500 errors"""
    return jsonify({'error': 'Internal server error'}), 500

if __name__ == '__main__':
    # Load CSV data on startup
    load_csv_data()
    print("✨ Radha AI Step 1 Backend Starting...")
    print("📊 CSV Data loaded:", list(CSV_DATA.keys()))
    print("🔐 Authorized user: Anushwer")
    print("🚀 Running on http://localhost:5000")
    print("⚙️ CORS enabled for frontend communication")
    
    # Start Flask server
    app.run(host='0.0.0.0', port=5000, debug=True)
