from flask import Blueprint, request, jsonify
from backend.models import db, ContactMessage, NewsletterSubscriber, BookingInquiry
from email_validator import validate_email, EmailNotValidError
import re

api_bp = Blueprint('api', __name__)

@api_bp.route('/api/contact', methods=['POST'])
def contact():
    try:
        data = request.json
        
        # Validate required fields
        if not data.get('name') or not data.get('email') or not data.get('message'):
            return jsonify({'error': 'Missing required fields'}), 400
        
        # Validate email
        try:
            validate_email(data['email'])
        except EmailNotValidError:
            return jsonify({'error': 'Invalid email address'}), 400
        
        # Save to database
        new_message = ContactMessage(
            name=data['name'],
            email=data['email'],
            phone=data.get('phone', ''),
            destination=data.get('destination', ''),
            message=data['message']
        )
        
        db.session.add(new_message)
        db.session.commit()
        
        return jsonify({
            'message': 'Your message has been sent successfully!',
            'id': new_message.id
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': 'Server error'}), 500

@api_bp.route('/api/newsletter', methods=['POST'])
def newsletter():
    try:
        data = request.json
        email = data.get('email')
        
        if not email:
            return jsonify({'error': 'Email is required'}), 400
        
        # Validate email
        try:
            validate_email(email)
        except EmailNotValidError:
            return jsonify({'error': 'Invalid email address'}), 400
        
        # Check if already subscribed
        existing = NewsletterSubscriber.query.filter_by(email=email).first()
        if existing:
            return jsonify({'message': 'Already subscribed!'}), 200
        
        # Add new subscriber
        subscriber = NewsletterSubscriber(email=email)
        db.session.add(subscriber)
        db.session.commit()
        
        return jsonify({'message': 'Successfully subscribed to newsletter!'}), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': 'Server error'}), 500

@api_bp.route('/api/booking-inquiry', methods=['POST'])
def booking_inquiry():
    try:
        data = request.json
        
        # Validate required fields
        required_fields = ['full_name', 'email', 'destination']
        for field in required_fields:
            if not data.get(field):
                return jsonify({'error': f'Missing required field: {field}'}), 400
        
        # Validate email
        try:
            validate_email(data['email'])
        except EmailNotValidError:
            return jsonify({'error': 'Invalid email address'}), 400
        
        # Save booking inquiry
        inquiry = BookingInquiry(
            full_name=data['full_name'],
            email=data['email'],
            destination=data['destination'],
            travel_date=data.get('travel_date'),
            travelers=data.get('travelers'),
            budget=data.get('budget'),
            special_requests=data.get('special_requests')
        )
        
        db.session.add(inquiry)
        db.session.commit()
        
        return jsonify({
            'message': 'Your travel inquiry has been submitted successfully!',
            'booking_id': inquiry.id
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': 'Server error'}), 500

@api_bp.route('/api/stats', methods=['GET'])
def get_stats():
    try:
        total_messages = ContactMessage.query.count()
        total_subscribers = NewsletterSubscriber.query.filter_by(active=True).count()
        total_bookings = BookingInquiry.query.count()
        
        return jsonify({
            'total_messages': total_messages,
            'total_subscribers': total_subscribers,
            'total_bookings': total_bookings
        }), 200
    except Exception as e:
        return jsonify({'error': 'Server error'}), 500