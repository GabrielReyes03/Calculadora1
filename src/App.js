import React, { useState } from "react";
import "./App.css"; // Importamos los estilos desde el archivo CSS

function App() {
  const [equation1, setEquation1] = useState("");
  const [equation2, setEquation2] = useState("");
  const [result, setResult] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false); // Estado para controlar el modal

  // Función para convertir fracciones a decimales
  const fractionToDecimal = (fraction) => {
    const parts = fraction.split("/");
    if (parts.length === 2) {
      return parseFloat(parts[0]) / parseFloat(parts[1]);
    }
    return parseFloat(fraction);
  };

  // Función para analizar ecuaciones que pueden incluir fracciones, decimales y negativos
  const parseEquation = (equation) => {
    const regex = /([+-]?\d*\.?\d*(\/\d*\.?\d*)?)x\s*([+-]\s*\d*\.?\d*(\/\d*\.?\d*)?)y\s*=\s*([+-]?\d*\.?\d*(\/\d*\.?\d*)?)/;
    const match = equation.match(regex);

    if (match) {
      // Convertimos fracciones a decimales si las encontramos en la ecuación
      const a = fractionToDecimal(match[1].replace(/\s+/g, "")) || 1;
      const b = fractionToDecimal(match[3].replace(/\s+/g, "")) || 1;
      const c = fractionToDecimal(match[5].replace(/\s+/g, ""));
      return { a, b, c };
    }
    return null;
  };

  // Función para calcular los determinantes
  const calculateDeterminants = () => {
    const eq1 = parseEquation(equation1);
    const eq2 = parseEquation(equation2);

    if (!eq1 || !eq2) {
      setResult("Formato incorrecto de ecuaciones. Por favor ingresa ecuaciones válidas.");
      setIsModalOpen(true);
      return;
    }

    const { a: a1, b: b1, c: c1 } = eq1;
    const { a: a2, b: b2, c: c2 } = eq2;

    // Determinante principal (D)
    const D = a1 * b2 - b1 * a2;

    if (D === 0) {
      setResult("No hay solución única (D = 0).");
      setIsModalOpen(true);
      return;
    }

    // Determinantes para x y y (Dx, Dy)
    const Dx = c1 * b2 - b1 * c2;
    const Dy = a1 * c2 - c1 * a2;

    // Soluciones para x y y, redondeadas a tres decimales
    const x = parseFloat((Dx / D).toFixed(3));
    const y = parseFloat((Dy / D).toFixed(3));

    // Guardar resultado en el estado con el procedimiento detallado, incluyendo color rojo en los signos
    setResult({
      D: D.toFixed(3),
      Dx: Dx.toFixed(3),
      Dy: Dy.toFixed(3),
      x,
      y,
      procedure: `
      <strong><span style="color: red;">Determinante del sistema (D):</strong><br/>
      | ${a1.toFixed(3)} <span style="color:red;">${b1 >= 0 ? "+" : "-"}</span> ${Math.abs(b1.toFixed(3))} |<br/>
      | ${a2.toFixed(3)} <span style="color:red;">${b2 >= 0 ? "+" : "-"}</span> ${Math.abs(b2.toFixed(3))} | = ${a1.toFixed(3)} * ${b2.toFixed(3)} <span style="color:red;">-</span> ${b1.toFixed(3)} * ${a2.toFixed(3)} = ${D.toFixed(3)}
      
      <strong><span style="color: red;">Determinante para x (Dx):</strong><br/>
      | ${c1.toFixed(3)} <span style="color:red;">${b1 >= 0 ? "+" : "-"}</span> ${Math.abs(b1.toFixed(3))} |<br/>
      | ${c2.toFixed(3)} <span style="color:red;">${b2.toFixed(3) >= 0 ? "+" : "-"}</span> ${Math.abs(b2.toFixed(3))} | = ${c1.toFixed(3)} * ${b2.toFixed(3)} <span style="color:red;">-</span> ${b1.toFixed(3)} * ${c2.toFixed(3)} = ${Dx.toFixed(3)}
      
      <strong><span style="color: red;">Determinante para y (Dy):</strong><br/>
      | ${a1.toFixed(3)} <span style="color:red;">${c1 >= 0 ? "+" : "-"}</span> ${Math.abs(c1.toFixed(3))} |<br/>
      | ${a2.toFixed(3)} <span style="color:red;">${c2 >= 0 ? "+" : "-"}</span> ${Math.abs(c2.toFixed(3))} | = ${a1.toFixed(3)} * ${c2.toFixed(3)} <span style="color:red;">-</span> ${c1.toFixed(3)} * ${a2.toFixed(3)} = ${Dy.toFixed(3)}
      
      <strong><span style="color: green;">Soluciones:</span></strong><br/>
      x = Dx / D = ${Dx.toFixed(3)} / ${D.toFixed(3)} = ${x.toFixed(3)}<br/>
      y = Dy / D = ${Dy.toFixed(3)} / ${D.toFixed(3)} = ${y.toFixed(3)}
    `,
    
    });
    setIsModalOpen(true);
  };

  return (
    <div className="app-container">
      <h1 className="title">Calculadora de Ecuaciones</h1>
      <h1 className="autor">Gabriel Reyes</h1>
      <p className="description">Solución de un sistema de ecuaciones por determinantes</p>

      <div className="input-container">
        <input
          type="text"
          placeholder="Primera ecuación (ej. 1/2x - 3/4y = 5/4)"
          value={equation1}
          onChange={(e) => setEquation1(e.target.value)}
          className="input"
        />
        <br />
        <input
          type="text"
          placeholder="Segunda ecuación (ej. 2/3x + 1/3y = 1/6)"
          value={equation2}
          onChange={(e) => setEquation2(e.target.value)}
          className="input"
        />
      </div>

      <button className="calculate-button" onClick={calculateDeterminants}>
        Calcular
      </button>

      {/* Modal para mostrar el procedimiento */}
      {isModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={() => setIsModalOpen(false)}>&times;</span>
            <h3>Procedimiento:</h3>
            {result && typeof result === "object" && (
              <p className="procedure-text" dangerouslySetInnerHTML={{ __html: result.procedure }}></p>
            )}
            {result && typeof result === "string" && <p>{result}</p>}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;


// Funciona
// Sistema con decimales
// 1.5x+2.3y=4.1
// 3.2x-4.1y=7.8


//Funciona
// Sistema con números negativos
// -2x + 3y =-7
// 4x - 5y = 9

//Funciona
//Sistema con fracciones
// 1/2x -3/4y = 5/4
// 2/3x +1/3y = 1/6