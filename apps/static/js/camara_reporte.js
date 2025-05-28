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
                    url: '/reportes/valores',
                    type: 'POST',
                    contentType: 'application/json',
                    data: JSON.stringify({ codigo_bulto:decodedText}),
                    success: (response) => {

                        if(response[0]['bulto'].length > 0){
                            if(response[0]['bulto'][0]['Status'] == "PENDIENTE"){
                                Swal.fire({
                                    title: '',
                                    text: 'Producto no procesado',
                                    icon: 'info',
                                    confirmButtonText: 'OK'
                                  }).then((result) => {
                                    console.log(result);  // Verifica el valor de result
                                    
                                  });
                            }else{
                                
                                localStorage.setItem("descrip_articulo", response[0]['bulto'][0]["DescripcionArticulo"])
                                localStorage.setItem("cantidad_articulo", response[0]['bulto'][0]["CantidadUnidades"])
                                localStorage.setItem("bulto_codigo", response[0]['bulto'][0]["CodBulto"])
                                localStorage.setItem("cod_ArtiCulo", response[0]['bulto'][0]["CodigoDeArticulo"])
                                localStorage.setItem("numero_contenedor", response[0]['bulto'][0]["NumeroContenedor"])
                                localStorage.setItem("codigo_provedor", response[0]['bulto'][0]["CodProveedor"])
                                localStorage.setItem("status", response[0]['bulto'][0]["Status"])
                                localStorage.setItem("restantes", response[0]['bulto'][0]["Restante"])  
                                localStorage.setItem('usuario',response[0]['bulto'][0]["Usuarios"])
                                localStorage.setItem('conteo_user',response[0]['bulto'][0]["contador"])
                                


                                localStorage.setItem("c_Codigo", response[0]['producto'][0]["c_Codigo"])
                                localStorage.setItem("c_Departamento", response[0]['producto'][0]["c_Departamento"])
                                localStorage.setItem("c_Descri", response[0]['producto'][0]["c_Descri"])
                                localStorage.setItem("c_Grupo", response[0]['producto'][0]["c_Grupo"])
                                localStorage.setItem("c_Subgrupo", response[0]['producto'][0]["c_Subgrupo"])
                                window.location.href = '/reportes/check';
                            }
                            
                        }else{
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

