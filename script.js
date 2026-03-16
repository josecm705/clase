const USER = "Jose";
const PASS = "6243";

function login(){

let usuario = document.getElementById("usuario").value;
let password = document.getElementById("password").value;

if(usuario === USER && password === PASS){

document.getElementById("login").style.display="none";
document.getElementById("sistema").style.display="block";

}else{

document.getElementById("error").innerText="Usuario o contraseña incorrectos";

}

}


/* ENTER LOGIN */

document.addEventListener("keydown",function(e){

if(e.key==="Enter"){
login();
}

});


/* LOGOUT */

function logout(){

document.getElementById("sistema").style.display="none";
document.getElementById("login").style.display="flex";

document.getElementById("usuario").value="";
document.getElementById("password").value="";
document.getElementById("error").innerText="";

}


/* HUMEDAD */

const humedad=document.getElementById("humedad");
const valorH=document.getElementById("valorHumedad");
const ledH=document.getElementById("ledHumedad");
const estadoH=document.getElementById("estadoHumedad");
const alertaH=document.getElementById("alertaHumedad");

humedad.addEventListener("input",function(){

let h=humedad.value;

valorH.textContent=h;

if(h<=8){

ledH.style.background="red";
ledH.style.animation="parpadeo 0.6s infinite";

estadoH.textContent="Baja humedad";
alertaH.textContent="ALERTA: humedad baja";

}
else if(h<=15){

ledH.style.background="yellow";
ledH.style.animation="none";

estadoH.textContent="Humedad normal";
alertaH.textContent="Sistema estable";

}
else{

ledH.style.background="green";
ledH.style.animation="parpadeo 0.6s infinite";

estadoH.textContent="Alta humedad";
alertaH.textContent="ALERTA: humedad alta";

}

});


/* TEMPERATURA */

const temp=document.getElementById("temperatura");
const valorT=document.getElementById("valorTemp");
const ledT=document.getElementById("ledTemp");
const estadoT=document.getElementById("estadoTemp");
const alertaT=document.getElementById("alertaTemp");

temp.addEventListener("input",function(){

let t=temp.value;

valorT.textContent=t;

if(t<15){

ledT.style.background="blue";
ledT.style.animation="parpadeo 0.6s infinite";

estadoT.textContent="Temperatura fría";
alertaT.textContent="ALERTA: temperatura baja";

}
else if(t<=30){

ledT.style.background="green";
ledT.style.animation="none";

estadoT.textContent="Temperatura normal";
alertaT.textContent="Sistema estable";

}
else{

ledT.style.background="red";
ledT.style.animation="parpadeo 0.6s infinite";

estadoT.textContent="Temperatura alta";
alertaT.textContent="ALERTA: temperatura alta";

}

});


/* LUZ */

const luz=document.getElementById("luz");
const valorL=document.getElementById("valorLuz");
const ledL=document.getElementById("ledLuz");
const estadoL=document.getElementById("estadoLuz");
const alertaL=document.getElementById("alertaLuz");

luz.addEventListener("input",function(){

let l=luz.value;

valorL.textContent=l;

if(l<30){

ledL.style.background="blue";
ledL.style.animation="parpadeo 0.6s infinite";

estadoL.textContent="Luz baja";
alertaL.textContent="ALERTA: poca luz";

}
else if(l<=70){

ledL.style.background="green";
ledL.style.animation="none";

estadoL.textContent="Luz normal";
alertaL.textContent="Sistema estable";

}
else{

ledL.style.background="yellow";
ledL.style.animation="parpadeo 0.6s infinite";

estadoL.textContent="Mucha luz";
alertaL.textContent="ALERTA: exceso de luz";

}

});
