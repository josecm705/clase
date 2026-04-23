// ====== DATOS ======
let rpmDatos = [];
let vueltasDatos = [];

// ====== CONTEXTOS ======
const ctxRPM = document.getElementById("graficaRPM").getContext("2d");
const ctxV = document.getElementById("graficaV").getContext("2d");

// ====== GRÁFICAS ======
const grafRPM = new Chart(ctxRPM, {
    type: "line",
    data: {
        labels: [],
        datasets: [{
            label: "RPM",
            data: rpmDatos,
            borderWidth: 2
        }]
    }
});

const grafV = new Chart(ctxV, {
    type: "line",
    data: {
        labels: [],
        datasets: [{
            label: "Vueltas",
            data: vueltasDatos,
            borderWidth: 2
        }]
    }
});

// ====== APAGAR LEDS ======
function apagar(lista) {
    lista.forEach(id => {
        document.getElementById(id).classList.remove("activo");
    });
}

// ====== ACTUALIZAR SISTEMA ======
function actualizar() {

    fetch("/api/system")
    .then(r => r.json())
    .then(data => {

        if (!data.ok) return;

        let rpm = data.rpm;
        let vueltas = data.vueltas;
        let pulsos = data.pulsos;

        // ====== MOSTRAR VALORES ======
        document.getElementById("rpm_valor").innerText = rpm;
        document.getElementById("vueltas_valor").innerText = vueltas.toFixed(2);
        document.getElementById("pulsos_valor").innerText = pulsos;

        // ====== LED RPM ======
        apagar(["rpm_verde","rpm_amarillo","rpm_rojo"]);

        if (rpm > 60) {
            document.getElementById("rpm_verde").classList.add("activo");
        }
        else if (rpm > 20) {
            document.getElementById("rpm_amarillo").classList.add("activo");
        }
        else {
            document.getElementById("rpm_rojo").classList.add("activo");
        }

        // ====== GUARDAR DATOS ======
        rpmDatos.push(rpm);
        vueltasDatos.push(vueltas);

        if (rpmDatos.length > 20) rpmDatos.shift();
        if (vueltasDatos.length > 20) vueltasDatos.shift();

        grafRPM.data.labels.push("");
        grafV.data.labels.push("");

        if (grafRPM.data.labels.length > 20) grafRPM.data.labels.shift();
        if (grafV.data.labels.length > 20) grafV.data.labels.shift();

        grafRPM.update();
        grafV.update();
    })
    .catch(err => console.error(err));
}

// ====== CONTROL MOTOR ======
function enviar(cmd) {

    fetch("/api/control", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ cmd: cmd })
    })
    .then(r => r.json())
    .then(res => {
        console.log("Comando:", cmd);
    });
}

// ====== INTERVALO ======
setInterval(actualizar, 500);