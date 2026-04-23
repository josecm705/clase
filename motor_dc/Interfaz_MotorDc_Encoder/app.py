#!/usr/bin/env python3
# -*- coding: utf-8 -*-

from flask import Flask, render_template, request, redirect, url_for, session, jsonify
from werkzeug.security import check_password_hash
import serial
import json
import time

# ====== CREDENCIALES ======
APP_USER = "redes"
APP_PW_HASH = "scrypt:32768:8:1$mex9oXC3yGXur6bV$5d9c7b714dd9e5a01e37eace3a6114d5a14be633327bf0dea36923a37c4688005687c6498ae1d5988cefe552e6216ca6b21a74d9c9165dc10372c7908018f789"
SECRET_KEY = "root"

# ====== SERIAL ======
SERIAL_PORT = "/dev/ttyACM1"
BAUDRATE = 9600

arduino = None

def conectar_serial():
    global arduino
    try:
        arduino = serial.Serial(SERIAL_PORT, BAUDRATE, timeout=1)
        time.sleep(2)
        print("Arduino conectado en", SERIAL_PORT)
    except Exception as e:
        arduino = None
        print(" Error al conectar serial:", e)

conectar_serial()

# ====== APP ======
app = Flask(__name__, template_folder="templates", static_folder="static", static_url_path="/static")
app.secret_key = SECRET_KEY

# ====== VARIABLES ======
data = {
    "distancia": 0,
    "estado": "SIN DATOS",
    "pwm": 0
}

# =========================
# FUNCIONES
# =========================

def is_logged_in():
    return session.get("logged_in") is True


def read_arduino():
    global data, arduino

    # 
    if arduino is None or not arduino.is_open:
        conectar_serial()
        return

    try:
        for _ in range(5):
            if arduino.in_waiting > 0:
                line = arduino.readline().decode(errors='ignore').strip()

                print("SERIAL:", line)

                #  VALIDAR JSON
                if line.startswith("{") and line.endswith("}"):
                    parsed = json.loads(line)

                    #  CAMBIO CLAVE
                    if "distancia" in parsed:
                        data["distancia"] = parsed.get("distancia", 0)
                        data["estado"] = parsed.get("estado", "SIN DATOS")
                        data["pwm"] = parsed.get("pwm", 0)

                        return

    except Exception as e:
        print("ERROR SERIAL:", e)
        arduino = None  # fuerza reconexión


# =========================
# LOGIN
# =========================

@app.route("/login", methods=["GET", "POST"])
def login():
    if request.method == "POST":
        user = request.form.get("username", "").strip()
        pw = request.form.get("password", "")

        if user == APP_USER and check_password_hash(APP_PW_HASH, pw):
            session["logged_in"] = True
            return redirect(url_for("index"))

        return render_template("login.html", error="Usuario o contraseña incorrectos")

    return render_template("login.html", error=None)


@app.route("/logout")
def logout():
    session.clear()
    return redirect(url_for("login"))


# =========================
# WEB
# =========================

@app.route("/")
def index():
    if not is_logged_in():
        return redirect(url_for("login"))
    return render_template("index.html")


# =========================
# API SISTEMA 
# =========================

@app.get("/api/system")
def system_data():
    if not is_logged_in():
        return jsonify({"ok": False}), 401

    for _ in range(3):
        read_arduino()

    return jsonify({
        "ok": True,
        "distancia": data["distancia"],
        "estado": data["estado"],
        "pwm": data["pwm"]
    })


# =========================
# PING
# =========================

@app.get("/api/ping")
def ping():
    if not is_logged_in():
        return jsonify({"ok": False}), 401
    return jsonify({"ok": True})


# =========================
# MAIN
# =========================

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)