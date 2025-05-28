
$(document).ready(function() {
        // Evento al hacer clic en el botón "Buscar"
        $('#buscar-btn').on('click', function() {
            // Obtener el código desde el campo de entrada
            const codigo = $('#codigo-input').val().toUpperCase();

            // Validar que el código no esté vacío
            if (!codigo) {
                Swal.fire({
                icon: 'warning',
                title: 'Código vacío',
                text: 'Por favor, ingresa un código antes de buscar.',
            });
                return;
            }

            // Petición AJAX
            $.ajax({
                url: '/ctrl_etiqueta/buscar', // Endpoint del backend
                type: 'POST', // Método HTTP
                contentType: 'application/json', // Tipo de datos enviados
                data: JSON.stringify({ nombre: codigo,  codigo:codigo}), // Datos enviados
                success: function(response) {

                    // Limpiar la tabla
                    $('#tabla-resultados tbody').empty();

                    // Verificar si hay datos
                    if (response.length > 0) {
                        response.forEach(item => {
                            $('#tabla-resultados tbody').append(`
                                <tr class="fila-producto">
                                    <td>${item.CODIGO}</td>
                                    <td>${item.PROVEEDOR}</td>
                                    <td>${item.CONTADOR}</td>
                                    <td>${item.CANTIDAD_ETI}</td>
                                    <td>${item.CANTIDAD_UNIB}</td>
                                    <td>${item.ETIQUETADO_POR}</td>
                                    <td>${item.container_nombre}</td>
                                    
                                </tr>
                            `);
                        });
                    }  else {
                    // Mostrar alerta si no hay productos
                    Swal.fire({
                        icon: 'info',
                        title: 'Sin resultados',
                        text: `No se encontraron productos con el código "${codigo}".`,
                    });

                    // Añadir fila en la tabla indicando que no hay datos
                    $('#tabla-resultados tbody').append(`
                        <tr>
                            <td colspan="7" class="text-center">No se encontraron resultados</td>
                        </tr>
                    `);
                }
            },
            error: function (error) {
                // Manejar errores
                console.error(error);
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Ocurrió un error al realizar la consulta. Intenta nuevamente.',
                });
            }
        });
    });
});

document.getElementById('dowload_Excel').addEventListener('click', () => {
    mostrarModalFechas();
});

const mostrarModalFechas = () => {
    Swal.fire({
        title: "Selecciona un rango de fechas",
        html: `
    <div class="fecha-container">
      <div>
        <label for="fechaInicio">Fecha de inicio:</label>
        <input type="date" id="fechaInicio" class="swal2-input">
      </div>
      <div>
        <label for="fechaFin">Fecha de fin:</label>
        <input type="date" id="fechaFin" class="swal2-input">
      </div>
    </div>
  `,  customClass: {
    popup: "custom-swal-popup"
  },
        showCancelButton: true,
        confirmButtonText: "Confirmar",
        cancelButtonText: "Cancelar",
        
        preConfirm: () => {
            const fechaInicio = document.getElementById("fechaInicio").value;
            const fechaFin = document.getElementById("fechaFin").value;

            if (!fechaInicio || !fechaFin) {
                Swal.showValidationMessage("Debes seleccionar ambas fechas");
                return false;
            }
            if (fechaInicio > fechaFin) {
                Swal.showValidationMessage("La fecha de inicio no puede ser mayor a la fecha de fin");
                return false;
            }

            return { fechaInicio, fechaFin };
        },
    }).then((result) => {
        if (result.isConfirmed) {
            console.log("Fechas seleccionadas:", result.value);
            Swal.fire("Fechas guardadas", `Inicio: ${result.value.fechaInicio} <br> Fin: ${result.value.fechaFin}`, "success");

            $.ajax({
                url: '/ctrl_etiqueta/download', 
                type: 'POST',
                contentType: 'application/json',
                dataType: 'binary',  // <-- ⚠️ Esto es incorrecto en jQuery
                xhrFields: {
                    responseType: 'blob'  // ⚡ Esto es lo correcto para manejar archivos
                },
                data: JSON.stringify({
                    fecha_init: result.value.fechaInicio,
                    fecha_end: result.value.fechaFin
                }),
                success: function(response) {
                    const url = window.URL.createObjectURL(response);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = "mi_archivo.xlsx";
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);
                },
                error: function(xhr, status, error) {
                    console.error("Error al descargar el archivo:", status, error);
                }
            });
            
        }
    });
};


/*
$(document).ready(function () {
    // Evento para capturar clic en las filas de la tabla
    $('#tabla-resultados tbody').on('click', '.fila-producto', function () {
        // Obtener los datos de la fila
        const codigo = $(this).data('codigo');
        const descripcion = $(this).data('descripcion');

        // Mostrar modal de SweetAlert con los datos
        Swal.fire({
            title: 'Información del Producto',
            allowOutsideClick: false,
            html: `
                <div style="display: flex; justify-content: space-between;">
                    <!-- Primera sección -->
                    <div style="width: 50%;">
                        <label for="codigo_tio">Código Tío</label>
                        <input value="${codigo}" type="text" name="codigo_tio" id="codigo_tio" disabled class="swal2-input">

                        <label for="descripcion">Descripción</label>
                        <input value="${descripcion}" name="descripcion" type="text" id="descripcion" disabled class="swal2-input">

                        <label for="nombre">Contado por</label>
                        <input type="text" id="nombre" name="nombre" class="swal2-input">

                        <label for="cantidad">Cantidad Unidades</label>
                        <input type="text" id="cantidad" name="cantidad" class="swal2-input">

                        <label for="CodigoProv">Código Proveedor</label>
                        <input type="text" id="CodigoProv" name="CodigoProv" class="swal2-input">


                    </div>

                    <!-- Segunda sección -->
                    <div style="width: 50%;">



                        <label for="comentario">Comentario</label>
                        <input type="text" id="comentario" name="comentario" class="swal2-input">

                        <label for="container">Contenedor</label>
                        <input type="text" id="container" name="container" class="swal2-input">

                        <label for="container">Responsable</label>
                        <input type="text" id="responsable" name="responsable" class="swal2-input">

                        <label for="CantidadImpresion">Cantidad Etiqueta</label>
                        <input type="text" id="CantidadImpresion" name="CantidadImpresion" class="swal2-input">


                        
                        

                        
                    </div>
                </div>
                
            `,
            showCancelButton: true,
            confirmButtonText: 'Enviar',
            preConfirm: () => {
                // Capturar los valores del formulario
                const datosFormulario = {
                cantidad: document.getElementById('cantidad').value,
                codigotio: document.getElementById('codigo_tio').value,
                description: document.getElementById('descripcion').value,
                provedor: document.getElementById('CodigoProv').value,
                nombre: document.getElementById('nombre').value,
                comentario:document.getElementById('comentario').value,
                container:document.getElementById('container').value,
                cantidad_eti: document.getElementById('CantidadImpresion').value,
                responsable : document.getElementById('responsable').value
                    };

                // Validar los campos
                if (!nombre || !cantidad || !CodigoProv) {
                    Swal.showValidationMessage('Por favor, complete todos los campos');
                    return false;
                }

                // Retornar los valores para el envío
                return  datosFormulario ;
            },
            cancelButtonText: 'Cancelar',
        }).then((result) => {
            if (result.isConfirmed) {
                // Enviar datos al backend usando fetch
                fetch('/izebra/impresion', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(result.value),
                })
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Error al enviar los datos');
                    }
                    return response.json();
                })
                .then(data => {
                    Swal.fire('¡Éxito!', 'Los datos fueron enviados correctamente', 'success');
                    localStorage.removeItem('codigoTio')
                    
                })
                .catch(error => {
                    Swal.fire('Error', 'Hubo un problema al enviar los datos', 'error');
                });
                fetch('/ctrl_etiqueta', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(result.value),
                })
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Error al enviar los datos');
                    }
                    return response.json();
                })
                .then(data => {
                    Swal.fire('¡Éxito!', 'Los datos fueron enviados correctamente', 'success');
                    localStorage.removeItem('codigoTio')
                    
                })
                .catch(error => {
                    Swal.fire('Error', 'Hubo un problema al enviar los datos', 'error');
                });
            }
        })
    });
});*/