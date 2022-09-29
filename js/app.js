const resultado = document.querySelector("#resultado");
const formulario = document.querySelector("#formulario");

window.onload = () => {
  formulario.addEventListener("submit", validarFormulario);
};

function validarFormulario(e) {
  e.preventDefault();
  const terminoBusqueda = document.querySelector("#termino").value;

  if (terminoBusqueda === "") {
    mostarAlerta("Debes ingresar al menos un termino de Busqueda");
    return;
  }

  //consultamdo la API

  buscarImagenes(terminoBusqueda);
}

function mostarAlerta(mensaje) {
  const alerta = document.querySelector(".alerta");

  if (!alerta) {
    const mensajeAlerta = document.createElement("p");
    mensajeAlerta.classList.add(
      "bg-red-100",
      "border-red-400",
      "p-3",
      "mt-5",
      "rounded",
      "mx-auto",
      "text-center",
      "text-red-700",
      "text-3xl",
      "alerta"
    );
    mensajeAlerta.innerHTML = `
    <strong class = "font-bold"> Error! </strong><br>
    <span class="block sm:inline">${mensaje}</span>
    
    `;

    formulario.appendChild(mensajeAlerta);
    setTimeout(() => {
      mensajeAlerta.remove();
    }, 3000);
  }
}

function buscarImagenes(terminoBusqueda) {
  const apiKey = "30246214-5c40cb1a8665b817ccaa93ee9";

  const url = `https://pixabay.com/api/?key=${apiKey}&q=${terminoBusqueda}&per_page=100`;

  fetch(url)
    .then((respuesta) => respuesta.json())
    .then((resultado) => {
      mostrarImagenes(resultado.hits);
    });
}
function mostrarImagenes(imagenes) {
  console.log(imagenes);
  // limpiamos el html

  while (resultado.firstChild) {
    resultado.removeChild(resultado.firstChild);
  }
  // iteramos sobre el arreglo de objetos

  imagenes.forEach((imagen) => {
    const { previewURL, likes, views, largeImageURL } = imagen;

    resultado.innerHTML += `
    <div class="w-1/2 md:w-1/3 lg:w-1/4 p-3 mb -4">
      <div class="bg-white">
        <img class="w-full" src="${previewURL}">
        <div class="p-4">
          <p class="font-bold"> ${likes} <span class="font-light"> Me Gusta</span> </p>
          <p class="font-bold"> ${views} <span class="font-light"> Visualizaciones</span> </p>

            <a 
              class=" block w-full bg-blue-800 hover:bg-blue-500 text-white uppercase font-bold text-center rounded mt-5 p-1"
              href="${largeImageURL}" target="_blank" rel="noopener noreferrer"> 
          
              Ver Imagen HD 
            </a>
        </div>
      </div>
    
    </div>
    
    `;
  });
}
