import os
import sys
from flask import Flask, render_template, send_from_directory, jsonify, request
from flask_cors import CORS
import json
from datetime import datetime

# Fix Python path for deployment
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
FRONTEND_DIR = os.path.join(os.path.dirname(BASE_DIR), 'frontend')

app = Flask(__name__,
            static_folder=FRONTEND_DIR,
            template_folder=FRONTEND_DIR)

# Configure CORS for production
if os.environ.get('RAILWAY_ENVIRONMENT'):
    # In production, allow specific origins
    CORS(app, resources={
        r"/api/*": {
            "origins": ["https://*.railway.app", "http://localhost:*"],
            "methods": ["GET", "POST", "OPTIONS"],
            "allow_headers": ["Content-Type", "Authorization"]
        }
    })
else:
    # In development, allow all
    CORS(app)

# In-memory storage (no database files)
contacts = []
subscribers = []
bookings = []

# ========== API ROUTES ==========
@app.route('/api/contact', methods=['POST'])
def contact():
    try:
        data = request.get_json()
        
        if not data:
            return jsonify({'error': 'No data provided'}), 400
            
        required = ['name', 'email', 'message']
        for field in required:
            if not data.get(field):
                return jsonify({'error': f'Missing field: {field}'}), 400
        
        # Simple email validation
        if '@' not in data['email'] or '.' not in data['email']:
            return jsonify({'error': 'Invalid email'}), 400
        
        # Save contact
        contact_data = {
            'id': len(contacts) + 1,
            'name': data['name'],
            'email': data['email'],
            'phone': data.get('phone', ''),
            'destination': data.get('destination', ''),
            'message': data['message'],
            'date': datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
            'status': 'unread'
        }
        contacts.append(contact_data)
        
        print(f"✅ Contact saved: {data['name']} ({data['email']})")
        
        return jsonify({
            'success': True,
            'message': 'Message sent successfully!',
            'id': contact_data['id']
        }), 201
        
    except Exception as e:
        print(f"❌ Contact error: {str(e)}")
        return jsonify({'error': 'Server error'}), 500

@app.route('/api/newsletter', methods=['POST'])
def newsletter():
    try:
        data = request.get_json()
        
        if not data or not data.get('email'):
            return jsonify({'error': 'Email required'}), 400
        
        email = data['email'].strip().lower()
        
        if '@' not in email or '.' not in email:
            return jsonify({'error': 'Invalid email'}), 400
        
        # Check if already subscribed
        if any(sub['email'] == email for sub in subscribers):
            return jsonify({
                'success': True,
                'message': 'Already subscribed!'
            }), 200
        
        # Add subscriber
        subscriber = {
            'id': len(subscribers) + 1,
            'email': email,
            'date': datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
            'active': True
        }
        subscribers.append(subscriber)
        
        print(f"✅ Newsletter subscriber: {email}")
        
        return jsonify({
            'success': True,
            'message': 'Subscribed successfully!'
        }), 201
        
    except Exception as e:
        print(f"❌ Newsletter error: {str(e)}")
        return jsonify({'error': 'Server error'}), 500

@app.route('/api/booking-inquiry', methods=['POST'])
def booking_inquiry():
    try:
        data = request.get_json()
        
        if not data:
            return jsonify({'error': 'No data provided'}), 400
            
        required = ['full_name', 'email', 'destination']
        for field in required:
            if not data.get(field):
                return jsonify({'error': f'Missing field: {field}'}), 400
        
        # Simple email validation
        if '@' not in data['email'] or '.' not in data['email']:
            return jsonify({'error': 'Invalid email'}), 400
        
        # Save booking
        booking = {
            'id': len(bookings) + 1,
            'full_name': data['full_name'],
            'email': data['email'],
            'destination': data['destination'],
            'travel_date': data.get('travel_date', ''),
            'travelers': data.get('travelers', 1),
            'budget': data.get('budget', ''),
            'special_requests': data.get('special_requests', ''),
            'created_at': datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        }
        bookings.append(booking)
        
        print(f"✅ Booking inquiry: {data['full_name']} to {data['destination']}")
        
        return jsonify({
            'success': True,
            'message': 'Travel inquiry submitted!',
            'booking_id': booking['id']
        }), 201
        
    except Exception as e:
        print(f"❌ Booking error: {str(e)}")
        return jsonify({'error': 'Server error'}), 500

@app.route('/api/stats', methods=['GET'])
def get_stats():
    return jsonify({
        'success': True,
        'stats': {
            'total_messages': len(contacts),
            'total_subscribers': len(subscribers),
            'total_bookings': len(bookings)
        }
    })

# ========== FRONTEND ROUTES ==========
@app.route('/')
def index():
    return render_template('index.html')

@app.route('/<path:path>')
def serve_static(path):
    return send_from_directory(FRONTEND_DIR, path)

# Handle 404 errors
@app.errorhandler(404)
def not_found(error):
    return jsonify({'error': 'Route not found'}), 404

# ========== HEALTH CHECK ==========
@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({
        'status': 'healthy',
        'service': 'WanderWay Travels API',
        'timestamp': datetime.now().isoformat()
    })

# ========== STARTUP ==========
if __name__ == '__main__':
    print("\n" + "="*60)
    print("🚀 WANDERWAY TRAVELS - TRAVEL & TOURISM AGENCY")
    print("="*60)
    print("📁 Backend: backend/app.py")
    print("📁 Frontend: frontend/")
    print("💾 Storage: In-memory (no database files)")
    print("🌐 Server: http://localhost:5000")
    print("📊 API: http://localhost:5000/api/stats")
    print("="*60)
    print("✅ Ready for Railway Deployment!")
    print("="*60)
    
    # Add sample data for testing
    contacts.append({
        'id': 1,
        'name': 'John Doe',
        'email': 'john@example.com',
        'message': 'Sample message',
        'date': datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
        'status': 'read'
    })
    
    subscribers.append({
        'id': 1,
        'email': 'test@example.com',
        'date': datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
        'active': True
    })
    
    bookings.append({
        'id': 1,
        'full_name': 'Jane Smith',
        'email': 'jane@example.com',
        'destination': 'Tokyo, Japan',
        'travelers': 2,
        'created_at': datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    })
    
    print("✅ Sample data added")
    print("="*60 + "\n")
    
    # Get port from environment or default to 5000
    port = int(os.environ.get("PORT", 5000))
    
    # Run the app
    app.run(debug=os.environ.get('FLASK_DEBUG', 'False').lower() == 'true', 
            host='0.0.0.0', 
            port=port)