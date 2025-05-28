const celdas = JSON.parse(localStorage.getItem('celdas'));

validacion = localStorage.getItem('validacion')
console.log(validacion);



const inputConteo = document.getElementById('contador')



if(validacion == 'listado'){
    document.getElementById('codigo_bulto').value = celdas[0].trim()
    document.getElementById('codigo-contenedor').value = celdas[1].trim()
    document.getElementById('codigo-proveedor').value = celdas[2].trim()
    document.getElementById('descripcion-articulo').value = celdas[3].trim()

    document.getElementById('Unidades').value = celdas[5].trim()
    document.getElementById('codigo-articulo').value = celdas[4].trim()


}else if(validacion ==='Scanner'){
    document.getElementById('codigo_bulto').value = localStorage.getItem('bultocodigo')
    document.getElementById('codigo-contenedor').value = localStorage.getItem('contenedor')
    document.getElementById('codigo-proveedor').value = localStorage.getItem('provedpr')
    document.getElementById('descripcion-articulo').value = localStorage.getItem('arcticulo')
    
    document.getElementById('Unidades').value = localStorage.getItem('cantidad')
    document.getElementById('codigo-articulo').value = localStorage.getItem('codArtiCulo')
        
}
 let unidades = document.getElementById('Unidades').value
 const unidades_int = parseInt(unidades) 
 let bulto  = document.getElementById('codigo_bulto').value
 let codigoArticlo = document.getElementById('codigo-articulo').value
 let codigoProveedor = document.getElementById('codigo-proveedor').value    
 let descripcion = document.getElementById('descripcion-articulo').value
 let contenedor = document.getElementById('codigo-contenedor').value
 document.getElementById('btn-proceso').addEventListener('click',() =>{
    Swal.fire({
        icon:'question',
        title: "Realizo el conteo de la mercancia?",
        allowOutsideClick: false,
        showDenyButton: true,
        showCancelButton: true,
        confirmButtonText: "Si",
        denyButtonText: `No`,
        customClass: {
            popup: 'small-swal2'
        }
      }).then((result) => {
        /* Read more about isConfirmed, isDenied below */
        if (result.isConfirmed) {
          Swal.fire({
                    icon:"warning",
                    title: "Conteo",
                    allowOutsideClick: false,
                    input: "text",
                    inputLabel: "Ingrese la cantidad contada",
                    showCancelButton: true,
                    customClass: {
                        popup: 'small-swal'},
                    preConfirm: (value) => {
                            if (!value.trim()) {
                                Swal.showValidationMessage("Por favor, ingrese una cantidad");
                                return false;
                            }
                            return value; // Retorna el valor si es válido
                        }
                    }).then((resultado)=>{
                        if (resultado.isConfirmed){
                           
                            console.log(resultado.value);
                            let valor = parseInt(resultado.value)
                            const resta = valor - unidades_int
                            
                            if (resta == 0){
                                //BLOQUE PARA CUANDO NO EXISTA DIFERENCIA 
                                Swal.fire({
                                    title: "Éxito",
                                    text: "No hay Diferencia",
                                    icon: "success",
                                    customClass: {
                                        popup: 'small-swal2'
                                    }}).then((resul)=>{
                                        if(resul.isConfirmed){
                                            
                                            $.ajax({
                                                type: 'PUT',
                                                url: '/consulta/update',
                                                contentType: 'application/json',
                                                data: JSON.stringify({
                                                    
                                                    n_diferencia:0,
                                                    reporte: " ",
                                                    user: usuario_eti,
                                                    contador: valor,
                                                    bulto:bulto}),
                                                    success: function(response) {
                                                      
                                                    },
                                                    error: function(error) {
                                                        console.error('Error al actualizar el código:', error);
                                                       Swal.fire('Error', 'No se pudo actualizar el código.', 'error');
                                                 }
                                                });
                                                //PETICION PARA VALIDAR LA EXISTENCIA DEL ARTICULO TIO AMMMI BAJO EL CODIGO DEL ARTICULO
                                                $.ajax({
                                                    type: 'POST',
                                                    url: '/verificacion/verificarcodigo',
                                                    contentType: 'application/json',
                                                    data: JSON.stringify({codigo:codigoArticlo}),
                                                        success: function(response) {
                                            
                                                            if (response.length === 0){
                                                                Swal.fire({
                                                                    title: 'Verifiacion de codigo',
                                                                    allowOutsideClick: false,
                                                                    text: `No se encontro producto con el codigo ${codigoArticlo} sera redigirigido a creacion de codigos`,
                                                                    icon: 'info',
                                                                    confirmButtonText: 'Ok'})
                                                                    .then((result) => {
                                                                        if (result.isConfirmed) {
                                                                        window.location.href = '/code/'
                                                                        localStorage.setItem('codigoArticulo',codigoArticlo)
                                                                        localStorage.setItem('cantidad_articulo', unidades)
                                                                        localStorage.setItem('cod_provedor', codigoProveedor)
                                                                        }
                                                                      });
                                                            }else{
                                                                Swal.fire({
                                                                    title: 'Verifiacion de codigo',
                                                                    allowOutsideClick: false,
                                                                    text: `Producto encontrado bajo el codigo ${response[0]['c_CodNasa']}`,
                                                                    icon: 'info',
                                                                    confirmButtonText: 'Ok'})
                                                                    .then((result) => {
                                                                        if (result.isConfirmed) {
                                                                        localStorage.setItem('codigoTio',response[0]['c_CodNasa'])
                                                                        window.location.href = "/izebra/"
                                                                        }
                                                                      });
                                                            }
                                            
                                            
                                                            
                                                        },
                                                        error: function(error) {
                                                            console.error('Error al insertar el código:', error);
                                                            Swal.fire('Error', 'No se pudo guardar el código.', 'error');
                                                        }
                                                    });
                                              
                                        }
                                
                                        
                                    })


                            }else{
                                Swal.fire({
                                    title: "Diferencia",
                                    text: `Diferencia de ${resta}`,
                                    icon: "warning",
                                    
                                    showConfirmButton: true,
                                    confirmButtonText: "Enviar Reporte",
                                    customClass: { popup: 'small-swal2' },
                                    allowOutsideClick: false, // Evita que el usuario cierre el modal clickeando fuera
                                    allowEscapeKey: false, // Evita que el usuario lo cierre con Escape
                                }).then((resultadoInforme) => {
                                    if (resultadoInforme.isConfirmed) {
                                        // 🔹 Acción al enviar el reporte
                                        const response =  fetch('/email', {
                                            method: 'POST',
                                            headers: {
                                                'Content-Type': 'application/json',
                                            },
                                            body: JSON.stringify({
                                                differenceData: resta, // Envía la diferencia correcta
                                                numero_cont: contenedor,
                                                articulo: descripcion,
                                                cod_produc  : codigoArticlo 
                                            }),
                                        });
                    
                                        Swal.fire({
                                            title: "Enviado",
                                            text: "El informe ha sido enviado correctamente.",
                                            icon: "success",
                                            customClass: { popup: 'small-swal2' }
                                        }).then(() => {
                                            
                                            // 🔹 Después de enviar el reporte, abrir otro modal para "Procesar"
                                            Swal.fire({
                                                title: "Procesar",
                                                text: "Ahora puedes procesar la información.",
                                                icon: "info",
                                                showDenyButton: true,
                                                showConfirmButton: false,
                                                denyButtonText: "Procesar",
                                                customClass: { popup: 'small-swal2' }
                                            }).then((resultadoProcesar) => {
                                                if (resultadoProcesar.isDenied) {
                                                    // BLOQUE PARA PROCESAR HACIA VERIFICACION DE CODIGO EXISTENTE Y LUEGO CREACION DE CODIGO, DEPENDIENDO
                                                    $.ajax({
                                                        type: 'PUT',
                                                        url: '/consulta/update',
                                                        contentType: 'application/json',
                                                        data: JSON.stringify({
                                                            n_diferencia:resta,
                                                            reporte: 'Enviado',
                                                            user: usuario_eti,
                                                            contador:valor,
                                                            bulto:bulto}),
                                                            success: function(response) {
                                                              
                                                            },
                                                            error: function(error) {
                                                                console.error('Error al actualizar el código:', error);
                                                               Swal.fire('Error', 'No se pudo actualizar el código.', 'error');
                                                         }
                                                        });
                                                        //PETICION PARA VALIDAR LA EXISTENCIA DEL ARTICULO TIO AMMMI BAJO EL CODIGO DEL ARTICULO
                                                        $.ajax({
                                                            type: 'POST',
                                                            url: '/verificacion/verificarcodigo',
                                                            contentType: 'application/json',
                                                            data: JSON.stringify({codigo:codigoArticlo}),
                                                                success: function(response) {
                                                    
                                                                    if (response.length === 0){
                                                                        Swal.fire({
                                                                            title: 'Verifiacion de codigo',
                                                                            allowOutsideClick: false,
                                                                            text: `No se encontro producto con el codigo ${codigoArticlo} sera redigirigido a creacion de codigos`,
                                                                            icon: 'info',
                                                                            confirmButtonText: 'Ok'})
                                                                            .then((result) => {
                                                                                if (result.isConfirmed) {
                                                                                window.location.href = '/code/'
                                                                                localStorage.setItem('codigoArticulo',codigoArticlo)
                                                                                localStorage.setItem('cantidad_articulo', unidades)
                                                                                localStorage.setItem('cod_provedor', codigoProveedor)
                                                                                }
                                                                              });
                                                                    }else{
                                                                        Swal.fire({
                                                                            title: 'Verifiacion de codigo',
                                                                            allowOutsideClick: false,
                                                                            text: `Producto encontrado bajo el codigo ${response[0]['c_CodNasa']}`,
                                                                            icon: 'info',
                                                                            confirmButtonText: 'Ok'})
                                                                            .then((result) => {
                                                                                if (result.isConfirmed) {
                                                                                localStorage.setItem('codigoTio',response[0]['c_CodNasa'])
                                                                                window.location.href = "/izebra/"
                                                                                }
                                                                              });
                                                                    }
                                                    
                                                    
                                                                    
                                                                },
                                                                error: function(error) {
                                                                    console.error('Error al insertar el código:', error);
                                                                    Swal.fire('Error', 'No se pudo guardar el código.', 'error');
                                                                }
                                                            });
                                                      
                                                }
                                            });
                                        });
                                    }
                                });
                                
                            }
                            
                        }
                    }) 
                        
                    
        } else if (result.isDenied) {
          Swal.fire("Por favor realizar el conteo", "", "info");
        }
      });

})

    