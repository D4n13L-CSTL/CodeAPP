$(document).ready(function() {
    $('#departamentoSelect').on('change', function() {
        var codigoDpto = $(this).val(); // Obtener el valor seleccionado del departamento

        $.ajax({
            type: 'POST',
            url: '/code/grupos',
            contentType: 'application/json',
            data: JSON.stringify({ 'codigo': codigoDpto }),
            success: function(response) {
                $('#grupoSelect').empty().append('<option value="">Seleccione un grupo</option>');
                $.each(response, function(index, item) {
                    $('#grupoSelect').append('<option value="' + item.c_CODIGO + '">' + item.C_DESCRIPCIO + '</option>');
                });
            },
            error: function(error) {
                console.error('Error:', error);
            }
        });
    });

    $('#grupoSelect').on('change', function() {
        var grupo = $(this).val(); // Obtener el valor seleccionado del grupo
        var dpto = $('#departamentoSelect').val(); // Obtener el valor seleccionado del departamento

        $.ajax({
            type: 'POST',
            url: '/code/r',
            contentType: 'application/json',
            data: JSON.stringify({ 'grupo': grupo, 'dpto': dpto }),
            success: function(response) {
                // Vaciar y agregar nuevas opciones al select 'form_id'
                var $formIdSelect = $('#form_id').empty().append('<option value="">Seleccione un Subgrupo</option>');
                $.each(response, function(index, item) {
                    $formIdSelect.append('<option value="' + item.c_CODIGO + '">' + item.c_DESCRIPCIO + '</option>');
                });

                // Mostrar en consola la descripción de cada item recibido
                
            },
            error: function(error) {
                console.error('Error:', error);
            }
        });
    });
});
$(document).ready(function() {
$('#departamentoSelect').change(function() {
    var selectedDepartamento = $(this).val();
    $('#codigo-departamento').val(selectedDepartamento);
    $('#descripcion-departamento').val($('#departamentoSelect option:selected').text());
});

$('#grupoSelect').change(function() {
    var selectedGrupo = $(this).val();
    $('#codigo-grupo').val(selectedGrupo);
    $('#descripcion-grupo').val($('#grupoSelect option:selected').text());
});

$('#form_id').change(function() {
    var selectedSubgrupo = $(this).val();
    $('#codigo-subgrupo').val(selectedSubgrupo);
    $('#descripcion-subgrupo').val($('#form_id option:selected').text());
});
});


document.getElementById('showModal').addEventListener('click',function(){
let c_departamento_input = document.getElementById('codigo-departamento').value
let c_grupo_input = document.getElementById('codigo-grupo').value
let c_subgrupo_input = document.getElementById('codigo-subgrupo').value

$.ajax({
            type: 'POST',
            url: '/code/ucodigo',
            contentType: 'application/json',
            data: JSON.stringify({ 'c_departamento': c_departamento_input, 'c_grupo': c_grupo_input,'subgrupo': c_subgrupo_input}),
            success: function(response) {
                // Vaciar y agregar nuevas opciones al select 'form_id'
           
                let codigo_nuevo = response[0].nuevo_codigo
                document.getElementById('codigo_tio').value = codigo_nuevo

                document.getElementById('codigo_alterno2').value = localStorage.getItem('codigoArticulo')
                // Mostrar en consola la descripción de cada item recibido
                
            },
            error: function(error) {
                console.error('Error:', error);
            }
        });
        const modalBase = Swal.mixin({
            customClass: {
                popup: 'swal2-custom-modal', // Clase personalizada (opcional)
            },
            allowOutsideClick: false, // Evita que se cierren al hacer clic fuera del modal
            backdrop: true, // Mostrar el fondo sombreado
        });
        modalBase.fire({
            title: 'Formulario de Registro'  ,
            showCancelButton: true,
            html: `
                <div style="display: flex; justify-content: space-between;">
                    <!-- Primera sección -->
                    <div style="width: 50%;">
                        <label for="codigo_tio">Código Tío</label>
                        <input type="text" id="codigo_tio" disabled class="swal2-input" placeholder="Código Tío" required>

                        <label for="descripcion">Descripción</label>
                        <input type="text" id="descripcion" class="swal2-input" placeholder="Descripción" required>

                        <label for="modelo">Modelo</label>
                        <input type="text" id="modelo" class="swal2-input" placeholder="Modelo" required>

                        <label for="modelo">Marca Descriptiva</label>
                        <input type="text" id="marca" class="swal2-input" placeholder="Modelo" required>

                        <label for="descripcion_corta">Descripción Corta</label>
                        <input type="text" id="descripcion_corta" class="swal2-input" placeholder="Descripción Corta" required>


                    </div>

                    <!-- Segunda sección -->
                    <div style="width: 50%;">



                        <label for="provedorcod">Proveedor</label><button class="btn btn-primary" id="btn-modal-provedores" style="margin-left: 25px;">Verificar proveedor</button>
                        <input type="text" id="provedorcod" class="swal2-input" placeholder="Descripción" required>

     
                        <label for="codigo_alterno2">Código Alterno</label>
                        <input  type="text" id="codigo_alterno2" class="swal2-input" placeholder="Código Alterno" required>


                        
                        

                        
                    </div>
                </div>
                
            `,
            didOpen: () => {
                    // Obtener el checkbox y el input
                    const checkbox = document.getElementById('enable_codigo_alterno');
                    const inputCodigoAlterno = document.getElementById('codigo_alterno2');
                    const inputDescricionAlterno = document.getElementById('descripcionAlterana')

                    document.getElementById('btn-modal-provedores').addEventListener('click', ()=>{
                        
                       
                        let valor_provedor = document.getElementById('provedorcod').value
                        localStorage.setItem('provedor', valor_provedor)
                        console.log(valor_provedor);
                        $.ajax({
                            type: 'POST',
                            url: '/code/provedorxprt',
                            contentType: 'application/json',
                            data: JSON.stringify({c_codproveed:valor_provedor}),
                                success: function(response) {
                                    let descripcion_provedor = response;

                                    // Si no hay datos o el arreglo está vacío, asigna un valor predeterminado
                                    if (!Array.isArray(descripcion_provedor) || descripcion_provedor.length === 0) {
                                      descripcion_provedor = [
                                        {
                                          "c_codproveed": "0",
                                          "c_descripcio": "Provedor no existente",
                                          "c_rif": "0"
                                        }
                                      ];
                                      
                                      document.getElementById('provedorcod').value = descripcion_provedor[0]['c_descripcio'];
                                    } else {
                                      console.log(descripcion_provedor);
                                    
                                      // Verifica que el primer elemento tiene la propiedad 'c_descripcio'
                                      if (descripcion_provedor[0] && descripcion_provedor[0].c_descripcio) {
                                        document.getElementById('provedorcod').value = descripcion_provedor[0]['c_descripcio'];
                                       alert(`Proveedor: ${descripcion_provedor[0]['c_descripcio']} Encontrado`)
                                      } else {
                                        console.error("El objeto en el índice 0 no tiene la propiedad 'c_descripcio'.");
                                      }
                                    }
                                    
                                }})
                        

                    })
                    
                    // Agregar listener para cambios en el checkbox
                    
                },
            confirmButtonText: 'Guardar',
            focusConfirm: false,
            preConfirm: () => {
                const campos = [
                    'descripcion',
                    'modelo',
                    'marca',
                    'descripcion_corta',
                    'moneda',
                    'codigo_alterno2',
                    'descripcionAlterana'
                ];
                for (const campo of campos) {
                const elemento = document.getElementById(campo);
                if (elemento && !elemento.disabled && elemento.value.trim() === '') {
                    Swal.showValidationMessage(`Por favor, completa el campo: ${campo}`);
                    return false;
                }
            }

                // Aquí puedes recuperar los valores de los inputs para procesarlos
                return {
                    codigo_tio: document.getElementById('codigo_tio').value,
                    descripcion: document.getElementById('descripcion').value,
                    marca: document.getElementById('marca').value,
                    modelo: document.getElementById('modelo').value,
                    descripcion_corta: document.getElementById('descripcion_corta').value,
                    codigo_departamento : document.getElementById('codigo-departamento').value,
                    codigo_grupo : document.getElementById('codigo-grupo').value,   
                    codigo_subgrupo :document.getElementById('codigo-subgrupo').value,
                    


                    codigo_alterno2: document.getElementById('codigo_alterno2').value,

                };
            }
        }).then((result) => {
            if (result.isConfirmed) {
                const datos = result.value;
                // Aquí tienes los datos de los inputs
                $.ajax({

                        type: 'POST',
                        url: '/code/inser_codigo',
                        contentType: 'application/json',
                        data: JSON.stringify({ 
                                            c_CodNasa: datos.codigo_tio,
                                            c_Codigo: datos.codigo_tio,
                                            c_Descripcion: 'CODIGO MAESTRO',
                                            n_Cantidad: '1',
                                            nu_Intercambio: '1',
                                            nu_TipoPrecio: '0'

                            }),
                            success: function(response) {
                               
                        
                                console.log(response)
                                // Mostrar en consola la descripción de cada item recibido
                                
                            },
                            error: function(error) {
                                console.error('Error:', error);
                            }
                        });
                        $.ajax({
                            type: 'POST',
                            url: '/code/inser_codigo_alterno',
                            contentType: 'application/json',
                            data: JSON.stringify({ 
                                c_CodNasa: datos.codigo_tio,
                                c_Codigo: datos.codigo_alterno2,
                                c_Descripcion: 'CODIGO ALTERNO',
                                n_Cantidad: '1',
                                nu_Intercambio: '1',
                                nu_TipoPrecio: '0'
                            }),
                            success: function(response) {
                                console.log(response);
                                // Mostrar en consola la descripción de cada item recibido
                            },
                            error: function(error) {
                                console.error('Error:', error);
                            }
                        });
                $.ajax({
                        type: 'POST',
                        url: '/code/inserProve',
                        contentType: 'application/json',
                        data: JSON.stringify({ 
                                        c_codigo: datos.codigo_tio,
                                        c_codprovee: localStorage.getItem('provedor')
                        }),
                        success: function(response) {
                                        console.log(response);
                                        // Mostrar en consola la descripción de cada item recibido
                                    },
                        error: function(error) {
                                        console.error('Error:', error);
                                    }
                        });
                $.ajax({
                        type: 'POST',
                        url: '/code/inser_producto',
                        contentType: 'application/json',
                        data: JSON.stringify({c_Codigo: datos.codigo_tio,
                                                c_Descri: datos.descripcion,
                                                c_Departamento: datos.codigo_departamento,
                                                c_Grupo: datos.codigo_grupo,
                                                c_SubGrupo: datos.codigo_subgrupo,
                                                c_Marca: datos.marca,
                                                c_Modelo: datos.modelo,
                                                c_CodMoneda: 'USD',
                                                cu_Descripcion_Corta: datos.descripcion_corta,
                                                codigoUser: codigo_usuario,
                                                codigouserupd:codigo_usuario
                                            }),
                            success: function(response) {
                        
                                console.log(response)
                                Swal.fire('¡Éxito!', 'Producto y código guardados correctamente.', 'success');
                                Swal.fire({
                                    title: '¡Éxito!',
                                    allowOutsideClick: false,
                                    text: 'Producto y código guardados correctamente.',
                                    icon: 'success',
                                    confirmButtonText: 'OK'
                                }).then((result) => {
                                    if (result.isConfirmed) {
                                       /*BLOQUE PARA IMPRIMIR ETIQUETA*/
                                       /* hacer la peticion para impresion de etiqueta */
                                       Swal.fire({
                                        title: 'Información del Producto',
                                        allowOutsideClick: false,
                                        html: `
                                            <form id="producto-form">
                                            <label for="codigo_tio">Código Tío</label>
                                            <input value="${datos.codigo_tio}" type="text" name="codigo_tio" id="codigo_tio" disabled class="swal2-input">
                            
                                            <label for="descripcion">Descripción</label>
                                            <input value="${datos.descripcion}" name="descripcion" type="text" id="descripcion" disabled class="swal2-input">
                            
                                            <label for="nombre">Nombre</label>
                                            <input type="text" id="nombre" name="nombre" class="swal2-input">
                            
                                            <label for="cantidad">Cantidad Unidades</label>
                                            <input type="text" id="cantidad" name="cantidad" class="swal2-input">
                            
                                            <label for="CodigoProv">Código Proveedor</label>
                                            <input type="text" id="CodigoProv" name="CodigoProv" class="swal2-input">
                            
                                            <label for="comentario">Comentario</label>
                                            <input type="text" id="comentario" name="comentario" class="swal2-input">
                            
                                            <label for="container">Contenedor</label>
                                            <input type="text" id="container" name="container" class="swal2-input">
                            
                                            <label for="CantidadImpresion">Cantidad Etiqueta</label>
                                            <input type="text" id="CantidadImpresion" name="CantidadImpresion" class="swal2-input">
                                        </form>
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
                                            cantidad_eti: document.getElementById('CantidadImpresion').value
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
                                                location.reload()
                                            })
                                            .catch(error => {
                                                Swal.fire('Error', 'Hubo un problema al enviar los datos', 'error');
                                            });
                                        }
                                    });

                                           
                                    }
                                });
                                
                            },
                            error: function(error) {
                                console.error('Error al insertar el código:', error);
                                Swal.fire('Error', 'No se pudo guardar el código.', 'error');
                            }
                        });
                
                $.ajax({
                    type: 'POST',
                    url: '/code/inserpendiente',
                    contentType: 'application/json',
                    data: JSON.stringify({c_Codigo: datos.codigo_tio,
                                        c_Descri: datos.descripcion,
                                        c_Departamento: datos.codigo_departamento,
                                        c_Grupo: datos.codigo_grupo,
                                        c_SubGrupo: datos.codigo_subgrupo,
                                        c_Marca: datos.marca,
                                        c_Modelo: datos.modelo,
                                        c_CodMoneda: 'USD',
                                        cu_Descripcion_Corta: datos.descripcion_corta,
                                        codigoUser: codigo_usuario,
                                        codigouserupd:codigo_usuario
                                        }),
                                                success: function(response) {
                                                                console.log(response);
                                                                // Mostrar en consola la descripción de cada item recibido
                                                            },
                                                error: function(error) {
                                                                console.error('Error:', error);
                                                            }})
                        $.ajax({
                        type: 'POST',
                        url: '/code/insertpendientetr',
                        contentType: 'application/json',
                        data: JSON.stringify({ c_CodNasa: datos.codigo_tio,
                                                c_Codigo: datos.codigo_tio,
                                                c_Descripcion: datos.descripcion,
                                              }),
                                    success: function(response) {
                                                    console.log(response);
                                                    // Mostrar en consola la descripción de cada item recibido
                                                },
                                    error: function(error) {
                                                    console.error('Error:', error);
                                                }
                            
                            })

            }
        });

})








