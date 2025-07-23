const sheetURL = "https://opensheet.elk.sh/1BZ-JB2wLp5xi1XUgzqRN3iv2jHLy3Tmfl_myCuKmS4A/Hoja1";
let datosOriginales = [];

function cargarDatos() {
  fetch(sheetURL)
    .then(res => res.json())
    .then(data => {
      datosOriginales = data.filter(row => row["n"]); // Guarda los datos una sola vez
      aplicarFiltros();
    })
    .catch(err => {
      document.getElementById("tabla-rifa").innerHTML = `<tr><td colspan="3">❌ Error al cargar los datos</td></tr>`;
      console.error("Error cargando datos:", err);
    });
}

function aplicarFiltros() {
  const estado = document.getElementById("estado").value;
  const desde = parseInt(document.getElementById("desde").value);
  const hasta = parseInt(document.getElementById("hasta").value);

  let datosFiltrados = datosOriginales.filter(row => {
    const numero = parseInt(row["n"]);
    const nombre = row["Nombre"];
    const apellido = row["Apellido"];
    const ocupado = nombre || apellido;

    let cumpleEstado =
      estado === "todos" ||
      (estado === "disponibles" && !ocupado) ||
      (estado === "ocupados" && ocupado);

    let cumpleRango =
      (!desde || numero >= desde) &&
      (!hasta || numero <= hasta);

    return cumpleEstado && cumpleRango;
  });

  mostrarTabla(datosFiltrados);
}

function mostrarTabla(datos) {
  const tbody = document.getElementById("tabla-rifa");
  tbody.innerHTML = "";

  if (datos.length === 0) {
    tbody.innerHTML = `<tr><td colspan="3">No se encontraron resultados.</td></tr>`;
    return;
  }

  datos.forEach(row => {
    const numero = row["n"];
    const nombre = row["Nombre"];
    const apellido = row["Apellido"];
    const ocupado = nombre || apellido;

    const tr = document.createElement("tr");
    tr.className = ocupado ? "ocupado" : "disponible";
    tr.innerHTML = `
      <td>${numero}</td>
      <td>${nombre || ""}</td>
      <td>${apellido || ""}</td>
    `;
    tbody.appendChild(tr);
  });
}

cargarDatos();
setInterval(cargarDatos, 30000); // Recarga cada 30s
