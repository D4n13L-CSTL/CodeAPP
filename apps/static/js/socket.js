// Conectar al servidor de WebSockets
const socket = io("http://10.21.5.188:8080/", { transports: ["websocket"] });

// Escuchar el evento "mensaje_recibido" (cuando se recibe un mensaje privado)
socket.on('mensaje_recibido', (data) => {
    console.log(`Nuevo mensaje de ${data.remitente}: ${data.mensaje}`);
    // Aquí puedes mostrar el mensaje en la interfaz de usuario
    // Ejemplo de mostrarlo en un chat

    const Toast = Swal.mixin({
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        didOpen: (toast) => {
          toast.onmouseenter = Swal.stopTimer;
          toast.onmouseleave = Swal.resumeTimer;
        }
      });
      Toast.fire({
        icon: "success",
        title: `Nuevo mensaje de ${data.remitente}`

      });
});

// Escuchar el evento "notificacion_mensaje" (cuando se recibe una notificación de un nuevo mensaje)
socket.on('notificacion_mensaje', (data) => {
    console.log(data.mensaje); // Muestra la notificación en consola
    // Puedes mostrar la notificación en la interfaz de usuario
    // Ejemplo: mostrarla en un área de notificaciones
    const notificationArea = document.getElementById('notificaciones');
    const notification = document.createElement('div');
    notification.classList.add('notificacion');
    notification.innerHTML = `<p>${data.mensaje}</p>`;
    notificationArea.appendChild(notification);

    // Aquí puedes hacer que la notificación sea visible en un modal, toast, etc.
});
