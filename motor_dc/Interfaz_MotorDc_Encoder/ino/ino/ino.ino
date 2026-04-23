// ====== CONFIGURACIÓN ======
#define ENA 10   // PWM velocidad
#define IN1 8
#define IN2 9

#define ENCODER_A 2  // interrupción

float PULSOS_POR_VUELTA = 660.0;

// ====== VARIABLES ======
volatile long pulsos = 0;

unsigned long tiempoAnterior = 0;
long pulsosPrevios = 0;

int estadoMotor = 0; // 0=stop, 1=izq, 2=der

// ====== INTERRUPCIÓN ======
void contar() {
  pulsos++;
}

// ====== SETUP ======
void setup() {
  Serial.begin(115200);

  // Encoder
  pinMode(ENCODER_A, INPUT_PULLUP);
  attachInterrupt(digitalPinToInterrupt(ENCODER_A), contar, RISING);

  // Motor
  pinMode(ENA, OUTPUT);
  pinMode(IN1, OUTPUT);
  pinMode(IN2, OUTPUT);

  detenerMotor();

  Serial.println("Sistema listo:");
  Serial.println("0 = STOP | 1 = IZQUIERDA | 2 = DERECHA");
}

// ====== FUNCIONES MOTOR ======
void detenerMotor() {
  digitalWrite(IN1, LOW);
  digitalWrite(IN2, LOW);
  analogWrite(ENA, 0);
}

void girarIzquierda() {
  digitalWrite(IN1, HIGH);
  digitalWrite(IN2, LOW);
  analogWrite(ENA, 150);
}

void girarDerecha() {
  digitalWrite(IN1, LOW);
  digitalWrite(IN2, HIGH);
  analogWrite(ENA, 150);
}

// ====== LOOP ======
void loop() {

  // ===== Leer comandos por Serial =====
  if (Serial.available()) {
    char comando = Serial.read();

    if (comando == '0') {
      estadoMotor = 0;
      detenerMotor();
    }
    else if (comando == '1') {
      estadoMotor = 1;
      girarIzquierda();
    }
    else if (comando == '2') {
      estadoMotor = 2;
      girarDerecha();
    }
  }

  // ===== Mostrar datos =====
  Serial.print("Estado: ");
  Serial.print(estadoMotor);

  Serial.print(" | Pulsos: ");
  Serial.print(pulsos);

  float vueltas = pulsos / PULSOS_POR_VUELTA;

  Serial.print(" | Vueltas: ");
  Serial.print(vueltas, 3);

  // ===== RPM =====
  unsigned long ahora = millis();

  if (ahora - tiempoAnterior >= 1000) {

    long deltaPulsos = pulsos - pulsosPrevios;

    float rpm = (deltaPulsos / PULSOS_POR_VUELTA) * 60.0;

    Serial.print(" | RPM: ");
    Serial.print(rpm);

    pulsosPrevios = pulsos;
    tiempoAnterior = ahora;
  }

  Serial.println();

  delay(300);
}