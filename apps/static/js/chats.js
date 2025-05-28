
const socket = io("http://10.21.5.188:8080/", { transports: ["websocket"] });


socket.on("connect", () => {
    console.log("Conectado al servidor con WebSocket");
});

socket.on("disconnect", () => {
    console.log("Desconectado del servidor");
});





socket.on("nuevo_usuario", (data) => {
    if (data.usuario == localStorage.getItem('usuario_actual')) {
  
    }else{
        mostrarNotificacion_cone(`${data.usuario} se ha conectado`);
    }
  
      
  });
  
  // Función para mostrar una notificación en la UI
  function mostrarNotificacion_cone(mensaje) {
    const notificacionDiv = document.createElement("div");
    notificacionDiv.classList.add("notificacion");
    notificacionDiv.innerText = mensaje;
  
    document.body.appendChild(notificacionDiv);
  
    // Eliminar la notificación después de 3 segundos
    setTimeout(() => {
      notificacionDiv.remove();
    }, 3000);
  }


document.addEventListener("DOMContentLoaded", function() {
    // Delegación de eventos en el contenedor padre
    document.querySelector(".sidebar-menu").addEventListener("click", function(event) {
        // Verificamos si el elemento clickeado tiene la clase "menu-text"
        if (event.target.classList.contains("menu-text")) {
            // Obtener el valor del atributo data-usuario
            let usuario = event.target.getAttribute("data-usuario");

            // Guardamos el valor de usuario en el localStorage
            localStorage.setItem("usuario_seleccionado", usuario);

            // Mostrar el usuario seleccionado en la consola
            console.log("Usuario seleccionado:", usuario);
        }
    });
});





socket.on("usuarios_conectados", (data) => {
    console.log(data);  // Ver la lista de usuarios conectados
    
    // Selecciona el contenedor donde mostrarás los usuarios conectados
    const canalesContainer = document.querySelector(".menu-section");

    // Limpiar los usuarios previos (si existe alguna lista previa de usuarios)
    const usuariosList = canalesContainer.querySelector(".usuarios-list");
    if (usuariosList) {
        usuariosList.remove();
    }

    // Crear un contenedor para la lista de usuarios
    const usuariosListDiv = document.createElement("div");
    usuariosListDiv.classList.add("usuarios-list");

    // Iterar sobre los usuarios conectados y agregarlos al contenedor
    data.forEach((usuario) => {
        const usuarioDiv = document.createElement("div");
        usuarioDiv.classList.add("menu-item");
        usuarioDiv.innerHTML = `
            <div class="menu-icon">
                <i class="fas fa-user"></i>
            </div>
            <div class="menu-text" data-usuario="${usuario}">${usuario} - Conectado</div>
        `;
        usuariosListDiv.appendChild(usuarioDiv);
    });

    // Agregar la lista de usuarios al contenedor de canales
    canalesContainer.appendChild(usuariosListDiv);
});




function mostrarNotificacion(remitente) {
    const usuarioDiv = document.querySelector(`.menu-text[data-usuario="${remitente}"]`);

    if (usuarioDiv) {
        // Agregar el * si aún no está presente
        if (!usuarioDiv.innerHTML.includes(" *")) {
            usuarioDiv.innerHTML += " *";
        }
    }
}

// Función para eliminar la notificación cuando el usuario entra al chat
function quitarNotificacion(remitente) {
    const usuarioDiv = document.querySelector(`.menu-text[data-usuario="${remitente}"]`);

    if (usuarioDiv) {
        usuarioDiv.innerHTML = usuarioDiv.innerHTML.replace(" *", ""); // Remueve el asterisco
    }
}



//Escuchar mensjes privados

socket.on("mensaje_recibido", (data) => {
console.log(`Mensaje de ${data.remitente}: ${data.mensaje} para ${data.destinatario}`);

// Obtener el contenedor principal del chat
const messagesContainer = document.querySelector(".messages-container");

const destinatarioActual = localStorage.getItem("usuario_seleccionado"); // El destinatario del chat que estás viendo

console.log(`Destinatario actual: ${destinatarioActual}, Destinatario del mensaje: ${data.destinatario}`);

// Si el destinatario del mensaje no coincide con el destinatario del chat actual, no agregar el mensaje
if (data.destinatario !== destinatarioActual) {
    // Mostrar notificación en la UI
    mostrarNotificacion(data.remitente);
} else {
    // Crear el nuevo mensaje recibido y agregarlo al chat
    const messageDiv = document.createElement("div");
    messageDiv.classList.add("message", "received");

    messageDiv.innerHTML = `
        <div class="message-avatar">${data.remitente.charAt(0).toUpperCase()}</div>
        <div class="message-content">
            <div class="message-text">
                ${data.mensaje}
            </div>
            <div class="message-time">
                <i class=""></i> ${new Date().toLocaleTimeString()}
            </div>
        </div>
        <div class="message-actions">
            <div class="message-action"><i class="far fa-thumbs-up"></i></div>
            <div class="message-action"><i class="fas fa-reply"></i></div>
            <div class="message-action"><i class="fas fa-ellipsis-v"></i></div>
        </div>
    `;

    // Agregar el mensaje al contenedor
    messagesContainer.appendChild(messageDiv);

    // Hacer scroll hacia abajo para mostrar el último mensaje
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}
});



document.addEventListener("click", function (event) {
    const clickedElement = event.target.closest(".menu-item");
    if (clickedElement) {
        const usuarioSeleccionado = clickedElement.querySelector(".menu-text").dataset.usuario;

        // Guardar el usuario seleccionado en localStorage
        localStorage.setItem("usuario_seleccionado", usuarioSeleccionado);

        // Quitar la notificación (asterisco) del usuario seleccionado
        quitarNotificacion(usuarioSeleccionado);
    }
});








// Enviar mensajes
function enviarMensaje() {

const mensaje = document.getElementById("chat_area").value;


// Obtener el valor de data-usuario
const usuario = localStorage.getItem('usuario_seleccionado')

if (mensaje.trim() === "") return; // Evitar mensajes vacíos

// Emitir el mensaje al servidor
socket.emit("mensaje_privado", { mensaje: mensaje, destinatario: usuario });

// Obtener el contenedor de mensajes
const messagesContainer = document.querySelector(".messages-container");

// Crear el mensaje enviado por el usuario
const messageDiv = document.createElement("div");
messageDiv.classList.add("message", "sent");

messageDiv.innerHTML = `
<div class="message-content">
    <div class="message-text">
        ${mensaje}
    </div>
    <div class="message-time">
        <i ></i> ${new Date().toLocaleTimeString()}
    </div>
</div>
<div class="message-actions">
    <div class="message-action"><i class="far fa-thumbs-up"></i></div>
    <div class="message-action"><i class="fas fa-reply"></i></div>
    <div class="message-action"><i class="fas fa-ellipsis-v"></i></div>
</div>
`;

// Agregar el mensaje al contenedor
messagesContainer.appendChild(messageDiv);

// Hacer scroll hacia abajo para mostrar el último mensaje
messagesContainer.scrollTop = messagesContainer.scrollHeight;


    fetch("/chat/guardar_mensaje", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({destinatario:usuario, mensaje:mensaje })
    })
    .then(response => response.json())
    .then(data => console.log(data))
    .catch(error => console.error("Error al guardar mensaje:", error));


// Limpiar el campo de texto
document.getElementById("chat_area").value = "";
}

document.getElementById("chat_area").addEventListener("keydown", function(event) {
    if (event.key === "Enter" && !event.shiftKey) { // Detecta Enter, pero permite Shift+Enter para salto de línea
        event.preventDefault();  // Evita el salto de línea en el textarea
        enviarMensaje();  // Llama a la función que envía el mensaje
    }
});







function cargarMensajes() {
    const remitente = localStorage.getItem("usuario_actual") || "Anónimo";
    const destinatario = localStorage.getItem("usuario_seleccionado");
    console.log(remitente);
    
    if (!destinatario) return;

    fetch(`/chat/obtener_mensajes/${destinatario}`)
    .then(response => response.json())
    .then(mensajes => {
        console.log(mensajes);
        
        const messagesContainer = document.querySelector(".messages-container");
        messagesContainer.innerHTML = ""; // Limpiar el área de chat

        mensajes.forEach(mensaje => {
            const esRemitente = mensaje.remitente  === remitente; // Verifica quién envió el mensaje
            const messageDiv = document.createElement("div");
            messageDiv.classList.add("message", esRemitente ? "sent" : "received");

            messageDiv.innerHTML = `
             ${!esRemitente ? `<div class="message-avatar"><span class="fas fa-user-alt"></span></div>` : ""}
                <div class="message-content">
                    <div class="message-text">${mensaje.mensaje}</div>
                    <div class="message-time">
                        <i></i> ${new Date(mensaje.timestamp).toLocaleTimeString()}
                    </div>
                </div>
                <div class="message-actions">
                    <div class="message-action"><i class="far fa-thumbs-up"></i></div>
                    <div class="message-action"><i class="fas fa-reply"></i></div>
                    <div class="message-action"><i class="fas fa-ellipsis-v"></i></div>
                </div>
            `;

            messagesContainer.appendChild(messageDiv);
        });

        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    })
    .catch(error => console.error("Error al cargar mensajes:", error));
}






// Llamar a la función cuando se seleccione un usuario
document.addEventListener("DOMContentLoaded", () => {
    document.querySelector(".sidebar-menu").addEventListener("click", function(event) {
        if (event.target.classList.contains("menu-text")) {
            localStorage.setItem("usuario_seleccionado", event.target.getAttribute("data-usuario"));
            document.querySelector(".chat-header-name").textContent = localStorage.getItem("usuario_seleccionado");
            cargarMensajes(); // Cargar los mensajes cuando se selecciona un usuario
        }
    });
});





