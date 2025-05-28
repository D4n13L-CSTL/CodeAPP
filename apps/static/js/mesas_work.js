
document.getElementById('new_conted').addEventListener('click', () => {
    Swal.fire({
        title: 'Nombre de Contenedor Nuevo',
        html: `
          <p><strong></strong></p>
        `, // Mostrar el host actual justo arriba del campo de entrada
        input: 'text',
        inputLabel: 'Nombre de Contenedor',
        inputPlaceholder: 'Nombre',
        showCancelButton: true,
        confirmButtonText: 'Guardar',
        preConfirm: (name) => {
          if (!name) {
            Swal.showValidationMessage('El nombre es obligatorio');
          }
          return name;
        }
      }).then((result) => {
        if (result.isConfirmed) {
          const nombre = result.value;
          // Enviar el valor del host al backend
          $.ajax({
            type: 'POST',
            url: '/form/crearworktable',
            contentType: 'application/json',
            data: JSON.stringify({nombre_mesa : nombre}),
            success: function (response) {
                console.log(response);
                window.location.reload()
               
            },
            error: function (xhr) {
                console.error("Error al enviar los datos:", xhr.responseText);
                // Aquí puedes mostrar algún mensaje de error si es necesario
            },
        });

        }
      })

})


document.getElementById('edi-conte').addEventListener('click', () => {
  $.ajax({
    type: 'POST',
    url: '/form/mesasedit',
    contentType: 'application/json',
    data: JSON.stringify({}),
    success: function (response) {
      console.log("Respuesta completa:", response); // Para depuración

      let opciones = {};

      // Verificamos si response es un array y lo transformamos
      if (Array.isArray(response)) {
        response.forEach((item) => {
          opciones[item.id] = item.nombre; // id como clave, nombre como valor
        });
      } else {
        console.warn("La respuesta no es un array válido.");
      }

      Swal.fire({
        title: 'Actualizar vista del usuario',
        text: 'Selecciona una nueva vista para el usuario:',
        icon: 'info',
        input: 'select',
        inputOptions: opciones,  // Se asegura que tenga un objeto válido
        inputPlaceholder: 'Selecciona una Vista',
        showCancelButton: true,
        confirmButtonText: 'Actualizar',
        cancelButtonText: 'Cancelar',
        inputValidator: (value) => {
          if (!value) {
            return 'Debes seleccionar un rol!';
          }
        }
      }).then((result) => {
        if (result.isConfirmed) {
          const id = result.value;
          
          Swal.fire({
            title: 'Nombre de Contenedor',
            html: `
              <p><strong></strong></p>
            `, // Mostrar el host actual justo arriba del campo de entrada
            input: 'text',
            inputLabel: 'Actualizar Contenedor',
            inputPlaceholder: 'Nombre',
            showCancelButton: true,
            confirmButtonText: 'Guardar',
            preConfirm: (name) => {
              if (!name) {
                Swal.showValidationMessage('El nombre es obligatorio');
              }
              return name;
            }
          }).then((result) => {
            if (result.isConfirmed) {
              const nombre = result.value;
              // Enviar el valor del host al backend
              $.ajax({
                type: 'PUT',
                url: '/form/updatename',
                contentType: 'application/json',
                data: JSON.stringify({nombre_mesa : nombre, id: id}),
                success: function (response) {
                    console.log(response);
                    window.location.reload()
                   
                },
                error: function (xhr) {
                    console.error("Error al enviar los datos:", xhr.responseText);
                    // Aquí puedes mostrar algún mensaje de error si es necesario
                },
            });
    
            }
          })
        }
      });
    },
    error: function (xhr) {
      console.error("Error al enviar los datos:", xhr.responseText);
    }
  });
});


/*
$.ajax({
    type: 'POST',
    url: '/form/mesasedit',
    contentType: 'application/json',
    data: JSON.stringify({ }),
    success: function (response) {
        console.log(response);
       
    },
    error: function (xhr) {
        console.error("Error al enviar los datos:", xhr.responseText);
        // Aquí puedes mostrar algún mensaje de error si es necesario
    },
});*/