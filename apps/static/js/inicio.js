


 
 document.getElementById('set-host-btn').addEventListener('click', () => {
  // Hacer una solicitud para obtener el host actual desde el backend
  $.ajax({
    url: '/izebra', // Asegúrate de que este endpoint exista
    type: 'GET',
    success: (response) => {
      const currentHost = response.host || 'No asignado'; // Mostrar un mensaje si no hay host guardado

      Swal.fire({
        title: 'Configurar IP de Zebra',
        html: `
          <p>IP actual: <strong>${host}</strong></p>
        `, // Mostrar el host actual justo arriba del campo de entrada
        input: 'text',
        inputLabel: 'Dirección IP de la Zebra',
        inputPlaceholder: 'Ejemplo: 10.21.5.100',
        inputValue: currentHost !== 'No asignado' ? currentHost : '', // Si hay un host, se muestra como valor inicial
        showCancelButton: true,
        confirmButtonText: 'Guardar',
        preConfirm: (host) => {
          if (!host) {
            Swal.showValidationMessage('El host es obligatorio');
          }
          return host;
        }
      }).then((result) => {
        if (result.isConfirmed) {
          const host = result.value;
          // Enviar el valor del host al backend
          $.ajax({
            url: '/izebra/set_host',
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({ host: host }),
            success: (response) => {
              Swal.fire('Éxito', response.message, 'success');
            },
            error: (xhr) => {
              Swal.fire('Error', xhr.responseJSON.error, 'error');
            }
          });
        }
      });
    },
    error: (xhr) => {
      Swal.fire('Error', 'No se pudo obtener el host actual.', 'error');
    }
  });
});
