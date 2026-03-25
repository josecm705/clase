from flask import Flask,render_template,request,redirect,session,jsonify
from werkzeug.security import check_password_hash
import socket

app = Flask(__name__)
app.secret_key = "redes"

USER="jose"
PASS_HASH="scrypt:32768:8:1$PXz7Kdv1KeieHVen$68c53571e762afd092bef391b720e3aa4037bf9d3a84ab21b0d3b4c274683ee20d5821794f6efafda6b1285e2e56216e9039cce355c1fa2f5476db3c7046a92c"

def send(cmd):
    s=socket.create_connection(("127.0.0.1",5001))
    s.send((cmd+"\n").encode())
    r=s.recv(1024).decode()
    s.close()
    return r

@app.route("/login",methods=["GET","POST"])
def login():
    if request.method=="POST":
        if request.form["username"]==USER and check_password_hash(PASS_HASH,request.form["password"]):
            session["ok"]=True
            return redirect("/")
    return render_template("login.html")

@app.route("/logout")
def logout():
    session.clear()
    return redirect("/login")

@app.route("/")
def index():
    if not session.get("ok"): return redirect("/login")
    return render_template("index.html")

@app.get("/data")
def data():
    r=send("GET")
    t,rango,v=r.split(",")
    return jsonify({"temp":t,"rango":rango,"vel":v})

@app.post("/control")
def control():
    send(request.json["cmd"])
    return {"ok":True}

app.run(host="0.0.0.0",port=5000)
