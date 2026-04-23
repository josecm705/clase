import socket
import serial

# --- CONFIGURACIÓN ---
SERIAL_PORT = "/dev/ttyACM0"
BAUDRATE    = 115200  # ⚠️ igual que Arduino

HOST = "0.0.0.0"
PORT = 5001
# ----------------------

def parse_cmd(cmd: str):
    cmd = cmd.strip()

    # Solo aceptar 0,1,2
    if cmd in ("0", "1", "2"):
        return (True, cmd)

    return (False, None)


def main():
    ser = serial.Serial(SERIAL_PORT, BAUDRATE, timeout=1)
    ser.reset_input_buffer()

    print(f"Conectado a Arduino en {SERIAL_PORT} a {BAUDRATE} baudios")
    print(f"Servidor motor escuchando en {HOST}:{PORT}...")

    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
        s.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
        s.bind((HOST, PORT))
        s.listen(5)

        while True:
            conn, addr = s.accept()
            with conn:
                data = conn.recv(1024)
                if not data:
                    continue

                raw = data.decode("utf-8", errors="ignore").strip()
                ok, cmd = parse_cmd(raw)

                if not ok:
                    conn.sendall(b"ERR:CMD\n")
                    continue

                # Enviar al Arduino
                ser.write(cmd.encode("utf-8"))
                ser.flush()

                # Leer respuesta (opcional)
                resp = ser.readline().decode("utf-8", errors="ignore").strip()
                if not resp:
                    resp = "OK"

                conn.sendall((resp + "\n").encode("utf-8"))


if __name__ == "__main__":
    main()