from sqlalchemy import create_engine, select, Column, Integer, String
from sqlalchemy.orm import declarative_base, Session
from flask import Flask, request, jsonify, session
from sqlalchemy.exc import IntegrityError
from utils.tools.database import Session_local
from flask_cors import CORS
from utils.helper.signIn import check_user_data
from utils.helper.signUp import insert_user_data
from utils.helper.get_from_database import get_from_database
# from utils.helper.userAbsent import user_absent
from utils.helper.haversine import haversine_formula
from datetime import datetime, time
from dotenv import load_dotenv
from functools import wraps
import os
import bcrypt
import re

load_dotenv()

se = Session_local()

def login_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if "session_id" not in session  :
            return jsonify({"success":False, "message":"cannot get the session"}), 401
        return f(*args, **kwargs)
    return decorated_function

absent_open = time(6, 0, 0)
absent_late = time(7, 30, 0)
absent_close = time(17, 0, 0)


is_production = os.getenv("flask_env") == "production"
app = Flask(__name__)
app.secret_key = f"{os.getenv('app_secret_key')}"
app.config.update(
    SESSION_COOKIE_HTTPONLY = True,
    SESSION_COOKIE_SAMESITE = "None" if is_production else "Lax",
    SESSION_COOKIE_SECURE = False
)
CORS(app, supports_credentials=True, origins=["http://127.0.0.1:5500", "https://sekolah-digitalku-projectkik.vercel.app"])

@app.route("/")
def home():
    return jsonify({"success": True, "message":"server BE is running"})

@app.route("/sign_in", methods=['POST'])
def sign_in():
    data = request.get_json()
    password_data = data.get("password_value")
    username_data = data.get("username_value")
    nis_data = data.get("nis")

    data = check_user_data(username_data)

    if data == None:
        return jsonify({"success":False, "message":"username atau password salah"}), 400

    password_hash = data.hashed_pw

    if not bcrypt.checkpw(password_data.encode(), password_hash.encode()):
        return jsonify({"success":False, "message":"username atau password salah"}), 400

    session["session_id"] = data.id

    return jsonify({"success":True, "message":"selamat datang kembali"}), 200

@app.route("/sign_up", methods=["POST"])
def sign_up():
    data = request.get_json()
    data_username = data.get("data_username")
    data_password = data.get("data_password")
    data_call_name = data.get("data_call_name")
    data_subject = data.get("data_subject")
    data_class = data.get("data_class")
    data_role = data.get("data_role")
    data_email = data.get("data_email")
    data_nis = data.get("data_nis")
    data_phone_number = data.get("data_phone_number")

    symbol_regex = r'^[a-zA-Z0-9\s.,_]+$'
    char_regex = r'^[a-zA-Z]+$'
    number_regex = r'^[0-9]+$'
    class_regex = r'^(X|XI|XII)+$'
    major_regex = r'^(TP|TKR|TKJ|TKP|ALDP|ATPH|DPIB)+$'

    if data == None:
        return jsonify({"success":False, "message":"data is not found"}), 400

    # Username ==================================================
    
    if data_username == "":
        return jsonify({"success":False, "message":"nama tidak boleh kosong"}), 400

    if len(data_username) > 50:
        return jsonify({"success":False, "message":"nama tidak boleh lebih dari 50 karakter!"}), 400

    if not re.search(symbol_regex, data_username):
        return jsonify({"success":False, "message":"nama tidak boleh mengandung simbol apapun kecuali '_'"}), 400

    # Username ==================================================
    

    # password ==================================================
    
    if not data_password:
        return jsonify({"success":False, "message":"gagal membuat akun karna passwordmu masih kosong"}), 400

    if len(data_password) < 8:
        return jsonify({"success":False, "message":"password minimal 8 karakter!"}), 400

    if not re.search(symbol_regex, data_password):
        return jsonify({"success":False, "message":"password tidak boleh mengandung simbol"}), 400

    if not re.search(r'[a-zA-Z]', data_password) or not re.search(r'[0-9]', data_password):
        return jsonify({"success":False, "message":"sebaiknya password berisi huruf dan angka"}), 400

    # password ==================================================

    # call name =================================================

    if not data_call_name :
        return jsonify({"success":False, "message":"nama panggilan harus di isi"}), 400

    if len(data_call_name.split()) > 1:
        return jsonify({"success":False, "message":"nama panggilan tidak boleh lebih dari 1 kata"}), 400

    if re.fullmatch(number_regex, data_call_name):
        return jsonify({"success":False, "message":"nama panggilan tidak boleh berisi angka"})

    # class & subject & role ====================================

    if data_role == "teacher":
        if data_subject == "":
            return jsonify({"succes":False, "message":"mapel tidak boleh kosong"}), 400

        if re.fullmatch(number_regex, data_subject):
            return jsonify({"success":False, "message":"biasanya mapel atau proli tidak mengandung angka"}), 400
        
        data_class = None

    elif data_role == "student":
        if data_class == "":
            return jsonify({"success":False, "message":"kelas tidak boleh kosong"}), 400

        class_part = data_class.split()

        if len(class_part) < 2:
            return jsonify({"success":False, "message":"format kelas harus <kelas> <jurusan>"}), 400

        if not re.fullmatch(class_regex, class_part[0]):
            return jsonify({"success":False, "message":"format kelas salah gunakan <X|XI|XII>"}), 400

        if not re.fullmatch(major_regex, class_part[1]):
            return jsonify({"success":False, "message":"format jurusan salah gunakan <TP|TKR|TKJ|TKP|ALDP|ATPH|DPIB>"}), 400

        data_subject = None
    # class & role ==============================================

    # email =====================================================

    if data_email == "":
        return jsonify({"success":False, "message":"email tidak boleh kosong"}), 400

    if not data_email.endswith(("@gmail.com", "@belajar.id")):
        return jsonify({"success":False, "message":"email harus di akhiri dengan @gmail.com atau @belajar.id"}), 400


    # email =====================================================

    # nis =======================================================
    
    if data_nis:

        if data_nis == "":
            return jsonify({"success":False, "message":"nis tidak boleh kosong"}), 400

        if re.search(char_regex, data_nis):
            return jsonify({"success":False, "message":"kamu yakin itu nis kamu?"}), 400

        if len(data_nis) > 4:
            return jsonify({"success":False, "message":"nis biasanya hanya 4 digit saja"}), 400

        if not re.fullmatch(number_regex, data_nis):
            return jsonify({"success":False, "message":"kamu harus menggunakan angka untuk nis kamu"}), 400
        
    # nis =======================================================

    # phone number ==============================================
    
    if data_phone_number:

        if data_phone_number == "":
            return jsonify({"success":False, "message":"nomor hp kamu kosong"}), 400

        if not re.fullmatch(number_regex, data_phone_number):
            return jsonify({"success":False, "message":"nomor hanya boleh di isi angka"}), 400

    # phone number ==============================================

    hashed_pw = bcrypt.hashpw(data_password.encode(), bcrypt.gensalt())
    hashed_pw_str = hashed_pw.decode()

    try :
        new_user_id = insert_user_data(data_username, hashed_pw_str, data_call_name, data_subject, data_class, data_role, data_email, data_nis, data_phone_number)
        data = check_user_data(data_username)
        session["session_id"] = data.id

    except IntegrityError:
            se.rollback()
            return jsonify({"success":False, "message":"username sudah digunakan"})

    return jsonify({"success":True, "message":"sejauh ini masih benar"}), 200

@app.route("/dashboard", methods=["GET"])
@login_required
def dashboard():
    user_id = session["session_id"]

    if not user_id:
        return jsonify({"success":False, "message":"login atau sesi telah habis"}), 400

    return jsonify({"success":True, "message":"selamat datang kembali"}), 200

@app.route("/me", methods=["GET"])
@login_required
def whoami():
    user_id = session["session_id"]

    if not user_id:
        return jsonify({"success":False, "message":"login atau sesi telah habis"}), 400

    data = get_from_database(user_id)
    data_lengkap = {
        "name":data.call_name,
        "role":data.role,
        "subject":data.subject,
        "class_":data.class_,
    }
    print(f"user dengan nama = {data.username}, kelas {data.class_}, ditemukan!")
    return jsonify({"success":True, "message":"selamat datang kembali!", "data":data_lengkap}), 200

# @app.route("/absent", methods=['POST'])
# def absent():
#     data = request.get_json()
#     user_id = session.get("id")
#     print(user_id)

#     if not user_id :
#         return jsonify({"success":False, "message":"cannot reach BE"}), 400
    
#     user_latitude_position = float(data.get("user_latitude"))
#     user_longitude_position = float(data.get("user_longitude"))
#     user_status = data.get("data_status")
#     user_comment = data.get("comment")
#     now = datetime.now()
#     current_time = now.time()
#     late_limit = datetime.strptime("08:00:00", "%H:%M:%S").time()

#     distance_from_center = haversine_formula(user_latitude_position, user_longitude_position)

#     if current_time < absent_open or current_time > absent_close :
#         return jsonify({"succes":False, "message":"this feature is cannot use right now"})

#     if user_status == None :
#         return jsonify({"success":False, "message":"please enter your status"}), 400

#     if user_status == "hadir":
#         if distance_from_center[1] or distance_from_center[1] or distance_from_center[2]:
#             if current_time > absent_late:
#                 user_status = "terlambat"
#                 user_absent(user_id, user_status, user_comment, user_latitude_position, user_longitude_position)
#                 return jsonify({"succes":False, "message":"attendance was logg, pls confirm to your teacher"})
    
#     if user_status == "sakit" or user_status == "izin" or user_status == "dispen":
#         if user_comment == " " :
#             return jsonify({"success":False, "message":"please enter your reason"}), 400

#         else : 
#             user_absent(user_id, user_status, user_comment, user_latitude_position, user_longitude_position)
#             return jsonify({"success":True, 'message':"get well soon"}), 200

#     user_absent(user_id, user_status, user_comment, user_latitude_position, user_longitude_position)
#     return jsonify({"success":True, "message":"finally you did it"}), 200

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port)