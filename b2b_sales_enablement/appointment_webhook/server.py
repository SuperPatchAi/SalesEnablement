#!/usr/bin/env python3
"""
SuperPatch Appointment Webhook Server

This server handles:
1. Checking available appointment slots
2. Scheduling appointments
3. Logging to Google Sheets

Run with: python3 server.py
Or deploy to: Render, Railway, Vercel, etc.
"""

from flask import Flask, request, jsonify
from datetime import datetime, timedelta
import os
import json

app = Flask(__name__)

# In-memory storage for demo (replace with database in production)
APPOINTMENTS = {}
AVAILABLE_SLOTS = {}

# Generate available slots for the next 2 weeks
def generate_available_slots():
    slots = {}
    today = datetime.now()
    
    for day_offset in range(1, 15):  # Next 14 days
        date = today + timedelta(days=day_offset)
        
        # Skip weekends
        if date.weekday() >= 5:
            continue
            
        date_str = date.strftime("%Y-%m-%d")
        slots[date_str] = [
            "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
            "13:00", "13:30", "14:00", "14:30", "15:00", "15:30", "16:00"
        ]
    
    return slots

AVAILABLE_SLOTS = generate_available_slots()


@app.route('/api/check-availability', methods=['GET'])
def check_availability():
    """
    Check available appointment slots.
    
    Query params:
        date_range: "next_week", "this_week", or specific date (YYYY-MM-DD)
        practitioner_type: Type of practitioner (for context)
    """
    date_range = request.args.get('date_range', 'next_week')
    practitioner_type = request.args.get('practitioner_type', 'general')
    
    today = datetime.now()
    available = []
    
    if date_range == 'this_week':
        end_date = today + timedelta(days=7 - today.weekday())
    elif date_range == 'next_week':
        start_date = today + timedelta(days=7 - today.weekday())
        end_date = start_date + timedelta(days=7)
    else:
        # Specific date
        try:
            specific_date = datetime.strptime(date_range, "%Y-%m-%d")
            date_str = specific_date.strftime("%Y-%m-%d")
            if date_str in AVAILABLE_SLOTS:
                slots = AVAILABLE_SLOTS[date_str]
                # Remove booked slots
                booked = APPOINTMENTS.get(date_str, [])
                available_times = [s for s in slots if s not in booked]
                return jsonify({
                    "status": "success",
                    "data": {
                        "date": date_str,
                        "slots": available_times,
                        "message": f"Available times on {date_str}: {', '.join(available_times)}"
                    }
                })
            else:
                return jsonify({
                    "status": "success", 
                    "data": {
                        "slots": [],
                        "message": f"No availability on {date_str}"
                    }
                })
        except:
            pass
    
    # Get slots for date range
    for date_str, slots in AVAILABLE_SLOTS.items():
        date_obj = datetime.strptime(date_str, "%Y-%m-%d")
        
        if date_range == 'this_week' and date_obj <= end_date and date_obj >= today:
            booked = APPOINTMENTS.get(date_str, [])
            available_times = [s for s in slots if s not in booked]
            if available_times:
                available.append({
                    "date": date_str,
                    "day": date_obj.strftime("%A"),
                    "times": available_times[:3]  # Return first 3 for brevity
                })
        elif date_range == 'next_week':
            booked = APPOINTMENTS.get(date_str, [])
            available_times = [s for s in slots if s not in booked]
            if available_times:
                available.append({
                    "date": date_str,
                    "day": date_obj.strftime("%A"),
                    "times": available_times[:3]
                })
    
    # Format response for voice
    if available:
        slot_text = []
        for slot in available[:5]:  # Limit to 5 days
            times = ", ".join(slot["times"][:2])
            slot_text.append(f"{slot['day']} {slot['date']} at {times}")
        message = "I have availability on: " + "; ".join(slot_text) + ". Which works best for you?"
    else:
        message = "I don't have any availability in that time frame. Would you like to check a different week?"
    
    return jsonify({
        "status": "success",
        "data": {
            "slots": available,
            "message": message
        }
    })


@app.route('/api/schedule-appointment', methods=['POST'])
def schedule_appointment():
    """
    Schedule an appointment and log to spreadsheet.
    
    Body params:
        practitioner_name: Name
        practitioner_type: Type (chiropractor, massage, etc.)
        practice_name: Clinic name
        phone_number: Contact number
        email: Email address
        appointment_date: YYYY-MM-DD
        appointment_time: HH:MM
        notes: Conversation notes
        products_interested: Products they showed interest in
    """
    data = request.json
    
    required = ['practitioner_name', 'appointment_date', 'appointment_time']
    for field in required:
        if not data.get(field):
            return jsonify({
                "status": "error",
                "data": {"message": f"Missing required field: {field}"}
            }), 400
    
    date = data['appointment_date']
    time = data['appointment_time']
    
    # Check if slot is available
    if date in AVAILABLE_SLOTS:
        if time not in AVAILABLE_SLOTS[date]:
            return jsonify({
                "status": "error",
                "data": {"message": f"Sorry, {time} is not available on {date}. Please choose another time."}
            }), 400
        
        # Check if already booked
        if date in APPOINTMENTS and time in APPOINTMENTS[date]:
            return jsonify({
                "status": "error",
                "data": {"message": f"Sorry, that slot was just booked. Let me check other times."}
            }), 400
    
    # Book the appointment
    if date not in APPOINTMENTS:
        APPOINTMENTS[date] = []
    APPOINTMENTS[date].append(time)
    
    # Generate confirmation number
    confirmation = f"SP-{datetime.now().strftime('%Y%m%d%H%M%S')}"
    
    # Log to file (replace with Google Sheets API in production)
    appointment_record = {
        "confirmation": confirmation,
        "timestamp": datetime.now().isoformat(),
        **data
    }
    
    log_file = "appointments_log.json"
    try:
        with open(log_file, 'r') as f:
            records = json.load(f)
    except:
        records = []
    
    records.append(appointment_record)
    
    with open(log_file, 'w') as f:
        json.dump(records, f, indent=2)
    
    # Also append to CSV for easy spreadsheet import
    csv_file = "appointments.csv"
    import csv
    file_exists = os.path.exists(csv_file)
    
    with open(csv_file, 'a', newline='') as f:
        writer = csv.writer(f)
        if not file_exists:
            writer.writerow([
                'Confirmation', 'Timestamp', 'Name', 'Type', 'Practice', 
                'Phone', 'Email', 'Date', 'Time', 'Products', 'Notes'
            ])
        writer.writerow([
            confirmation,
            datetime.now().isoformat(),
            data.get('practitioner_name', ''),
            data.get('practitioner_type', ''),
            data.get('practice_name', ''),
            data.get('phone_number', ''),
            data.get('email', ''),
            date,
            time,
            data.get('products_interested', ''),
            data.get('notes', '')
        ])
    
    # Format response for voice
    date_obj = datetime.strptime(date, "%Y-%m-%d")
    day_name = date_obj.strftime("%A, %B %d")
    
    return jsonify({
        "status": "success",
        "data": {
            "confirmation_number": confirmation,
            "message": f"I've scheduled your follow-up call for {day_name} at {time}. Your confirmation number is {confirmation}. You'll receive a confirmation email shortly."
        }
    })


@app.route('/api/appointments', methods=['GET'])
def list_appointments():
    """List all scheduled appointments (admin endpoint)"""
    try:
        with open("appointments_log.json", 'r') as f:
            records = json.load(f)
        return jsonify({"status": "success", "data": records})
    except:
        return jsonify({"status": "success", "data": []})


@app.route('/health', methods=['GET'])
def health():
    """Health check endpoint"""
    return jsonify({"status": "healthy", "service": "SuperPatch Appointment Webhook"})


if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    print(f"Starting SuperPatch Appointment Webhook Server on port {port}")
    print(f"Endpoints:")
    print(f"  GET  /api/check-availability")
    print(f"  POST /api/schedule-appointment")
    print(f"  GET  /api/appointments")
    print(f"  GET  /health")
    app.run(host='0.0.0.0', port=port, debug=True)
