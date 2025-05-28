document.addEventListener("DOMContentLoaded", function() {
    const tablaBody = document.getElementById("tabla-body");

    tablaBody.addEventListener("click", function(event) {
        const fila = event.target.closest("tr"); // Captura la fila en la que se hizo clic
        if (!fila) return;

        const celdas = fila.querySelectorAll("td");
        if (celdas.length < 15) return;

        const barra = celdas[0].textContent.trim();
        const producto = celdas[1].textContent.trim();
        const empaque = celdas[2].textContent.trim();
        const costo = celdas[3].textContent.trim();
        const departamento = celdas[4].textContent.trim();
        const grupo = celdas[5].textContent.trim();
        const subgrupo = celdas[6].textContent.trim();
        const utilidad = celdas[7].textContent.trim();
        const iva = celdas[8].textContent.trim();
        const proveedor = celdas[9].textContent.trim();
        const tipo = celdas[10].textContent.trim();
        const modelo = celdas[11].textContent.trim();
        const moneda = celdas[12].textContent.trim();
        const codigo_tio = celdas[13].textContent.trim();
        const marca = celdas[14].textContent.trim();

        let celdasArray = Array.from(celdas).map(celda => celda.textContent || celda.value || celda.innerText);
        localStorage.setItem('celdas', JSON.stringify(celdasArray));

        document.getElementById('barra').value = barra
        document.getElementById('codigoTio').value = codigo_tio
        document.getElementById('producto').value = producto
        document.getElementById('marca').value = marca
        document.getElementById('modelo').value = modelo
        document.getElementById('empaque').value = empaque
        document.getElementById('proveedor').value = proveedor
        console.log(localStorage.getItem('celdas'));
        
        document.getElementById('seccion').scrollIntoView({ behavior: "smooth" });
    });
});

/*
document.addEventListener("DOMContentLoaded", function() {
    // Seleccionar todas las filas de la tabla
    const filas = document.querySelectorAll("#tabla-body");

    filas.forEach(fila => {
        fila.addEventListener("click", function() {
            const celdas = fila.querySelectorAll("td");
            
            const barra = celdas[0].textContent.trim()
            const producto = celdas[1].textContent.trim()
            const empaque = celdas[2].textContent.trim()
            const costo = celdas[3].textContent.trim()
            const departamento = celdas[4].textContent.trim()
            const grupo = celdas[5].textContent.trim()
            const subgrupo = celdas[6].textContent.trim()
            const utilidad = celdas[7].textContent.trim()
            const iva = celdas[8].textContent.trim()
            const proveedor = celdas[9].textContent.trim()
            const tipo = celdas[10].textContent.trim()
            const modelo = celdas[11].textContent.trim()
            const moneda  = celdas[12].textContent.trim()
            const codigo_tio = celdas[13].textContent.trim()
            const marca = celdas[14].textContent.trim()
            
            
            
            
            // Convertir NodeList a Array y luego a JSON
            let celdasArray = Array.from(celdas).map(celda => celda.textContent || celda.value || celda.innerText);
            localStorage.setItem('celdas', JSON.stringify(celdasArray));

            document.getElementById('barra').value = barra
            document.getElementById('codigoTio').value = codigo_tio
            document.getElementById('producto').value = producto
            document.getElementById('marca').value = marca
            document.getElementById('modelo').value = modelo
            document.getElementById('empaque').value = empaque
            document.getElementById('proveedor').value = proveedor
            console.log(localStorage.getItem('celdas'));
            
            document.getElementById('seccion').scrollIntoView({ behavior: "smooth" });
            // Recuperar y convertir de nuevo a Array
  

            
  
               // Redirige después de 2 segundos (2000 ms)

                                
        });
    });
});*/





    document.getElementById('btn-update').addEventListener('click' , () =>{
        const costo = document.getElementById('costo').value
        const iva = document.getElementById('iva').value
        const utilidad = document.getElementById('utilidad').value
        const codigo = document.getElementById('codigoTio').value

        $.ajax({
            type: 'PUT',
            url: '/costo/actualizador',
            contentType: 'application/json',
            data: JSON.stringify({costo : costo,
                utilida:utilidad,
                iva:iva,
                codigo : codigo
            }),
            success: function (response) {
                console.log("Respuesta del servidor:", response);
                document.getElementById('costo').value = ""
                document.getElementById('iva').value = ""
                document.getElementById('utilidad').value = ""
                location.reload()
                
            },
            error: function (xhr) {
                console.error("Error al enviar los datos:", xhr.responseText);
                // Mostrar SweetAlert2 si hubo un error en la solicitud
              
            },
            
        });

    } )



    document.getElementById('descargatxt').addEventListener('click',() =>{
            window.location.href = "descarga"
            $.ajax({
            type: 'PUT',
            url: '/costo/actualizardescarga',
            contentType: 'application/json',
            data: JSON.stringify({
            }),
            success: function (response) {
                console.log(response);
                Swal.fire("TXT Descargado correctamente");
                setTimeout(function() {
                    location.reload();
                }, 1000); // 1000 ms = 1 segundo
        
                
                
            },
            error: function (xhr) {
                console.error("Error al enviar los datos:", xhr.responseText);
                // Mostrar SweetAlert2 si hubo un error en la solicitud
              
            },
            
        });


        
    })
    document.getElementById('inicio').addEventListener('click', () =>{
        document.getElementById('tabla').scrollIntoView({ behavior: "smooth" });
    
    })







    document.addEventListener("DOMContentLoaded", function () {
        const itemsPerPage = 5; // Número de elementos por página
        let currentPage = 1;
        let rows = []; // Aquí almacenamos las filas de la tabla
    
        // Función para renderizar la tabla
        function renderTable(page) {
            const tableBody = document.getElementById('tabla-body');
            tableBody.innerHTML = ''; // Limpiar antes de agregar nuevos datos
    
            // Calcular el inicio y fin de las filas que se deben mostrar
            let start = (page - 1) * itemsPerPage;
            let end = start + itemsPerPage;
            let paginatedRows = rows.slice(start, end);
    
            // Insertar las filas paginadas
            paginatedRows.forEach(row => {
                const tr = document.createElement('tr');
    
                // Insertar solo las primeras 15 columnas (ignorando las 4 últimas)
                for (let i = 0; i < 16; i++) {
                    const td = document.createElement('td');
                    td.textContent = row[i] !== null ? row[i] : ''; // Manejar valores nulos
                    tr.appendChild(td);
                }
    
                tableBody.appendChild(tr);
            });
    
            // Actualizar la paginación
            updatePagination();
        }
    
        // Función para crear los botones de paginación
        function updatePagination() {
            const paginationContainer = document.querySelector(".pagination");
            paginationContainer.innerHTML = ""; // Limpiar los botones previos
    
            let totalPages = Math.ceil(rows.length / itemsPerPage);
    
            // Crear botones de paginación
            let firstBtn = document.createElement("button");
            firstBtn.innerHTML = '<i class="fas fa-angle-double-left"></i>';
            firstBtn.addEventListener("click", () => goToPage(1));
            paginationContainer.appendChild(firstBtn);
    
            let prevBtn = document.createElement("button");
            prevBtn.innerHTML = '<i class="fas fa-angle-left"></i>';
            prevBtn.addEventListener("click", () => goToPage(currentPage - 1));
            paginationContainer.appendChild(prevBtn);
    
            for (let i = 1; i <= totalPages; i++) {
                let pageBtn = document.createElement("button");
                pageBtn.textContent = i;
                pageBtn.dataset.page = i;
                if (i === currentPage) pageBtn.classList.add("active");
                pageBtn.addEventListener("click", () => goToPage(i));
                paginationContainer.appendChild(pageBtn);
            }
    
            let nextBtn = document.createElement("button");
            nextBtn.innerHTML = '<i class="fas fa-angle-right"></i>';
            nextBtn.addEventListener("click", () => goToPage(currentPage + 1));
            paginationContainer.appendChild(nextBtn);
    
            let lastBtn = document.createElement("button");
            lastBtn.innerHTML = '<i class="fas fa-angle-double-right"></i>';
            lastBtn.addEventListener("click", () => goToPage(totalPages));
            paginationContainer.appendChild(lastBtn);
        }
    
        // Función para ir a una página específica
        function goToPage(page) {
            if (page < 1 || page > Math.ceil(rows.length / itemsPerPage)) return;
            currentPage = page;
            renderTable(currentPage);
        }
    
        local = localStorage.getItem('selectedValue')
        // Realizar la solicitud Ajax para obtener los datos
        $.ajax({
            type: 'POST',
            url: '/costo/consulta',
            contentType: 'application/json',
            data: JSON.stringify({id: local}),
            success: function (response) {
                console.log(response);
    
                // Limpiar las filas anteriores y cargar las filas nuevas
                rows = [];
                response.forEach(row => {
                    rows.push(row); // Agregar fila al array de filas
                });
    
                // Renderizar la primera página de la tabla
                renderTable(currentPage);
            },
            error: function (xhr) {
                console.error("Error al enviar los datos:", xhr.responseText);
                // Aquí puedes mostrar algún mensaje de error si es necesario
            },
        });
    });
    

    document.getElementById('cerra-container').addEventListener('click', () => {



        Swal.fire({
            icon:'question',
            title: "Cerrar Contenedor?",
            allowOutsideClick: false,
            showDenyButton: true,
            confirmButtonText: "Si",
            denyButtonText: `No`,
            customClass: {
                popup: 'small-swal2'
            }
          }).then((result) => {
            if (result.isConfirmed) {
                $.ajax({
                    type: 'PUT',
                    url: '/costo/updateworktable',
                    contentType: 'application/json',
                    data: JSON.stringify({id : localStorage.getItem('selectedValue')}),
                    success: function (response) {
                        console.log(response);
                        window.location.href = '/costo/opciones'
                       
                    },
                    error: function (xhr) {
                        console.error("Error al enviar los datos:", xhr.responseText);
                        // Aquí puedes mostrar algún mensaje de error si es necesario
                    },
                });
            }

            

          })


    })


    
document.getElementById("uploadForm").addEventListener("submit", async function(event) {
    event.preventDefault();

    let formData = new FormData();
    let fileInput = document.getElementById("file");
 
 

    if (fileInput.files.length === 0) {
        console.error("No se ha seleccionado ningún archivo.");
        return;
    }

    formData.append("file", fileInput.files[0]);  // 📌 Agrega el archivo

    try {
        let response = await fetch("/costo/updateload", {
            method: "POST",
            body: formData  // ✅ Se envía como multipart/form-data
        });

        let result = await response.json();
        console.log("Respuesta del servidor:", result);
        Swal.fire("Datos subidos correctamente");
        setTimeout(function() {
            location.reload();
        }, 1000); // 1000 ms = 1 segundo
    } catch (error) {
        console.error("Error al enviar los datos:", error);
    }
});


document.getElementById('cargagain').addEventListener('click' , () =>{

    $.ajax({
        type: 'PUT',
        url: '/costo/carganew',
        contentType: 'application/json',
        data: JSON.stringify({mesa:localStorage.getItem('selectedValue')}),
        success: function (response) {
            Swal.fire("Datos cargados correctamente");
            setTimeout(function() {
                location.reload();
            }, 1000); // 1000 ms = 1 segundo
        },
        error: function (xhr) {
            console.error("Error al enviar los datos:", xhr.responseText);
            // Mostrar SweetAlert2 si hubo un error en la solicitud
          
        },
        
    });

} )

document.getElementById('datos_again').addEventListener('click' , () =>{

    $.ajax({
        type: 'PUT',
        url: '/costo/datosagain',
        contentType: 'application/json',
        data: JSON.stringify({mesa:localStorage.getItem('selectedValue')}),
        success: function (response) {
            Swal.fire("Datos cargados correctamente");
            setTimeout(function() {
                location.reload();
            }, 1000); // 1000 ms = 1 segundo
            document.getElementById('tabla').scrollIntoView({ behavior: "smooth" })
        },
        error: function (xhr) {
            console.error("Error al enviar los datos:", xhr.responseText);
            // Mostrar SweetAlert2 si hubo un error en la solicitud
          
        },
        
    });

} )