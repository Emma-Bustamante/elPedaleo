const formulario = document.getElementById('miFormulario')
const barraCarga = document.getElementById('barraCarga')

    const nombre = document.getElementById("nombre").value
    const numeroTarjeta = document.getElementById("numeroTarjeta").value
    const fechaExpiracion = document.getElementById("fechaExpiracion").value
    const cvv = document.getElementById("cvv").value
    const mail = document.getElementById("mail").value
    

    function relleanarAutomatico() {
    
        document.getElementById('nombre').value = 'Hernan Bustos';
        document.getElementById('numeroTarjeta').value = '1234 5678 9012 3456';
        document.getElementById('fechaExpiracion').value = '22/11'
        document.getElementById('cvv').value = '065'
        document.getElementById('mail').value = 'hbustoas@mail.com'
    }
    relleanarAutomatico() 
    
    formulario.addEventListener('submit', (event) => {
        event.preventDefault(); // Evita que el formulario se envíe realmente
        barraCarga.style.display = 'block'
        realizarPago()
        .then(() => {
            return new Promise(resolve => setTimeout(resolve, 1000))
        })
        .then(() => {
            barraCarga.style.display = 'none'
            localStorage.removeItem("miCarrito")
            Swal.fire({
                icon: 'success',
                title: 'Pago completado',
                text: 'Se ha enviado un correo electrónico a su casilla.'
            }) 
            .then((result)=>{
            if(result && result.isConfirmed){
                window.location.href="index.html"
            }
        })
        })
        .catch(error => {
            barraCarga.style.display = 'none'
            Swal.fire({
                icon: 'error',
                title: 'Error al procesar el pago',
                text: error.message
            })
        })
    })

    function realizarPago() {
        return new Promise((resolve, reject) => {
            let progreso = 0
            const intervalo = setInterval(() => {
                progreso += Math.random() * 10
                barraCarga.value = progreso
                if (progreso >= 100) {
                    clearInterval(intervalo)
                    resolve()
                }
            }, 500)
        })
    }
    

    
function volverAtras(){
    window.history.back()
}
