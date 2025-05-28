const inputs = document.querySelectorAll(".input");


function addcl(){
	let parent = this.parentNode.parentNode;
	parent.classList.add("focus");
}

function remcl(){
	let parent = this.parentNode.parentNode;
	if(this.value == ""){
		parent.classList.remove("focus");
	}
}


inputs.forEach(input => {
	input.addEventListener("focus", addcl);
	input.addEventListener("blur", remcl);
});


document.getElementById('formulario').addEventListener('submit', () =>{
	event.preventDefault();
	const usuario = document.getElementById('Username').value
	const contraseña = document.getElementById('password').value
	console.log(usuario);
	console.log(contraseña);
	
	
	fetch('/loggin/singin', {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ username: usuario, password: contraseña })
	})
	.then(response => {
		if (response.ok) {
			window.location.href = '/';  // Redirige a la página de inicio
		} else {
			alert('Error: Usuario o contraseña incorrectos');
		}
	})
	.catch(error => {
		alert('Hubo un error');
	});
	
	
})

