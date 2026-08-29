from flask import Flask, request, jsonify, session
from flask_cors import CORS
from utils.helper.signIn import user_select_data_sign_in
from utils.helper.userAbsent import user_absent
from utils.helper.haversine import haversine_formula
from datetime import datetime, time
from dotenv import load_dotenv
import os
import bcrypt

load_dotenv()

absent_open = time(6, 0, 0)
absent_late = time(7, 30, 0)
absent_close = time(17, 0, 0)


app = Flask(__name__)
app.secret_key = f"{os.getenv('app_secret_key')}"
app.config.update(
    SESSION_COOKIE_HTTPONLY = True,
    SESSION_COOKIE_SAMESITE = "Lax",
    SESSION_COOKIE_SECURE = False
)
CORS(app, supports_credentials=True, origins=["http://127.0.0.1:5500"])

@app.route("/")
def home():
    return jsonify({"success": True, "message":"server BE isn't running"})

@app.route("/sign_in", methods=['POST'])
def sign_in():
    data = request.get_json()
    password = data.get("password")
    username = data.get("username")

    data_user = user_select_data_sign_in(username)

    if data_user == None:
        return jsonify({"success":False, "message":"username atau password salah"})

    password_hash = data_user["password_hash"]

    if not bcrypt.checkpw(password.encode(), password_hash.encode()):
        return jsonify({"success":False, "message":"username atau password salah"})

    user_id = data_user["id"]
    print(user_id)
    session["id"] = user_id
    print(session)
    return jsonify({"success":True, "message":"selamat datang kembali"})

@app.route("/absent", methods=['POST'])
def absent():
    data = request.get_json()
    user_id = session.get("id")
    print(user_id)

    if not user_id :
        return jsonify({"success":False, "message":"cannot reach BE"}), 401
    
    user_latitude_position = float(data.get("user_latitude"))
    user_longitude_position = float(data.get("user_longitude"))
    user_status = data.get("data_status")
    user_comment = data.get("comment")
    now = datetime.now()
    current_time = now.time()
    late_limit = datetime.strptime("08:00:00", "%H:%M:%S").time()

    distance_from_center = haversine_formula(user_latitude_position, user_longitude_position)

    if current_time < absent_open or current_time > absent_close :
        return jsonify({"succes":False, "message":"this feature is cannot use right now"})

    if user_status == None :
        return jsonify({"success":False, "message":"please enter your status"}), 400

    if user_status == "hadir":
        if distance_from_center[1] or distance_from_center[1] or distance_from_center[2]:
            if current_time > absent_late:
                user_status = "terlambat"
                user_absent(user_id, user_status, user_comment, user_latitude_position, user_longitude_position)
                return jsonify({"succes":False, "message":"attendance was logg, pls confirm to your teacher"})
    
    if user_status == "sakit" or user_status == "izin" or user_status == "dispen":
        if user_comment == " " :
            return jsonify({"success":False, "message":"please enter your reason"}), 400

        else : 
            user_absent(user_id, user_status, user_comment, user_latitude_position, user_longitude_position)
            return jsonify({"success":True, 'message':"get well soon"}), 200

    user_absent(user_id, user_status, user_comment, user_latitude_position, user_longitude_position)
    return jsonify({"success":True, "message":"finally you did it"}), 200

if __name__ == "__main__":
    app.run(debug=True)