document.addEventListener("DOMContentLoaded", function() {
    // Seleccionar todas las filas de la tabla
    const filas = document.querySelectorAll("tbody tr");
    const detalle = document.getElementById("detalle");

    filas.forEach(fila => {
        fila.addEventListener("click", function() {
            const celdas = fila.querySelectorAll("td");
            const cod_bulto = celdas[0].textContent.trim()
            const contenedor = celdas[1].textContent.trim()
            const valor_celda = celdas[2].textContent.trim()
            const d_articulo = celdas[3].textContent.trim()
            const c_unidades = celdas[4].textContent.trim()
            
            // Convertir NodeList a Array y luego a JSON
            let celdasArray = Array.from(celdas).map(celda => celda.textContent || celda.value || celda.innerText);
            localStorage.setItem('celdas', JSON.stringify(celdasArray));

            localStorage.setItem("validacion", "listado")

            // Recuperar y convertir de nuevo a Array
  

            
            window.location.href = '/verificacion/';
               // Redirige después de 2 segundos (2000 ms)

                                
        });
    });
});


function filterTable() {
    const searchInput = document.getElementById('searchInput').value.toLowerCase();
    const table = document.getElementById('inventoryTable');
    const rows = table.getElementsByTagName('tr');
  
    // Obtener los valores de los checkboxes seleccionados
    const filters = Array.from(checkboxes)
      .filter(checkbox => checkbox.checked)
      .map(checkbox => checkbox.value.toLowerCase());
  
    for (let i = 1; i < rows.length; i++) {
      const cells = rows[i].getElementsByTagName('td');
      const articleCode = cells[4].textContent.toLowerCase(); // Código en la columna 1
      const articleName = cells[2].textContent.toLowerCase(); // Nombre en la columna 2
        
      // Condiciones para mostrar la fila
      const matchesSearch = articleCode.includes(searchInput) || articleName.includes(searchInput);
      const matchesCheckbox = filters.length === 0 || filters.some(filter => articleCode.includes(filter));
  
      // Mostrar la fila si cumple con ambas condiciones
      if (matchesSearch && matchesCheckbox) {
        rows[i].style.display = '';
      } else {
        rows[i].style.display = 'none';
      }
    }
  }
  
  // Agregar evento 'change' a los checkboxes para que también activen el filtrado
  const checkboxes = document.querySelectorAll('.filter-checkbox');
  checkboxes.forEach(checkbox => {
    checkbox.addEventListener('change', filterTable);
  });
  
  