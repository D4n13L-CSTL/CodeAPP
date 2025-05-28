document.getElementById('camara').addEventListener('click', function () {
    const qrReaderElement = document.getElementById('qr-reader');
    const inputField = document.getElementById('scanned-code');

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
                    url: '/consulta/vericacionxcodigo',
                    type: 'POST',
                    contentType: 'application/json',
                    data: JSON.stringify({ codigo_bulto:decodedText}),
                    success: (response) => {
                        if(response.length > 0){
                            if(response[0]["Status"] == 'PROCESADO'){
                                Swal.fire({
                                    title: '',
                                    text: 'Producto ya procesado',
                                    icon: 'info',
                                    confirmButtonText: 'OK'
                                  }).then((result) => {
                                    console.log(result);  // Verifica el valor de result
                                    
                                  });
                                
                            }else{
                                localStorage.setItem("validacion", "Scanner")
                                localStorage.setItem("arcticulo", response[0]["DescripcionArticulo"])
                                localStorage.setItem("cantidad", response[0]["CantidadUnidades"])
                                localStorage.setItem("bultocodigo", response[0]["CodBulto"])
                                localStorage.setItem("codArtiCulo", response[0]["CodigoDeArticulo"])
                                localStorage.setItem("contenedor", response[0]["NumeroContenedor"])
                                localStorage.setItem("provedpr", response[0]["CodProveedor"])
                                window.location.href = '/verificacion/';
                            }
                            
                        
                        
                        }
                        
                        else{
                            Swal.fire({
                                title: '',
                                text: 'No se encontró producto',
                                icon: 'info',
                                confirmButtonText: 'OK'
                              }).then((result) => {
                                console.log(result);  // Verifica el valor de result
                                
                              });
                        }
                        
                    }
                })
                inputField.value = decodedText;
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

