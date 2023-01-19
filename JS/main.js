

const stockProducts = [];


const pedirProductos = async () => {
    const resp = await fetch("../../stock.json");
    const data = await resp.json();
    data.forEach((product)=>{
                stockProducts.push(product)
                })
    logout();
    }

pedirProductos();


let dataUsers = [
    {user: "Coderhouse", pass: "1234", carrito:0},
    {user: "Ale Daniele", pass:"4321", carrito:0}
];

dataUsers = JSON.parse(localStorage.getItem("dataUsers"))||[];


let carrito = [];
let contenedor = document.getElementById("contenedor");
let modal = document.querySelector(".modal-body")
let carritoContenedor = document.getElementById("carrito-contenedor")
let vaciarCarrito = document.getElementById("vaciar-carrito");
let continuarCompra = document.getElementById("continuar-compra");
let totalCarrito = document.getElementById("total-carrito");
let btnVolver = document.getElementById("btn-volver");
let montoTotal;
let btnIngresar = document.getElementById("btn-ingresar");
let userLog = document.getElementById("user-log");
let passLog = document.getElementById("pass-log");
let btnLogin = document.getElementById("btn-login");
let btnLogout = document.getElementById("btn-logout");
let btnCarrito = document.getElementById("btn-carrito");
let check = document.getElementById("check");
let btnReg = document.getElementById("btn-reg");
let btnRegOk = document.getElementById("btn-reg-ok");
let userReg = document.getElementById("user-reg");
let passReg = document.getElementById("pass-reg");
let loginOk = false;
let formReg = document.getElementById("form-reg");
let btnBuscar = document.getElementById("btn-buscar");
let inputBuscar = document.getElementById("input-buscar");
let formBuscar = document.getElementById("form-buscar");
let bandera;
let productosFiltrados = [];

// loginOk = localStorage.getItem("loginOk")||false;

// if(loginOk) {
//     logout();
//      login();
//  }else{
//    logout();
//  }

logout();

btnIngresar.addEventListener("click", login);
btnLogout.addEventListener("click", logout);

// Registro de nuevos usuarios
formReg.addEventListener("submit", ()=>{
    
    
    const found = dataUsers.find((element)=>(element.user===userReg.value))
    if(found){
        Swal.fire({
            title: 'Su usuario ya existe',
            icon: 'error',
            confirmButtonText: 'Aceptar'
          })
    }
    else{
        dataUsers.push({user: userReg.value, pass: passReg.value, carrito: 0})
        localStorage.setItem("dataUsers", JSON.stringify(dataUsers));
    }
})

function login(){
        
        localStorage.setItem("loginOk", true)

        recordarCuenta();

        dataUsers.forEach((item)=>{
            if((item.user==userLog.value)&&(item.pass==passLog.value)){
                contenedor.innerHTML = "";
                bandera = true;
                stockProducts.forEach(element => {
    
                    const {id, name, quantity, desc, price, img} = element;
                    contenedor.innerHTML += `
                    <div class="card my-card" style="width: 18rem;">
                        <img src="${img}" class="card-img-top img-card" alt=${name}>
                        <div class="card-body">
                        <h5 class="card-title"><a href="#">${name}</a></h5>
                        <p class="card-text">${desc}</p>
                        <p class="card-text">Precio: $${price}</p>
                        <button onclick = "agregarProducto(${id})"class="btn btn-addcarry">AGREGAR AL CARRITO</button>
                        </div>
                    </div>
                    `
                
                });
                btnLogin.classList.add("d-none");
                btnLogout.classList.remove("d-none");
                btnCarrito.classList.remove("d-none");
                btnReg.classList.add("d-none");
                formBuscar.classList.remove("d-none");
            }    
        })
        
        if(!bandera){
            
                Swal.fire({
                    title: 'Usuario o contraseña incorrecta',
                    icon: 'error',
                    confirmButtonText: 'Aceptar'
                  })
            
        }
}

function logout(){

    localStorage.setItem("loginOk", false);
    bandera = false;
    check.checked = localStorage.getItem("check");
    userLog.value = localStorage.getItem("userLog")||"";
    passLog.value = localStorage.getItem("passLog")||"";
    contenedor.innerHTML = "";
    stockProducts.forEach(element => {

        const {id, name, quantity, desc, price, img} = element;
        contenedor.innerHTML += `
        <div class="card my-card" style="width: 18rem;">
            <img src="${img}" class="card-img-top" alt=${name}>
            <div class="card-body">
            <h5 class="card-title"><a href="#">${name}</a></h5>
            <p class="card-text">${desc}</p>
            <p class="card-text">Precio: $${price}</p>
            
            </div>
        </div>
        `
    });
    btnLogin.classList.remove("d-none");
    btnLogout.classList.add("d-none");
    btnCarrito.classList.add("d-none");
    btnReg.classList.remove("d-none");
}


document.addEventListener("DOMContentLoaded", () => {
    carrito = JSON.parse(localStorage.getItem('carrito'))||[];
    mostrarCarrito();
    refreshCarritoContenedor()
    check.checked = localStorage.getItem("check");
    userLog.value = localStorage.getItem("userLog")||"";
    passLog.value = localStorage.getItem("passLog")||"";
    
})

vaciarCarrito.addEventListener("click", (e)=>{
    
    carrito = [];
    mostrarCarrito();
    refreshCarritoContenedor()
})
continuarCompra.addEventListener("click", ()=>{
    if(carrito.length === 0){
        Swal.fire({
            title: 'Tu carrito está vacio',
            text: 'No has adquirido ningún producto',
            icon: 'error',
            confirmButtonText: 'Aceptar'
          })
    }
    else{
        location.href = "compra.html"
    }
});


function agregarProducto(id){
    const item = stockProducts.find((product)=>product.id === id);
    if(!carrito.includes(item)){
        carrito.push(item);
    } 
    else{
        carrito.forEach(element => {
            if(element.id === id){
                element.quantity++;
            }
        });
    }

    Toastify({
        text: "Producto agregado al carrito",
        duration: 3000,
        newWindow: true,
        
        gravity: "bottom", // `top` or `bottom`
        position: "right", // `left`, `center` or `right`
        stopOnFocus: true, // Prevents dismissing of toast on hover
        style: {
          background: "linear-gradient(to right, #00b09b, #96c93d)",
        },
        
      }).showToast()

    mostrarCarrito();
    refreshCarritoContenedor();
}

function mostrarCarrito(){
    modal.innerHTML = " ";
    montoTotal = 0;

    carrito.forEach(product => {
        const {id, name, quantity, desc, price, img} = product;
        modal.innerHTML += `
        <div class="card my-card" style="width: 18rem;">
            <img src="${img}" class="card-img-top" alt=${name}>
            <div class="card-body">
            <h5 class="card-title"><a href="#">${name}</a></h5>
            <p class="card-text">Precio: $${price}</p>
            <p class="card-text">Cantidad: ${quantity}</p>
            <button onclick = "eliminarProducto(${id})"class="btn btn-addcarry">ELIMINAR</button>
            </div>
        </div>
        `

        montoTotal += price*quantity;
        totalCarrito.textContent = " " + montoTotal;
    })
    if(carrito.length === 0){
        modal.innerHTML = `<p>Aun no agregaste productos</p>`
        montoTotal = 0;
        totalCarrito.textContent = " " + montoTotal;

    }
    guardarStorage();
}

function eliminarProducto(id){
    let index = carrito.findIndex((product)=>product.id===id)
    carrito.splice(index, 1);
    mostrarCarrito();
    refreshCarritoContenedor();

}

function guardarStorage(){
    localStorage.setItem("carrito", JSON.stringify(carrito))
}

function refreshCarritoContenedor(){
    carritoContenedor.textContent = carrito.length;
}

function recordarCuenta(){
    if(check.checked){
        localStorage.setItem("userLog", userLog.value);
        localStorage.setItem("passLog", passLog.value);
        localStorage.setItem("check", check.checked);

    }
    else{
        localStorage.setItem("userLog", "");
        localStorage.setItem("passLog", "");
    }
}

inputBuscar.addEventListener("input", (e)=>{
    e.preventDefault();
        productosFiltrados = stockProducts.filter(e =>
        e.name.toLowerCase().includes(inputBuscar.value) 
      )
            
      contenedor.innerHTML = "";
     
      productosFiltrados.forEach(element => {

          const {id, name, quantity, desc, price, img} = element;
          contenedor.innerHTML += `
          <div class="card my-card" style="width: 18rem;">
              <img src="${img}" class="card-img-top img-card" alt=${name}>
              <div class="card-body">
              <h5 class="card-title"><a href="#">${name}</a></h5>
              <p class="card-text">${desc}</p>
              <p class="card-text">Precio: $${price}</p>
              <button onclick = "agregarProducto(${id})"class="btn btn-addcarry">AGREGAR AL CARRITO</button>
              </div>
          </div>
          `
      
      });


})

