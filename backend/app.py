from flask import Flask, jsonify
import os

app = Flask(__name__)

@app.route('/')
def home():
    return jsonify({'status': 'ok', 'message': 'WanderWay Travels API'})

@app.route('/health')
def health():
    return jsonify({'status': 'healthy', 'service': 'WanderWay Travels'})

@app.route('/api/stats')
def stats():
    return jsonify({
        'total_messages': 0,
        'total_subscribers': 0,
        'total_bookings': 0
    })

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=False)
