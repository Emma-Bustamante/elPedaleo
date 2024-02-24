   function recuperarCarrito() {
    return JSON.parse(localStorage.getItem("miCarrito")) || []
}
const carrito = recuperarCarrito()
const productosStock = [] 
const URL="js/productos.json"
const botonCarrito = document.querySelector("img#carrito")
const contenedor = document.querySelector("div#contenedor")
const btnBuscar = document.getElementById("btnBuscar")
const inputBuscar = document.getElementById("inputBuscar")


function retornarCardHTML({marca,tipo,precio,id}) { 
    return `<div class="card">
                <div><h1>${marca}</h1></div>
                <div class="card-title"><p>${tipo}</p></div>
                <div class="card-price"><p>$ ${precio.toLocaleString("es-AR")}</p></div>
                <button id="${id}" class="button button-outline button-add" title="Pulsa para comprar">Comprar</button>
            </div>`
}

function retornarCardError() {
    return `<div class="card-error">
                <h2>⚠️ ⚠️ </h2>
                <h3>No se han podido listar los productos</h3>
                <h4>Intenta nuevamente en unos instantes...</h4>
                <button class="btnRetry" onclick="recargarPagina()">Recargar</button>
            </div>`
}

function recargarPagina(){
    location.reload()
}

function retornoProduc (productoSeleccionado){
    return produc ={
        id: productoSeleccionado.id,
        marca: productoSeleccionado.marca,
        tipo: productoSeleccionado.tipo,
        cantidad: 1,
        precio: productoSeleccionado.precio
    }
}

function activarClickEnBotones() { 
    const btnAgregar = document.querySelectorAll("button.button-add")
    for (let boton of btnAgregar) {
        boton.addEventListener("click", ()=> {
            const productoSeleccionado = productosStock.find((producto)=> producto.id === parseInt(boton.id))
            const existeEnCarrito = carrito.findIndex((producto)=> producto.id === productoSeleccionado.id)
            if (existeEnCarrito === -1) {
                const produc = retornoProduc(productoSeleccionado)
                carrito.push(produc)
            } else {
                carrito[existeEnCarrito].cantidad++
            }
            localStorage.setItem("miCarrito", JSON.stringify(carrito))
            notificar(`${productoSeleccionado.marca} se agregó al carrito`, 'lightgreen')
            actualizarCantidadCarrito();
        })
    }
}

function cargarCards(array) {
    if (array.length > 0) {
        contenedor.innerHTML = ""
        array.forEach((producto)=> {
            contenedor.innerHTML += retornarCardHTML(producto)
        })
        activarClickEnBotones()
    } else {
        contenedor.innerHTML = retornarCardError()
    }
}

function obtenerProducto(){
    fetch(URL)
    .then((response)=> response.json())
    .then((datos)=>productosStock.push(...datos))
    .then(()=>cargarCards(productosStock))
    .catch((error)=> contenedor.innerHTML = retornarCardError())
}
obtenerProducto()

function  actualizarCantidadCarrito() {
    const cantidadCarrito = carrito.reduce((total, producto) => total + producto.cantidad, 0);
    document.getElementById("carrito-cantidad").textContent = cantidadCarrito.toString();
    
}
actualizarCantidadCarrito()

botonCarrito.addEventListener("click", ()=> {
    carrito.length > 0 ? location.href = "carrito.html" : notificar('Agregue producto(s) al carrito.', 'red')
})

//buscar
btnBuscar.addEventListener("click", () => {
    realizarBusqueda()
});

inputBuscar.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
        realizarBusqueda()
    }
})



function realizarBusqueda() {
    const valorBusqueda = inputBuscar.value.trim().toUpperCase();
    if (valorBusqueda !== "") {
        const resultado = productosStock.filter((producto) => producto.marca.toUpperCase().includes(valorBusqueda) 
                || producto.tipo.toUpperCase().includes(valorBusqueda)) 
        if (resultado.length === 0) {
            notificar(`${valorBusqueda} no se ha encontrado`, 'darkyellow');
        }
        cargarCards(resultado.length > 0 ? resultado : productosStock);
    }
}

function notificar(mensaje, estilo){
    Toastify({
        text: mensaje,
        duration: 3000,
        position: "right",
        close: true,
        style: {background: estilo}
    }).showToast()

}
