function limpiar(p){
  ["baja","media","alta"].forEach(x=>{
    document.getElementById(p+"-"+x).className="led"
  })
}

async function actualizar(){
  let r=await fetch("/data")
  let j=await r.json()

  document.getElementById("temp").textContent=j.temp
  document.getElementById("rango").textContent=j.rango
  document.getElementById("vel").textContent=j.vel

  let t=parseFloat(j.temp)
  let v=parseInt(j.vel)

  limpiar("temp")
  limpiar("vel")

  if(t<=20){
    document.getElementById("temp-baja").classList.add("verde")
  }
  else if(t<=29){
    document.getElementById("temp-media").classList.add("amarillo")
  }
  else{
    document.getElementById("temp-alta").classList.add("rojo","parpadeo")
  }

  if(v>=200){
    document.getElementById("vel-alta").classList.add("rojo","parpadeo")
  }
  else if(v>=100){
    document.getElementById("vel-media").classList.add("amarillo")
  }
  else{
    document.getElementById("vel-baja").classList.add("verde")
  }
}

async function control(cmd){
  await fetch("/control",{
    method:"POST",
    headers:{"Content-Type":"application/json"},
    body:JSON.stringify({cmd})
  })
}

setInterval(actualizar,500)
