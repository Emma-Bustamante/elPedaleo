const tableBody = document.querySelector("table tbody")
const precioTotalElemento = document.getElementById("pagar")
const compraSegura= document.getElementById("btnComprar")
const btnVaciarCarrito= document.querySelector(".btn-vaciar")

function recuperarCarrito() {
    return JSON.parse(localStorage.getItem("miCarrito")) || []
} 

const carrito = recuperarCarrito()


function armarFilaHTML({marca, tipo, cantidad, precio, id}) {
    return `<tr>
                <td>${marca}</td>
                <td>${tipo}</td>
                <td>${cantidad}</td>
                <td>$ ${precio.toLocaleString("es-AR")}</td>
                <td><button class="boton-eliminar" data-id="${id}">😫</button></td>  
            </tr>`
}

function calcularTotal() {
        return carrito.reduce((acumulador, bicicleta) => acumulador + (bicicleta.precio * bicicleta.cantidad), 0)
}

function actualizaTabla(){
        tableBody.innerHTML = ""
        carrito.forEach((producto)=> {
            tableBody.innerHTML += armarFilaHTML(producto)
        })
    const total = calcularTotal()
    precioTotalElemento.textContent = `$ ${total.toLocaleString("es-AR")}`
    
    const botonesEliminar = document.querySelectorAll(".boton-eliminar")
    botonesEliminar.forEach((boton) => {
        boton.addEventListener("click", () => {
            const id = parseInt(boton.dataset.id)
            eliminarProducto(id)
        })
    })

}

function eliminarProducto(id) {
    const indice = carrito.findIndex(producto => producto.id === id)
    carrito[indice].cantidad === 1 ? carrito.splice(indice, 1) : carrito[indice].cantidad--
        localStorage.setItem("miCarrito", JSON.stringify(carrito))
        actualizaTabla()
        
}


compraSegura.addEventListener("click", () => {
    if(carrito.length ===0){
      mostrarAlertaCarritoVacio()
    }else{
      location.href = "finalizar.html" 
    }
    
})

btnVaciarCarrito.addEventListener("click", () => {
    mostrarAlertaCarritoVacio() 
    if(carrito.length > 0){
         Swal.fire({
    title: "¿Estás seguro?",
    text: "Tendrás que volver a empezar",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "¡Estoy decidido!",
    cancelButtonText: "No, ¡comprar!"
  }).then((result) => {
    if (result.isConfirmed) {
        localStorage.removeItem("miCarrito")
        carrito.length=0
        actualizaTabla()
      Swal.fire({
        title: "¡Borrado!",
        text: "Tu carrito fue eliminado.",
        icon: "success"
      })
    }
  })
    }
 
   
})
function mostrarAlertaCarritoVacio(){
    if(carrito.length ===0){
        Swal.fire({
            title: "¡Error!",
            text: "Tu carrito está vacío.¿Queres volver a seleccionar?",
            icon: "error",
            confirmButtonColor: "#3085d6",
            confirmButtonText: "Sí, ¡vamos a comprar!",
            showCancelButton: true,
            cancelButtonColor: "#d33",
            cancelButtonText: "No, gracias",
          }).then((result) => {
            if (result.isConfirmed) {
              window.location.href = "index.html"
            }
          })
    }

}


actualizaTabla()

function volverAtras(){
    window.history.back()
}