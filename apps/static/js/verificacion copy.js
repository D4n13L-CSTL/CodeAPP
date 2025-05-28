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

const btn = document.getElementById('btn-proceso')
btn.addEventListener('click',() =>{
    let conteo = document.getElementById('contador').value.trim()

    const conteo_int = parseInt(conteo)
        const resta = unidades_int - conteo_int
        if  (isNaN(resta)){
                Swal.fire('Error','Verificar el conteo','error')
        }else if(resta == 0){
                Swal.fire('Exito',`No hay Diferencia`,'success')
                $.ajax({
                            type: 'PUT',
                            url: '/consulta/update',
                            contentType: 'application/json',
                            data: JSON.stringify({bulto:bulto}),
                                success: function(response) {
                            
                                    Swal.fire({
                                        title: '¡Éxito!',
                                        allowOutsideClick: false,
                                        text: 'Verificación completada correctamente. Sera validara el articulo contado',
                                        icon: 'success',
                                        confirmButtonText: 'OK'
                                    }).then((result) => {
                                        if (result.isConfirmed) {
                                            localStorage.removeItem('celdas')
                                            localStorage.setItem('codigoProveedor',codigoProveedor)
                                            Swal.fire({
                                                title: "Verificar codigo articulo existente",
                                                allowOutsideClick: false,
                                                html:`<input value="${codigoArticlo}" type="text" name="codigo_tio" id="codigo_tio" disabled class="swal2-input">`,
                                                inputLabel: "CODIGO PRODUCTO",
                                                confirmButtonText: 'Verificar'
                                            }).then((result) =>{
                                                if(result.isConfirmed){
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
                                            
                                           
                                        }
                                    });

                                    
                                },
                                error: function(error) {
                                    console.error('Error al actualizar el código:', error);
                                    Swal.fire('Error', 'No se pudo actualizar el código.', 'error');
                                }
                            });

            }else{
                 Swal.fire('Error',`Diferencia ${resta}`,'error')
            }
                


        })


