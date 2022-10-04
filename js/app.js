const resultado = document.querySelector("#resultado");
const formulario = document.querySelector("#formulario");
const paginacionDiv = document.querySelector("#paginacion");

const registrosPorPagina = 40;
let totalPaginas;
let iterador;
let paginaActual = 1;

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

  buscarImagenes();
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

async function buscarImagenes() {
  const termino = document.querySelector("#termino").value;
  const apiKey = "30246214-5c40cb1a8665b817ccaa93ee9";

  const url = `https://pixabay.com/api/?key=${apiKey}&q=${termino}&per_page=${registrosPorPagina}&page=${paginaActual}`;

  try {
    const respuesta = await fetch(url);
    const resultado = await respuesta.json();
    totalPaginas = calcularPaginas(resultado.totalHits);

    mostrarImagenes(resultado.hits);
  } catch (error) {
    console.log(error);
  }
}

// generador que va a registrar la cantidad de elemntos de acuerdo a las paginas

function* crearPaginador(total) {
  for (let i = 1; i <= total; i++) {
    yield i;
  }
}
//paginacion
function calcularPaginas(total) {
  return parseInt(Math.ceil(total / registrosPorPagina));
}

function mostrarImagenes(imagenes) {
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

  // limpiar el html

  while (paginacionDiv.firstChild) {
    paginacionDiv.removeChild(paginacionDiv.firstChild);
  }

  // generar el paginador
  imprimirPaginador();
}

function imprimirPaginador() {
  iterador = crearPaginador(totalPaginas);

  while (true) {
    const { value, done } = iterador.next();
    if (done) return;

    const boton = document.createElement("a");
    boton.href = "#";
    boton.dataset.pagina = value;
    boton.textContent = value;
    boton.classList.add(
      "siguiente",
      "bg-yellow-400",
      "px-4",
      "py-1",
      "mr-2",
      "font-bold",
      "mb-10",
      "uppercase",
      "rounded"
    );

    boton.onclick = () => {
      paginaActual = value;

      buscarImagenes();
    };

    paginacionDiv.appendChild(boton);
  }
}
