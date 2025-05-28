const descripcion = document.getElementById('descripcion').value = localStorage.getItem('descrip_articulo')
const codigo_tio = document.getElementById('codigo').value = localStorage.getItem('c_Codigo')
const codigo_alterno = document.getElementById('codigoAlterno').value = localStorage.getItem('cod_ArtiCulo')


const departamento = document.getElementById('departamento').value = localStorage.getItem('c_Departamento')
const grupo = document.getElementById('grupo').value = localStorage.getItem('c_Grupo')
const subgrupo = document.getElementById('subgrupo').value = localStorage.getItem('c_Subgrupo')

const codigoBult = document.getElementById('codigoBulto').value = localStorage.getItem('bulto_codigo')
const cantidadArticulo = document.getElementById('cantidadArticulo').value = localStorage.getItem('cantidad_articulo')
const restante = document.getElementById('restante').value = localStorage.getItem('restantes')
const usuario = document.getElementById('usuarioid').value = localStorage.getItem('usuario')
const contenedor = document.getElementById('contenedor').value = localStorage.getItem('numero_contenedor')
const cantidadContada = document.getElementById('cantidadContada').value = localStorage.getItem('conteo_user')


document.getElementById('btn-correo').addEventListener('click', async () => {
    try {
        Swal.fire({
            title: 'Enviando correo...',
            text: 'Por favor, espera.',
            allowOutsideClick: false,
            didOpen: () => {
                Swal.showLoading(); // Mostrar icono de carga
            }
        });
        const response = await fetch('/email/reporte', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                descripcion: descripcion,
                codigo: codigo_tio,
                departamento: departamento,
                grupo: grupo,
                subgrupo: subgrupo,
                bulto: codigoBult,
                cantidad_bulto: cantidadArticulo,
                cantidad_contada: cantidadContada,
                restante: restante,
                contada_por: usuario,
            }),
        });

        if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status}`);
        }

        const data = await response.json(); // Convertir la respuesta a JSON
        console.log('Respuesta:', data); // Mostrar en la consola
        Swal.fire({
            icon: 'success',
            title: 'Correo enviado',
            text: 'El correo ha sido enviado correctamente.',
        });
        
    } catch (error) {
        console.error('Error:', error);
        Swal.fire({
            icon: 'error',
            title: 'Error al enviar',
            text: 'Hubo un problema al enviar el correo.',
        });
    }
});
