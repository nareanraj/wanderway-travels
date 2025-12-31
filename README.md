# WanderWay Travels - Travel & Tourism Agency

A high-tech, modern portfolio website for a travel agency with cutting-edge frontend and Python backend.

## Features

### Frontend:
- **Modern UI/UX**: Cyberpunk/tech-inspired design
- **Responsive Design**: Works on all devices
- **Interactive Elements**:
  - 3D tilt effects
  - Particle animations
  - Glitch text effects
  - Holographic elements
  - Mouse trail effects
- **Real-time Features**:
  - Digital clock
  - Weather widget
  - Currency converter
  - Animated statistics

### Backend:
- **Flask Python API**
- **SQLite Database**
- **RESTful Endpoints**:
  - Contact form submission
  - Newsletter subscription
  - Booking inquiries
  - Statistics tracking

## Installation

### Prerequisites:
- Python 3.8+
- Node.js (for frontend development)
- Git

### Backend Setup:
```bash
# Clone repository
git clone https://github.com/yourusername/wanderway-travels.git
cd wanderway-travels

# Create virtual environment
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On Mac/Linux:
source venv/bin/activate

# Install Python dependencies
pip install -r backend/requirements.txt

# Set up environment variables
cp .env.example .env
# Edit .env with your configurations

# Run the application
python backend/app.py