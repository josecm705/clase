import socket
import serial
import threading

ser = serial.Serial("/dev/ttyACM0",9600,timeout=1)

data = {"temp":"0","rango":"N/A","vel":"0"}

def leer():
    global data
    while True:
        try:
            linea = ser.readline().decode().strip()
            t,r,v = linea.split(",")
            data = {"temp":t,"rango":r,"vel":v}
        except:
            pass

threading.Thread(target=leer,daemon=True).start()

s = socket.socket()
s.bind(("0.0.0.0",5001))
s.listen(5)

while True:
    c,_ = s.accept()
    cmd = c.recv(1024).decode().strip()

    if cmd == "GET":
        c.send(f"{data['temp']},{data['rango']},{data['vel']}\n".encode())

    elif cmd in ["START","STOP"]:
        ser.write((cmd+"\n").encode())
        c.send(b"OK\n")

    c.close()
