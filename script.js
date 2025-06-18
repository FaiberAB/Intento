document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector("form");
  const resultadoDiv = document.querySelector(".resultados");
  const errorDiv = document.querySelector(".error");
  const canvas = document.getElementById("canvas");
  const ctx = canvas.getContext("2d");

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const anguloA = parseFloat(form.anguloA.value);
    const anguloB = parseFloat(form.anguloB.value);
    const masa    = parseFloat(form.masa.value);
    const g       = 10;
    const peso    = masa * g;

    try {
      const a = anguloA * Math.PI / 180;
      const b = anguloB * Math.PI / 180;

      // Newton-Raphson para resolver t2
      function derivada(fn, x, h = 1e-5) {
        return (fn(x + h) - fn(x - h)) / (2 * h);
      }

      function f_T2(t2) {
        const t1 = (-Math.cos(b) * t2) / Math.cos(a);
        return (t1 * Math.sin(a) + t2 * Math.sin(b)) - peso;
      }

      function encontrarT2(fn, guess = 10, tol = 1e-4, maxIter = 100) {
        let t2 = guess;
        for (let i = 0; i < maxIter; i++) {
          const delta = fn(t2) / derivada(fn, t2);
          t2 -= delta;
          if (Math.abs(delta) < tol) break;
        }
        return t2;
      }

      const t2 = encontrarT2(f_T2);
      const t1 = (-Math.cos(b) * t2) / Math.cos(a);
      const t3 = peso;

      // Mostrar resultados
      resultadoDiv.innerHTML = `
        <h3>Resultados</h3>
        <p><strong>Tensión 1:</strong> ${t1.toFixed(2)} N</p>
        <p><strong>Tensión 2:</strong> ${t2.toFixed(2)} N</p>
        <p><strong>Tensión 3 (peso):</strong> ${t3.toFixed(2)} N</p>
      `;
      resultadoDiv.style.display = "block";
      errorDiv.textContent = "";

      // Dibujar tensiones
      dibujarGrafico(a, b);
    } catch (err) {
      errorDiv.textContent = "Error en los cálculos: " + err.message;
      resultadoDiv.style.display = "none";
    }
  });

  function dibujarGrafico(a, b) {
    const w = canvas.width, h = canvas.height;
    ctx.clearRect(0, 0, w, h);
    const cx = w/2, cy = h/2, esc = 100;

    const vects = [
      { x:  Math.cos(a)*esc, y: -Math.sin(a)*esc, col:"blue",  ang:a, label:"T1" },
      { x:  Math.cos(b)*esc, y: -Math.sin(b)*esc, col:"green", ang:b, label:"T2" },
      { x:  0,               y:  esc,            col:"red",   ang:3*Math.PI/2, label:"T3" }
    ];

    ctx.lineWidth = 3;
    ctx.font = "bold 14px sans-serif";

    for (let v of vects) {
      ctx.strokeStyle = v.col;
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(cx + v.x, cy + v.y);
      ctx.stroke();

      ctx.fillStyle = v.col;
      const grados = (v.ang * 180/Math.PI).toFixed(1) + "°";
      ctx.fillText(grados, cx + v.x*0.6, cy + v.y*0.6);
    }
  }
});
