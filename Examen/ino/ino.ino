#include "DHT.h"

#define DHTPIN 2
#define DHTTYPE DHT22
DHT dht(DHTPIN, DHTTYPE);

// Motor
#define ENA 10
#define IN1 8
#define IN2 9

// Estado del sistema
bool sistemaActivo = false;

void setup() {
  Serial.begin(9600);
  dht.begin();

  pinMode(ENA, OUTPUT);
  pinMode(IN1, OUTPUT);
  pinMode(IN2, OUTPUT);

  
  digitalWrite(IN1, LOW);
  digitalWrite(IN2, LOW);
  analogWrite(ENA, 0);
}

void loop() {

  
  if (Serial.available()) {
    String cmd = Serial.readStringUntil('\n');
    cmd.trim();

    if (cmd == "START") {
      sistemaActivo = true;
    }

    if (cmd == "STOP") {
      sistemaActivo = false;

      // apagar motor
      analogWrite(ENA, 0);
      digitalWrite(IN1, LOW);
      digitalWrite(IN2, LOW);
    }
  }

  
  if (!sistemaActivo) {
    return;
  }


  float t = dht.readTemperature();

  if (isnan(t)) return;

  int velocidad;
  String nivel;

  
  if (t <= 20) {
    velocidad = 255;   // alta velocidad
    nivel = "BAJA";
  } 
  else if (t <= 29) {
    velocidad = 150;   // media
    nivel = "MEDIA";
  } 
  else {
    velocidad = 80;    // baja velocidad
    nivel = "ALTA";
  }

  digitalWrite(IN1, HIGH);
  digitalWrite(IN2, LOW);
  analogWrite(ENA, velocidad);

  
  Serial.print(t);
  Serial.print(",");
  Serial.print(nivel);
  Serial.print(",");
  Serial.println(velocidad);

  delay(500);
}
