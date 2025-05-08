const express = require('express');
const axios = require('axios');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;
const CSV_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQKSb1EXkwC_yS66UHxKRFZe4GGeoSHrYIglb0fasG9XSUMHi-amqUB2Bn56tOSUfor3D97WOExPPPc/pub?gid=1560710832&single=true&output=csv';
const LOCAL_FILE = path.join(__dirname, 'eventos.csv');
const CACHE_TIME = 30 * 60 * 1000; // 30 minutos en milisegundos

// Función para descargar el CSV
const downloadCSV = async () => {
  try {
    console.log("⏳ Descargando CSV...");
    const response = await axios.get(CSV_URL);
    fs.writeFileSync(LOCAL_FILE, response.data, 'utf-8');
    console.log("✅ CSV actualizado correctamente.");
  } catch (error) {
    console.error("❌ Error al descargar el CSV:", error.message);
  }
};

// Descargar CSV al iniciar el servidor
downloadCSV();
setInterval(downloadCSV, CACHE_TIME);

// Ruta para servir el CSV
app.get('/csv', (req, res) => {
  res.sendFile(LOCAL_FILE);
});

// Servir el HTML principal
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});
