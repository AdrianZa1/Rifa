const sheetURL = "https://opensheet.elk.sh/1BZ-JB2wLp5xi1XUgzqRN3iv2jHLy3Tmfl_myCuKmS4A/Hoja1";
let datosOriginales = [];

function cargarDatos() {
  fetch(sheetURL)
    .then(res => res.json())
    .then(data => {
      datosOriginales = data.filter(row => row["n"]); // Solo filas con número
      aplicarFiltros();
    })
    .catch(err => {
      document.getElementById("tabla-rifa").innerHTML = `<tr><td colspan="3">❌ Error al cargar los datos</td></tr>`;
      console.error("Error cargando datos:", err);
    });
}

function aplicarFiltros() {
  const estado = document.getElementById("estado").value;
  const numeroExacto = document.getElementById("numeroExacto").value.trim();

  let datosFiltrados = [];

  if (numeroExacto) {
    datosFiltrados = datosOriginales.filter(
      row => parseInt(row["n"]) === parseInt(numeroExacto)
    );
  } else {
    datosFiltrados = datosOriginales.filter(row => {
      const nombre = row["Nombre"];
      const apellido = row["Apellido"];
      const ocupado = nombre || apellido;

      return (
        estado === "todos" ||
        (estado === "disponibles" && !ocupado) ||
        (estado === "ocupados" && ocupado)
      );
    });
  }

  mostrarTabla(datosFiltrados, numeroExacto);
}

function mostrarTabla(datos, numeroExacto = "") {
  const tbody = document.getElementById("tabla-rifa");
  tbody.innerHTML = "";

  if (datos.length === 0) {
    tbody.innerHTML = `<tr><td colspan="3">
      ${numeroExacto ? `El número ${numeroExacto} no está en la lista.` : "No se encontraron resultados."}
    </td></tr>`;
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
setInterval(cargarDatos, 30000);
