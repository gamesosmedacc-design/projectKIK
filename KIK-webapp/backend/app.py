from flask import Flask, request, jsonify, session, redirect, url_for
from zoneinfo import ZoneInfo
from sqlalchemy.exc import IntegrityError
from utils.tools.database import Session_local
from flask_cors import CORS
from utils.tools.database import base, engine
from utils.tools.attendance import Attendance
from utils.tools.users import User
from utils.tools.point import Point
from utils.helper.signIn import check_user_data
from utils.helper.signUp import insert_user_data
from utils.helper.get_from_database import get_from_database
from utils.helper.get_groups_from_databse import get_groups_from_database
from utils.helper.get_student_inclass import get_student_perperson
from utils.helper.check_my_attendance import check_my_attendance
from utils.helper.get_my_summary import get_my_summary
from utils.helper.get_student_point import check_students_point
from utils.helper.get_my_point import get_my_point
from utils.helper.point_increment import insert_point
from utils.helper.userAbsent import user_absent
from utils.helper.savePhoto import save_to_uploads
from utils.helper.haversine import haversine_formula
from datetime import datetime, time
from dotenv import load_dotenv
from functools import wraps
import os, bcrypt, re


load_dotenv()

base.metadata.create_all(bind=engine)

def login_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if "session_id" not in session  :
            return jsonify({"success":False, "message":"cannot get the session"}), 401
        return f(*args, **kwargs)
    return decorated_function

is_production = os.getenv("FLASK_ENV") == "production"
app = Flask(__name__)
app.secret_key = f"{os.getenv('app_secret_key')}"
app.config["MAX_CONTENT_LENGTH"] = 5 * 1024 * 1024
app.config.update(
    SESSION_COOKIE_HTTPONLY = True,
    SESSION_COOKIE_SAMESITE = "None" if is_production else "Lax",
    SESSION_COOKIE_SECURE = is_production
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
    data_class = data.get("data_class").upper()
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

    if data_role == "Guru":
        if data_subject == "":
            return jsonify({"success":False, "message":"mapel tidak boleh kosong"}), 400

        if re.fullmatch(number_regex, data_subject):
            return jsonify({"success":False, "message":"biasanya mapel atau proli tidak mengandung angka"}), 400
        

        if not data_nis:
            return jsonify({"success":False, "message":"NIP tidak boleh kosong"}), 400

        if not data_nis.isdigit():
            return jsonify({"success":False, "message":"NIP harus berisikan angka"}), 400
        
        if len(data_nis) != 18:
            return jsonify({"success":False, "message":"NIP harus 18 digit"}), 400


        data_class = None

    elif data_role == "Murid":
        if data_class == "":
            return jsonify({"success":False, "message":"kelas tidak boleh kosong"}), 400

        class_part = data_class.split()

        if len(class_part) < 2:
            return jsonify({"success":False, "message":"format kelas harus <kelas> <jurusan>"}), 400

        if not re.fullmatch(class_regex, class_part[0]):
            return jsonify({"success":False, "message":"format kelas salah gunakan <X|XI|XII>"}), 400

        if not re.fullmatch(major_regex, class_part[1]):
            return jsonify({"success":False, "message":"format jurusan salah gunakan <TP|TKR|TKJ|TKP|ALDP|ATPH|DPIB>"}), 400

        if not data_nis:
            return jsonify({"success":False, "message":"NIS tidak boleh kosong"}), 400

        if not data_nis.isdigit():
            return jsonify({"success":False, "message":"NIS harus berisikan angka"}), 400
        
        if len(data_nis) != 4:
            return jsonify({"success":False, "message":"NIS harus 4 digit"}), 400
        

        data_subject = None
    # class & role ==============================================

    # email =====================================================

    if data_email == "":
        return jsonify({"success":False, "message":"email tidak boleh kosong"}), 400

    if not data_email.endswith(("@gmail.com", "@belajar.id")):
        return jsonify({"success":False, "message":"email harus di akhiri dengan @gmail.com atau @belajar.id"}), 400


    # email =====================================================

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
            return jsonify({"success":False, "message":"username atau NIS atau NIP sudah digunakan"})

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
    data_summary = get_my_summary(user_id)
    data_lengkap = {
        "name":data.call_name,
        "role":data.role,
        "subject":data.subject,
        "class_":data.class_,
        "summary":data_summary
    }
    return jsonify({"success":True, "message":"selamat datang kembali!", "data":data_lengkap}), 200


@app.route("/getmyattendance", methods=["GET"])
def amiabsent():
    user_id = session["session_id"]
    rn = datetime.now(ZoneInfo("Asia/Makassar"))
    dayname = rn.strftime("%A")

    if not user_id:
        return jsonify({"success":False, "message":"login atau sesi telah berakhir silakan login ulang"}), 400

    if dayname == "Saturday" or dayname == "Sunday":
        return jsonify({"success":False, "message":"weekend"}), 200

    data_absen = check_my_attendance(user_id)
    if not data_absen :
        return jsonify({"success":False, "message":"kamu belum absen"}), 400

    return jsonify({
        "success":True,
        "data_absen" : data_absen
    }), 200

@app.route("/wheremyclass", methods={"GET"})
@login_required
def wheremyclass():
    data = get_groups_from_database()
    user_id = session["session_id"]
    
    if not user_id:
        return jsonify({"success":False, "message":"login atau sesi telah habis"}), 400
    return jsonify({
        "success":True,
        "groups_class" :[
        {
            "id" : group.id,
            "class" : group.class_,
            "nama" : group.username,
            "NIS" : group.nis
        }
        for group in data
        ]
    })

@app.route("/sendtargetclass", methods=["POST"])
@login_required
def targetclass(): 
    data = request.get_json()
    session["targetclass"] = data.get("target")
    print(session["targetclass"])

    return jsonify({"success":True, "message":"target didapat"}), 200


@app.route("/gettargetclass", methods={"GET"})
@login_required
def targetname():
    targetclass = session.get("targetclass")

    if not targetclass:
        return jsonify({"success":True, "message":"kelas yang ingin kamu tuju tidak terdefinisi"}), 400

    student_data = get_student_perperson(targetclass)
    point_data = check_students_point(targetclass)
    list_students = [
        {
            "id": user.id,
            "NIS": user.nis,
            "name": user.username,
            "class_": user.class_,
            "status": status if status else "Tidak absen",
            "total_point": point_data.get(user.id, 0) if point_data.get(user.id, 0) else 0
        }
        for user, status in student_data
    ]
    return jsonify({"success":True, "list_student": list_students}), 200

@app.route("/present", methods=['POST'])
@login_required
def myabsent():
    data = request.get_json()
    user_id = session["session_id"]
    data_status = data.get("data_status")
    rn = datetime.now(ZoneInfo("Asia/Makassar"))
    dayname = rn.strftime("%A")
    current_time = rn.time()
    late_limit = time(7, 30, 0)
    data_today = datetime.now(ZoneInfo("Asia/Makassar")).date()

    if not user_id:
        return jsonify({"success":False, "message":"login atau sesi telah habis"}), 400

    if dayname == "Saturday" or dayname == "Sunday":
        return jsonify({"success":False, "message":"weekend"}), 200

    if data_status == "Hadir":
        data_base64 = data.get("data_b64_selfie")
        data_latitude = data.get("data_latitude")
        data_longitude = data.get("data_longitude")
        data_file_url = None
        data_reason = None

        if not data_latitude:
            return jsonify({"success":False, "message":"maaf lokasi kamu tidak diketahui"}), 400
        
        if not data_longitude:
            return jsonify({"success":False, "message":"maaf lokasi kamu tidak diketahui"}), 400

        distance_from_center = haversine_formula(data_latitude, data_longitude)
        
        if distance_from_center[0] or distance_from_center[1] or distance_from_center[2]:
            data_photo_url = save_to_uploads(data_base64, user_id, data_today)
            
            if current_time > late_limit :
                data_status = "Terlambat"
                point = 5
                user_absent(user_id, data_status, data_photo_url, data_latitude, data_longitude, data_file_url, data_reason)
                insert_point(user_id, point, category=data_status)
                return jsonify({"success":True, "message":"kehadiranmu tetap dicatat dengan status terlambat!"})

            else :
                user_absent(user_id, data_status, data_photo_url, data_latitude, data_longitude, data_file_url, data_reason)
                return jsonify({"success":True, "message":"finally you did it"}), 400
                
        else :
            return jsonify({"success":False, "message":"kamu berada di luar area"}), 400

    return jsonify({"success":True, "message":"finally you did it"})

@app.route("/nfworexcattendance", methods=["POST"])
def absentdispresent():
    data = request.get_json()
    user_id = session["session_id"]
    data_status = data.get("status")
    rn = datetime.now(ZoneInfo("Asia/Makassar"))
    current_time = rn.time()
    dayname = rn.strftime("%A")
    late_limit = time(7, 30, 0)
    data_today = datetime.now(ZoneInfo("Asia/Makassar")).date()

    if not user_id :
        return jsonify({"success":False, "message":"login atau sesi terlah berakhir"}), 400

    if not data_status :
        return jsonify({"success":False, "message":"maaf status kamu tidak diketahui"}), 400
    
    if dayname == "Saturday" or dayname == "Sunday":
        return jsonify({"success":False, "message":"weekend"}), 200

    if data_status == "Sakit":
        reason = data.get("reason")
        file_nfw = data.get("nfw_file")
        data_longitude = None
        data_latitude = None
        data_photo = None

        if not file_nfw:
            return jsonify({"success":False, "message":"file kamu kosong"}), 400

        if not reason:
            return jsonify({"success":False, "message":"berikan alasan anda"}), 400

        data_file_nfw = save_to_uploads(file_nfw, user_id, data_today)

        if current_time > late_limit:
            data_status = "Alpa"
            point = 5
            user_absent(user_id, data_status, data_photo, data_latitude, data_longitude, data_file_nfw ,reason)
            insert_point(user_id, point, category=data_status)
            return jsonify({"success":True}), 200

        else :
            user_absent(user_id, data_status, data_photo, data_latitude, data_longitude, data_file_nfw, reason)
            return jsonify({"success":True}), 200

    if data_status == "Izin":
        reason = data.get("reason")
        file_nfw = data.get("nfw_file")
        data_longitude = None
        data_latitude = None
        data_photo = None

        if not file_nfw:
            return jsonify({"success":False, "message":"file kamu kosong"}), 400

        if not reason:
            return jsonify({"success":False, "message":"berikan alasan anda"}), 400

        data_file_nfw = save_to_uploads(file_nfw, user_id, data_today)

        if current_time > late_limit:
            data_status = "Alpa"
            point = 5
            user_absent(user_id, data_status, data_photo, data_latitude, data_longitude, data_file_nfw ,reason)
            insert_point(user_id, point, category=data_status)
            return jsonify({"success":True}), 200

        else :
            user_absent(user_id, data_status, data_photo, data_latitude, data_longitude, data_file_nfw, reason)
            return jsonify({"success":True}), 200

    return jsonify({"success":False}), 400

@app.route("/getmypoint", methods=["GET"])
def mypoint():
    user_id = session["session_id"]
    if not user_id:
        return jsonify({"success":False, "message":"sesi telah berakhir"}), 400

    point = get_my_point(user_id)

    if point is None:
        return jsonify({"success":False, "message":"ada yang salah dengan server"}), 400

    return jsonify({"success":True, "total_point":point}), 200

@app.route("/logout", methods=["GET"])
def logout():
    session.clear()

    return jsonify({"success":True, "message":"berhasil logout"}), 200

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port)