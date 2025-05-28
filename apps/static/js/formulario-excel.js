console.log(localStorage.getItem('id_mesa'));

$(document).ready(function () {
    // Evento para Departamento
    $('#departamento').on('change', function () {
        var codigoDpto = $(this).val(); // Obtener el valor del departamento seleccionado

        $.ajax({
            type: 'POST',
            url: '/code/grupos',  // Asegúrate de que esta URL sea correcta
            contentType: 'application/json',
            data: JSON.stringify({ 'codigo': codigoDpto }),  // Enviamos el código del departamento
            success: function (response) {
                $('#grupoSelect').empty().append('<option value="">Seleccione un grupo</option>'); // Limpiar los grupos anteriores
                $.each(response, function (index, item) {
                    $('#grupoSelect').append('<option value="' + item.c_CODIGO + '">' + item.C_DESCRIPCIO + '</option>');
                });
            },
            error: function (error) {
                console.error('Error al obtener los grupos:', error);
            }
        });
    });

    // Evento para Grupo
    $('#grupoSelect').on('change', function () {
        var grupo = $(this).val(); // Obtener el valor seleccionado del grupo
        var dpto = $('#departamento').val(); // Obtener el valor seleccionado del departamento

        $.ajax({
            type: 'POST',
            url: '/code/r',
            contentType: 'application/json',
            data: JSON.stringify({ 'grupo': grupo, 'dpto': dpto }),
            success: function (response) {
                // Limpiar y agregar nuevas opciones al select 'subgrupo'
                var $formIdSelect = $('#subgrupo').empty().append('<option value="">Seleccione un Subgrupo</option>');
                $.each(response, function (index, item) {
                    $formIdSelect.append('<option value="' + item.c_CODIGO + '">' + item.c_DESCRIPCIO + '</option>');
                });
            },
            error: function (error) {
                console.error('Error al obtener subgrupos:', error);
            }
        });
    });

    // Actualizar campos de texto con los valores seleccionados
    $('#departamento').change(function () {
        var selectedDepartamento = $(this).val();
        $('#codigo-departamento').val(selectedDepartamento);
        $('#descripcion-departamento').val($('#departamento option:selected').text());
    });

    $('#grupoSelect').change(function () {
        var selectedGrupo = $(this).val();
        $('#codigo-grupo').val(selectedGrupo);
        $('#descripcion-grupo').val($('#grupoSelect option:selected').text());
    });
});



$('.btn-consultar').on('click', function () {
    var departamento = $('#departamento').val();
    var grupo = $('#grupoSelect').val();
    var subgrupo = $('#subgrupo').val();

    if (!departamento || !grupo || !subgrupo) {
        alert("Por favor, seleccione un Departamento, Grupo y Subgrupo antes de consultar.");
        return;
    }

    $.ajax({
        type: 'POST',
        url: '/code/ucodigo', // Endpoint correcto
        contentType: 'application/json',
        data: JSON.stringify({ 'c_departamento': departamento, 'c_grupo': grupo, 'subgrupo': subgrupo }),
        success: function (response) {
            console.log("Respuesta recibida:", response);

            let codigo_nuevo = response[0].nuevo_codigo
            document.getElementById('codigoTio').value = codigo_nuevo


        },
        error: function (xhr, status, error) {
            console.error('Error en la consulta:', {
                status: xhr.status,
                statusText: xhr.statusText,
                responseText: xhr.responseText
            });

            alert("Error en la consulta: " + xhr.status + " - " + xhr.statusText);
        }
    });
});



$('#exportExcelBtn').on('click', function () {
    var $btn = $(this); // Guardar referencia al botón
    $btn.prop('disabled', true); // Deshabilitar el botón para evitar múltiples clics

    // Captura los datos del formulario
    var formData = {
        
        "Barra": $('#barra').val(),
        "Codigo_tio": $('#codigoTio').val(),
        "Departamento": $('#departamento').val(),
        "Empaque": $('#empaque').val(),
        "Grupo": $('#grupoSelect').val(),
        "Subgrupo": $('#subgrupo').val(),
        "Marca": $('#marca').val(),
        "Producto": $('#producto').val(),
        "Proveedor": $('#proveedor').val(),
        "Modelo": $('#modelo').val(),
        "Mesa_Trabajo" : localStorage.getItem('id_mesa')
        
    };

    console.log("Datos enviados:", formData);

    // Obtener el nombre del archivo desde localStorage


    // Enviar los datos al servidor
    $.ajax({
        type: 'POST',
        url: '/form/insert',
        contentType: 'application/json',
        data: JSON.stringify(formData),
        success: function (response) {
            console.log("Respuesta del servidor:", response);
            location.reload()
        },  
        error: function (xhr) {
            console.error("Error al enviar los datos:", xhr.responseText);
            // Mostrar SweetAlert2 si hubo un error en la solicitud
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: `Hubo un error al guardar los datos en el archivo. Por favor verifique el codigo TIO, inténtelo de nuevo.`,
                confirmButtonText: 'Aceptar'
            });
        },
        complete: function () {
            $btn.prop('disabled', false); // Habilitar el botón nuevamente
        }
    });
});

// Función para agregar una nueva fila a la tabla de productos registrados
function agregarFilaATabla(formData) {
    let tbody = $("#productsTable tbody");

    let fila = `
        <tr>
            <td>${formData.Barra}</td>
            <td>${formData.Producto}</td>
            <td>${formData.Empaque}</td>
            <td>${formData.Costo}</td>
            <td>${formData.Departamento}</td>
            <td>${formData.Grupo}</td>
            <td>${formData.Subgrupo}</td>
            <td>${formData.Utilidad}</td>
            <td>${formData.Iva}</td>
            <td>${formData.Proveedor}</td>
            <td>${formData.Tipo}</td>
            <td>${formData.Modelo}</td>
            <td>${formData.Moneda}</td>
            <td>${formData.Codigo_tio}</td>
            <td>${formData.Marca}</td>
        </tr>
    `;

    tbody.append(fila);
}

// Función para limpiar el formulario
function limpiarFormulario() {
    // Limpiar todos los inputs
    $('#productForm input[type="text"]').val(''); // Limpiar campos de texto
    $('#productForm input[type="number"]').val(''); // Limpiar campos numéricos
    $('#productForm select').prop('selectedIndex', 0); // Restablecer selects al primer option
    $('#codigoTio').val(''); // Limpiar el campo de código TIO (si está deshabilitado)
}


//insertar datos en la tabla


document.addEventListener("DOMContentLoaded", function () {
    const table = document.getElementById("productsTable");
    const tbody = table.querySelector("tbody");
    const rows = Array.from(tbody.querySelectorAll("tr"));
    const itemsPerPage = 5; // Número de elementos por página
    let currentPage = 1;
    let totalPages = Math.ceil(rows.length / itemsPerPage);

    function renderTable(page) {
        tbody.innerHTML = ""; // Limpiar tabla antes de mostrar nueva página
        let start = (page - 1) * itemsPerPage;
        let end = start + itemsPerPage;
        let paginatedRows = rows.slice(start, end);
        
        paginatedRows.forEach(row => tbody.appendChild(row));

        document.querySelector(".pagination .active").classList.remove("active");
        document.querySelector(`.pagination button[data-page="${page}"]`).classList.add("active");
    }

    function createPaginationButtons() {
        const paginationContainer = document.querySelector(".pagination");
        paginationContainer.innerHTML = ""; // Limpiar botones previos

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
            if (i === 1) pageBtn.classList.add("active");
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

    function goToPage(page) {
        if (page < 1 || page > totalPages) return;
        currentPage = page;
        renderTable(currentPage);
    }

    createPaginationButtons();
    renderTable(currentPage);
});

//funcion para mostrar codigo de departamento, grupo y subgrupo seleccionado

document.addEventListener("DOMContentLoaded", function () {
    const selects = [
        { id: "departamento", display: "selectedDepartamento" },
        { id: "grupoSelect", display: "selectedGrupo" },
        { id: "subgrupo", display: "selectedSubgrupo" }
    ];

    function updateFilters() {
        selects.forEach(({ id, display }) => {
            const select = document.getElementById(id);
            const displayDiv = document.getElementById(display);

            if (select && displayDiv) {
                if (select.value) {
                    displayDiv.textContent = `📌 ${select.value} - ${select.options[select.selectedIndex].text}`;
                    displayDiv.classList.add("badge", "bg-success", "mt-2", "p-2");
                } else {
                    displayDiv.textContent = "";
                    displayDiv.classList.remove("badge", "bg-success", "mt-2", "p-2");
                }
            }
        });
    }

    selects.forEach(({ id }) => {
        document.getElementById(id).addEventListener("change", updateFilters);
    });
});

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
        url: '/form/consultarworktable',
        contentType: 'application/json',
        data: JSON.stringify({id : localStorage.getItem('id_mesa')}),
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
                url: '/form/updateworktable',
                contentType: 'application/json',
                data: JSON.stringify({id : localStorage.getItem('id_mesa')}),
                success: function (response) {
                    console.log(response);
                    window.location.href = '/form/mesas'
                   
                },
                error: function (xhr) {
                    console.error("Error al enviar los datos:", xhr.responseText);
                    // Aquí puedes mostrar algún mensaje de error si es necesario
                },
            });
            
        }
      })


    
})



document.addEventListener("DOMContentLoaded", function() {
    
    document.getElementById('update').style.display = 'none';
    const tablaBody = document.getElementById("tabla-body");
    
    tablaBody.addEventListener("click", function(event) {
        document.getElementById('exportExcelBtn').style.display = 'none';
        document.getElementById('update').style.display = 'block';
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
        
        localStorage.setItem('codigo_p',codigo_tio )

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


/**HACER PETICION PARA ACTUALIZAR EL REGISTRO */
document.getElementById('update').addEventListener('click', () => {


    var formData = {
        
        "Barra": $('#barra').val(),
        "Codigo_tio": $('#codigoTio').val(),
        "Departamento": $('#departamento').val(),
        "Empaque": $('#empaque').val(),
        "Grupo": $('#grupoSelect').val(),
        "Subgrupo": $('#subgrupo').val(),
        "Marca": $('#marca').val(),
        "Producto": $('#producto').val(),
        "Proveedor": $('#proveedor').val(),
        "Modelo": $('#modelo').val(),
        "Codigo_tio_p" : localStorage.getItem('codigo_p'),
        
    };
    $.ajax({
        type: 'PUT',
        url: '/form/updatevaloregistro',
        contentType: 'application/json',
        data: JSON.stringify(formData),
        success: function (response) {
            console.log("Respuesta del servidor:", response);
            location.reload()
        },  
        error: function (xhr) {
            console.error("Error al enviar los datos:", xhr.responseText);
            // Mostrar SweetAlert2 si hubo un error en la solicitud
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: `Hubo un error al guardar los datos en el archivo. Por favor verifique el codigo TIO, inténtelo de nuevo.`,
                confirmButtonText: 'Aceptar'
            });
        },
        
    });


})



document.getElementById("uploadForm").addEventListener("submit", async function(event) {
    event.preventDefault();

    let formData = new FormData();
    let fileInput = document.getElementById("file");
    let mesaTrabajo = localStorage.getItem('id_mesa')
 

    if (fileInput.files.length === 0) {
        console.error("No se ha seleccionado ningún archivo.");
        return;
    }

    formData.append("file", fileInput.files[0]);  // 📌 Agrega el archivo
    formData.append("Mesa_Trabajo", mesaTrabajo);  // 📌 Agrega el valor del campo extra

    try {
        let response = await fetch("/form/upload", {
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
