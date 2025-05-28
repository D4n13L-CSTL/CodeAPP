document.getElementById('camara').addEventListener('click', function () {
    const qrReaderElement = document.getElementById('qr-reader');

    if (qrReaderElement.style.display === 'none') {
        // Mostrar la cámara y preparar para escanear
        qrReaderElement.style.display = 'block';

        const html5QrCode = new Html5Qrcode("qr-reader");

        html5QrCode.start(
            { facingMode: { exact: "environment" } }, // Cámara trasera
            {
                fps: 10, // Frames por segundo
                qrbox: 300, // Tamaño del cuadro de escaneo
            },
            (decodedText) => {
                // Código escaneado con éxito
                
                
                $.ajax({
                url: '/izebra/codigos', // Endpoint del backend
                type: 'POST', // Método HTTP
                contentType: 'application/json', // Tipo de datos enviados
                data: JSON.stringify({ c_Codigo: decodedText }), // Datos enviados
                success: function(response) {
                 if (response.length > 0) {
                    Swal.fire({
                        title: 'Información del Producto',
                        allowOutsideClick: false,
                        html: `
                            <div style="display: flex; justify-content: space-between;">
                                <!-- Primera sección -->
                                <div style="width: 50%;">
                                    <label for="codigo_tio">Código Tío</label>
                                    <input value="${response[0]['c_Codigo']}" type="text" name="codigo_tio" id="codigo_tio" disabled class="swal2-input">
            
                                    <label for="descripcion">Descripción</label>
                                    <input value="${response[0]['c_Descri']}" name="descripcion" type="text" id="descripcion" disabled class="swal2-input">
            
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
            
                                    <label for="comentario2">2do Comentario</label>
                                    <input type="text" id="comentario2" name="comentario" class="swal2-input">
            
                                    <label for="container">Contenedor</label>
                                    <input type="text" id="container" name="container" class="swal2-input">
            
                                    <label for="container">Responsable</label>
                                    <input type="text" id="responsable" name="responsable" class="swal2-input">
            
                                    <label for="CantidadImpresion">Cantidad Etiqueta</label>
                                    <input type="text" id="CantidadImpresion" name="CantidadImpresion" class="swal2-input">
            
                                    <button id="recuperar" class="btn btn-primary">Ultimos Datos</button>
                                    
                                    
            
                                    
                                </div>
                            </div>
                            
                        `,didOpen:() => {
                            document.getElementById('recuperar').addEventListener('click', () =>{
                                //document.getElementById('codigo_tio').value = localStorage.getItem('codigo_tio')
                                        //document.getElementById('descripcion').value = localStorage.getItem('descripcion')
                                        document.getElementById('nombre').value = localStorage.getItem('nombre')
                                        document.getElementById('cantidad').value = localStorage.getItem('cantidad')
                                        document.getElementById('CodigoProv').value = localStorage.getItem('CodigoProv')
                                        document.getElementById('comentario').value = localStorage.getItem('comentario')
                                        document.getElementById('container').value = localStorage.getItem('container')
                                        document.getElementById('CantidadImpresion').value = localStorage.getItem('CantidadImpresion')
                                        document.getElementById('responsable').value = localStorage.getItem('responsable')
                                        document.getElementById('comentario2').value = localStorage.getItem('comentario2')
                            })
                        },
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
                            comentario2:document.getElementById('comentario2').value,
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
                                localStorage.setItem('cantidad', result.value.cantidad)
                                localStorage.setItem('codigo_tio', result.value.codigotio)
                                localStorage.setItem('descripcion', result.value.description)
                                localStorage.setItem('CodigoProv', result.value.provedor)
                                localStorage.setItem('nombre', result.value.nombre)
                                localStorage.setItem('comentario', result.value.comentario)
                                localStorage.setItem('container', result.value.container)
                                localStorage.setItem('CantidadImpresion', result.value.cantidad_eti)
                                localStorage.setItem('responsable', result.value.responsable)
                                localStorage.setItem('comentario2', result.value.comentario2)
                                
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
                        }document.getElementById('recuperar').addEventListener('click', () =>{
                        })
                    })
                    } else{
                        Swal.fire({
                            icon: 'info',
                            title: 'Sin resultados',
                            text: `No se encontraron productos con el código "${decodedText}".`,
                        });
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
                html5QrCode.stop(); // Detener el escaneo
                qrReaderElement.style.display = 'none';
            },
            (errorMessage) => {
                console.log("Escaneo fallido:", errorMessage);
            }
        ).catch(err => {
            console.error("Error al iniciar la cámara:", err);
        });
    } else {
        // Ocultar la cámara si ya está activa
        qrReaderElement.style.display = 'none';
    }
});

