import os
from datetime import datetime
from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from werkzeug.security import generate_password_hash, check_password_hash
from flask_jwt_extended import (
    JWTManager,
    create_access_token,
    jwt_required,
    get_jwt_identity,
    get_jwt
)

app = Flask(__name__)

# ==========================================
# CORS (FIXED)
# ==========================================
CORS(app, resources={
    r"/api/*": {
        "origins": ["http://localhost:3000", "http://127.0.0.1:3000"],
        "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        "allow_headers": ["Content-Type", "Authorization"]
    }
})

# ==========================================
# CONFIG
# ==========================================
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///student_records.db'
app.config['SQLALCHEMY_BINDS'] = {'admin_db': 'sqlite:///admin_data.db'}
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['JWT_SECRET_KEY'] = 'hackathon-secret-key-2026'

db = SQLAlchemy(app)
jwt = JWTManager(app)

# ==========================================
# MODELS
# ==========================================
class Student(db.Model):
    __tablename__ = "students"
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    phone = db.Column(db.String(20))
    room_number = db.Column(db.String(20))
    password_hash = db.Column(db.String(256), nullable=False)

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

class AdminUser(db.Model):
    __bind_key__ = 'admin_db'
    __tablename__ = "admins"
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100))
    username = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(120))
    phone = db.Column(db.String(20))
    password_hash = db.Column(db.String(256), nullable=False)
    role = db.Column(db.String(50), default="Admin")

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

class Attendance(db.Model):
    __tablename__ = "attendance"
    id = db.Column(db.Integer, primary_key=True)
    student_id = db.Column(db.Integer, nullable=False)
    student_name = db.Column(db.String(100))
    timestamp = db.Column(db.DateTime, default=datetime.utcnow)

class Complaint(db.Model):
    __tablename__ = "complaints"
    id = db.Column(db.Integer, primary_key=True)
    student_name = db.Column(db.String(100))
    student_email = db.Column(db.String(120))
    category = db.Column(db.String(50))
    description = db.Column(db.Text)
    status = db.Column(db.String(20), default="Pending")
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

class Leave(db.Model):
    __tablename__ = "leaves"
    id = db.Column(db.Integer, primary_key=True)
    student_name = db.Column(db.String(100))
    student_email = db.Column(db.String(120))
    leave_type = db.Column(db.String(50))
    start_date = db.Column(db.String(20))
    end_date = db.Column(db.String(20))
    reason = db.Column(db.Text)
    status = db.Column(db.String(20), default="Pending")
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

class Notice(db.Model):
    __bind_key__ = 'admin_db'
    __tablename__ = "notices"
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200))
    content = db.Column(db.Text)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

# ==========================================
# AUTHENTICATION
# ==========================================
@app.route('/api/student/register', methods=['POST'])
def register_student():
    data = request.get_json()
    if Student.query.filter_by(email=data.get('email')).first():
        return jsonify({"error": "Email already registered"}), 409
    student = Student(
        name=data.get('name'),
        email=data.get('email'),
        phone=data.get('phone'),
        room_number=data.get('room_number', "Unassigned")
    )
    student.set_password(data.get('password'))
    db.session.add(student)
    db.session.commit()
    return jsonify({"message": "Student Registered Successfully"}), 201

@app.route('/api/student/login', methods=['POST'])
def login_student():
    data = request.get_json()
    student = Student.query.filter_by(email=data.get('email')).first()
    if not student or not student.check_password(data.get('password')):
        return jsonify({"error": "Invalid credentials"}), 401
    token = create_access_token(
        identity=student.email,
        additional_claims={"role": "Student", "name": student.name}
    )
    return jsonify({
        "access_token": token,
        "role": "Student",
        "name": student.name,
        "email": student.email,
        "phone": student.phone,
        "room": student.room_number
    }), 200

@app.route('/api/admin/register', methods=['POST'])
def register_admin():
    data = request.get_json()
    if AdminUser.query.filter_by(username=data.get('username')).first():
        return jsonify({"error": "Username already taken"}), 409
    admin = AdminUser(
        name=data.get('name'),
        username=data.get('username'),
        email=data.get('email'),
        phone=data.get('phone'),
        role=data.get('role', 'Admin')
    )
    admin.set_password(data.get('password'))
    db.session.add(admin)
    db.session.commit()
    return jsonify({"message": "Admin Registered Successfully"}), 201

@app.route('/api/admin/login', methods=['POST'])
def login_admin():
    data = request.get_json()
    admin = AdminUser.query.filter_by(username=data.get('username')).first()
    
    if not admin or not admin.check_password(data.get('password')):
        return jsonify({"error": "Invalid credentials"}), 401
    
    token = create_access_token(
        identity=admin.username, 
        additional_claims={"role": admin.role, "name": admin.name}
    )
    
    # CRITICAL: Ensure email and phone are not empty strings
    return jsonify({
        "access_token": token,
        "role": admin.role,
        "name": admin.name or "Admin User",
        "username": admin.username,
        "email": admin.email or "admin@hostel.com", # Send actual email
        "phone": admin.phone or "+91 00000 00000", # Send actual phone
        "room": "" 
    }), 200

# ==========================================
# COMPLAINTS (GET + SUBMIT + DELETE)
# ==========================================
@app.route('/api/complaints', methods=['GET'])
@jwt_required()
def get_complaints():
    role = get_jwt().get('role')
    if role in ['Admin', 'Super_Admin']:
        data = Complaint.query.order_by(Complaint.created_at.desc()).all()
    else:
        data = Complaint.query.filter_by(student_email=get_jwt_identity()).all()
    return jsonify([{
        "id": c.id, "student_name": c.student_name, "type": c.category,
        "desc": c.description, "status": c.status, "date": c.created_at.strftime("%b %d, %H:%M")
    } for c in data]), 200

@app.route('/api/complaints/submit', methods=['POST'])
@jwt_required()
def submit_complaint():
    claims = get_jwt()
    if claims.get('role') != 'Student':
        return jsonify({"error": "Unauthorized"}), 403
    data = request.get_json()
    new_c = Complaint(
        student_name=claims.get('name'),
        student_email=get_jwt_identity(),
        category=data.get('category'),
        description=data.get('description')
    )
    db.session.add(new_c)
    db.session.commit()
    return jsonify({"message": "Complaint submitted"}), 201

@app.route('/api/complaints/delete/<int:id>', methods=['DELETE'])
@jwt_required()
def delete_complaint(id):
    if get_jwt().get('role') not in ['Admin', 'Super_Admin']:
        return jsonify({"error": "Unauthorized"}), 403
    c = Complaint.query.get(id)
    if not c: return jsonify({"error": "Not found"}), 404
    db.session.delete(c)
    db.session.commit()
    return jsonify({"message": "Deleted"}), 200

# ==========================================
# LEAVES (GET + REQUEST + DELETE)
# ==========================================
@app.route('/api/leaves', methods=['GET'])
@jwt_required()
def get_leaves():
    role = get_jwt().get('role')
    if role in ['Admin', 'Super_Admin']:
        data = Leave.query.order_by(Leave.created_at.desc()).all()
    else:
        data = Leave.query.filter_by(student_email=get_jwt_identity()).all()
    return jsonify([{
        "id": l.id, "student_name": l.student_name, "type": l.leave_type,
        "start": l.start_date, "end": l.end_date, "reason": l.reason, "status": l.status
    } for l in data]), 200

@app.route('/api/leaves/request', methods=['POST'])
@jwt_required()
def request_leave():
    claims = get_jwt()
    if claims.get('role') != 'Student':
        return jsonify({"error": "Unauthorized"}), 403
    data = request.get_json()
    new_l = Leave(
        student_name=claims.get('name'),
        student_email=get_jwt_identity(),
        leave_type=data.get('type'),
        start_date=data.get('start'),
        end_date=data.get('end'),
        reason=data.get('reason')
    )
    db.session.add(new_l)
    db.session.commit()
    return jsonify({"message": "Leave requested"}), 201

# ==========================================
# ATTENDANCE
# ==========================================
# --- ATTENDANCE (MARK) ---
@app.route('/api/attendance/mark', methods=['POST'])
@jwt_required()
def mark_attendance():
    identity = get_jwt_identity()
    claims = get_jwt()
    if claims.get('role') != 'Student':
        return jsonify({"error": "Only students can mark attendance"}), 403
    student = Student.query.filter_by(email=identity).first()
    if not student: return jsonify({"error": "Student not found"}), 404
    
    # Check if already marked today
    today = datetime.utcnow().date()
    existing = Attendance.query.filter(Attendance.student_id == student.id, db.func.date(Attendance.timestamp) == today).first()
    if existing: return jsonify({"error": "Attendance already marked today"}), 400

    new_att = Attendance(student_id=student.id, student_name=student.name)
    db.session.add(new_att)
    db.session.commit()
    return jsonify({"message": f"Success! Attendance marked for {student.name}"}), 201

# ==========================================
# NOTICES
# ==========================================
@app.route('/api/notices', methods=['GET'])
def get_notices():
    notices = Notice.query.order_by(Notice.created_at.desc()).all()
    return jsonify([{
        "id": n.id, "title": n.title, "content": n.content, "date": n.created_at.strftime("%b %d, %Y")
    } for n in notices]), 200

@app.route('/api/admin/post-notice', methods=['POST'])
@jwt_required()
def post_notice():
    # Only allow Admin or Super_Admin to post
    claims = get_jwt()
    if claims.get('role') not in ['Admin', 'Super_Admin']:
        return jsonify({"error": "Unauthorized"}), 403

    data = request.get_json()
    new_notice = Notice(
        title=data.get('title'),
        content=data.get('content')
    )
    db.session.add(new_notice)
    db.session.commit()
    return jsonify({"message": "Notice posted successfully"}), 201

@app.route('/api/admin/delete-notice/<int:id>', methods=['DELETE'])
@jwt_required()
def delete_notice(id):
    # Strict role check: Only Admins can delete
    claims = get_jwt()
    if claims.get('role') not in ['Admin', 'Super_Admin']:
        return jsonify({"error": "Unauthorized: Admin access required"}), 403

    notice = Notice.query.get(id)
    if not notice:
        return jsonify({"error": "Notice not found"}), 404

    try:
        db.session.delete(notice)
        db.session.commit()
        return jsonify({"message": "Notice deleted successfully"}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500

# ==========================================
# START
# ==========================================
if __name__ == '__main__':
    with app.app_context():
        db.create_all()
        if not AdminUser.query.filter_by(username='admin').first():
            admin = AdminUser(username='admin', name='Super Admin', role='Super_Admin')
            admin.set_password('admin123')
            db.session.add(admin)
            db.session.commit()
    app.run(debug=True, port=5000)