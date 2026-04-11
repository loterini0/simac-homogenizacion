import { useState } from "react";
import axios from "axios";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

const API = "http://localhost:3001";

const COLORS = {
  negro: "#1a1a1a",
  rojo: "#c0392b",
  amarillo: "#f39c12",
  gris: "#f5f5f5",
  grisMedio: "#e0e0e0",
  blanco: "#ffffff",
  rojoClaro: "rgba(192,57,43,0.08)"
};

export default function App() {
  const [originalData, setOriginalData] = useState([]);
  const [processedData, setProcessedData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [fileName, setFileName] = useState(null);

  const handleFileUpload = async (e) => {
  const file = e.target.files[0];
  if (!file) return;
  try {
    const text = await file.text();
    const json = JSON.parse(text);
    const isValid = Array.isArray(json) && json.every(r => r.fecha && r.hora);
    if (!isValid) throw new Error();
    setOriginalData(json);
    setFileName(file.name);
    setProcessedData([]);
    setError(null);
  } catch {
    setError("Error leyendo el archivo. Asegúrate de que sea un JSON válido.");
  }
};

  const handleHomogenize = async () => {
    if (originalData.length === 0) return;
    setLoading(true);
    try {
      const res = await axios.post(`${API}/homogenize`, originalData);
      setProcessedData(res.data);
      setError(null);
    } 
    catch (err) {
    setError(err.response?.data?.message || "Error al procesar datos.");
    } finally {
      setLoading(false);
    }
  };

  const chartData = {
    labels: processedData.map(r => r.hora),
    datasets: [
      {
        label: "Temperatura interpolada (°C)",
        data: processedData.map(r => r.temp === "ND" ? null : r.temp),
        borderColor: COLORS.rojo,
        backgroundColor: COLORS.rojoClaro,
        pointBackgroundColor: COLORS.amarillo,
        pointBorderColor: COLORS.negro,
        pointRadius: 5,
        tension: 0.4,
        spanGaps: false,
        fill: true
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { position: "top", labels: { color: COLORS.negro, font: { size: 13 } } },
      title: { display: false }
    },
    scales: {
      x: { ticks: { color: COLORS.negro }, grid: { color: COLORS.grisMedio } },
      y: { ticks: { color: COLORS.negro }, grid: { color: COLORS.grisMedio } }
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: COLORS.gris, fontFamily: "'Inter', sans-serif" }}>

      {/* Header */}
      <header style={{ background: COLORS.negro, padding: "16px 40px", display: "flex", alignItems: "center", gap: 20, boxShadow: "0 2px 8px rgba(0,0,0,0.4)" }}>
        <img src="/simac-logo.png" alt="SIMAC" style={{ height: 56 }} />
        <div>
          <h1 style={{ margin: 0, color: COLORS.blanco, fontSize: 24, letterSpacing: 1, fontFamily: "'Rajdhani', sans-serif" }}>
            Sistema de Homogenización Climática
          </h1>
          <p style={{ margin: 0, color: "#aaa", fontSize: 13 }}>
            Sistema Integrado de Monitoreo Ambiental de Caldas
          </p>
        </div>
      </header>

      {/* Franja amarilla */}
      <div style={{ height: 5, background: `linear-gradient(to right, ${COLORS.rojo}, ${COLORS.amarillo})` }} />

      {/* Contenido */}
      <main style={{ maxWidth: 1100, margin: "0 auto", padding: "32px 24px" }}>

        {/* Card de carga */}
        <div style={card}>
          <h2 style={sectionTitle}>Cargar datos de estación</h2>
          <div style={{ display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
            <label style={uploadLabel}>
              {fileName ? ` ${fileName}` : "Seleccionar archivo JSON"}
              <input type="file" accept=".json" onChange={handleFileUpload} style={{ display: "none" }} />
            </label>
            <button
              onClick={handleHomogenize}
              disabled={loading || originalData.length === 0}
              style={loading || originalData.length === 0 ? btnDisabled : btnPrimary}
            >
              {loading ? "Procesando" : "Homogenizar"}
            </button>
          </div>
          {error && <p style={{ color: COLORS.rojo, marginTop: 12 }}> {error}</p>}
        </div>

        {processedData.length > 0 && (
          <>
            {/* Tabla */}
<div style={{ ...card, marginTop: 24 }}>
  <h2 style={sectionTitle}>Tabla Comparativa</h2>

  {/* Tabla Original */}
  <h3 style={{ color: "#555", fontSize: 14, marginBottom: 8 }}>Datos Originales</h3>
  <div style={{ overflowX: "auto", marginBottom: 32 }}>
    <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
      <thead>
        <tr style={{ background: "#555", color: "#fff" }}>
          {["Fecha","Hora","Temp","Vel Viento","Dir Viento","Dir Rosa","Presión","Humedad","PPT","Rad Solar","EVT"].map(h => (
            <th key={h} style={th}>{h}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {originalData.map((row, i) => (
          <tr key={i} style={{ background: i % 2 === 0 ? COLORS.blanco : COLORS.gris }}>
            <td style={td}>{row.fecha}</td>
            <td style={td}>{row.hora}</td>
            <td style={td}>{row.temp ?? "ND"}</td>
            <td style={td}>{row.vel_viento ?? "ND"}</td>
            <td style={td}>{row.dir_viento ?? "ND"}</td>
            <td style={td}>
              <span style={{ background: "#ddd", color: COLORS.negro, padding: "2px 8px", borderRadius: 12, fontSize: 11, fontWeight: 700 }}>
                {row.dir_rosa ?? "ND"}
              </span>
            </td>
            <td style={td}>{row.presion ?? "ND"}</td>
            <td style={td}>{row.humedad ?? "ND"}</td>
            <td style={td}>{row.ppt_cincom ?? "ND"}</td>
            <td style={td}>{row.rad_solar ?? "ND"}</td>
            <td style={td}>{row.evt_cincom ?? "ND"}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>

  {/* Tabla Cincominutal */}
  <h3 style={{ color: "#555", fontSize: 14, marginBottom: 8 }}>Datos Cincominutales</h3>
  <div style={{ overflowX: "auto" }}>
    <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
      <thead>
        <tr style={{ background: COLORS.negro, color: COLORS.blanco }}>
          {["Fecha","Hora","Temp","Vel Viento","Dir Viento","Dir Rosa","Presión","Humedad","PPT","Rad Solar","EVT"].map(h => (
            <th key={h} style={th}>{h}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {processedData.map((row, i) => (
          <tr key={i} style={{ background: i % 2 === 0 ? COLORS.blanco : COLORS.gris }}>
            <td style={td}>{row.fecha}</td>
            <td style={{ ...td, fontWeight: 600 }}>{row.hora}</td>
            <td style={{ ...td, color: row.temp === "ND" ? COLORS.rojo : "#27ae60", fontWeight: 600 }}>{row.temp}</td>
            <td style={{ ...td, color: row.vel_viento === "ND" ? COLORS.rojo : "inherit" }}>{row.vel_viento}</td>
            <td style={{ ...td, color: row.dir_viento === "ND" ? COLORS.rojo : "inherit" }}>{row.dir_viento}</td>
            <td style={td}>
              <span style={{ background: COLORS.amarillo, color: COLORS.negro, padding: "2px 8px", borderRadius: 12, fontSize: 11, fontWeight: 700 }}>
                {row.dir_rosa}
              </span>
            </td>
            <td style={{ ...td, color: row.presion === "ND" ? COLORS.rojo : "inherit" }}>{row.presion}</td>
            <td style={{ ...td, color: row.humedad === "ND" ? COLORS.rojo : "inherit" }}>{row.humedad}</td>
            <td style={{ ...td, color: row.ppt_cincom === "ND" ? COLORS.rojo : "inherit" }}>{row.ppt_cincom}</td>
            <td style={{ ...td, color: row.rad_solar === "ND" ? COLORS.rojo : "inherit" }}>{row.rad_solar}</td>
            <td style={{ ...td, color: row.evt_cincom === "ND" ? COLORS.rojo : "inherit" }}>{row.evt_cincom}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
</div>

            {/* Gráfica */}
            <div style={{ ...card, marginTop: 24 }}>
              <h2 style={sectionTitle}>Curva de Temperatura Interpolada</h2>
              <Line data={chartData} options={chartOptions} />
            </div>
          </>
        )}
      </main>
    </div>
  );
}

const card = { background: "#ffffff", borderRadius: 10, padding: 24, boxShadow: "0 2px 12px rgba(0,0,0,0.08)" };
const sectionTitle = { margin: "0 0 16px 0", color: "#1a1a1a", fontSize: 17, fontWeight: 700, borderLeft: "4px solid #c0392b", paddingLeft: 10 };
const th = { padding: "12px 14px", textAlign: "left", fontWeight: 600, letterSpacing: 0.5 };
const td = { padding: "10px 14px", borderBottom: "1px solid #f0f0f0" };
const uploadLabel = { padding: "10px 20px", background: "#f0f0f0", border: "2px dashed #ccc", borderRadius: 8, cursor: "pointer", fontSize: 14, color: "#555" };
const btnPrimary = { padding: "10px 24px", background: "#c0392b", color: "white", border: "none", borderRadius: 8, cursor: "pointer", fontSize: 14, fontWeight: 700, letterSpacing: 0.5 };
const btnDisabled = { padding: "10px 24px", background: "#ccc", color: "#888", border: "none", borderRadius: 8, cursor: "not-allowed", fontSize: 14, fontWeight: 700 };