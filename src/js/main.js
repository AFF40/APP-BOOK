// Definimos la URL de la API de libros de Harry Potter
const URL_BOOKS = 'https://potterapi-fedeperin.vercel.app/es/books';

// Función asíncrona para obtener los libros de la API
async function getBooks() {
  const response = await fetch(URL_BOOKS); // Hacemos la petición a la API
  const data = await response.json(); // Convertimos la respuesta en JSON
  return data; // Devolvemos los datos
}

// Función para guardar datos en el Local Storage
function setLocalStorage (key, quantity) {
  localStorage.setItem(key, quantity); // Guardamos la cantidad con la clave proporcionada
}

// Función para obtener datos del Local Storage
function getLocalStorage (key) {
  return localStorage.getItem(key); // Obtenemos el valor asociado a la clave proporcionada
}

// Función para eliminar todos los libros del Local Storage
function clearLocalStorage() {
    localStorage.removeItem('app_books_details'); // Elimina los detalles de los libros
    localStorage.removeItem('app_books_quantity'); // Elimina la cantidad de libros
  
    // Obtenemos el icono del carrito de compras
    const ICON_SHOPPING = document.getElementById('shopping_cart');
    // Actualizamos el contador del carrito
    ICON_SHOPPING.setAttribute('data-badge', 0);
}

// Añade un evento de click al botón "Vaciar carrito"
const clearCartButton = document.getElementById('clear_cart');

// Agrega el icono al botón
const iconElement = document.createElement('img');
iconElement.src = '/icons/basura.png'; 
iconElement.alt = 'Icono de vaciar carrito';
iconElement.className = 'icono-vaciar'; // Asigna la clase 'icono-vaciar' al elemento de imagen

clearCartButton.appendChild(iconElement);

clearCartButton.addEventListener('click', (event) => {
  event.preventDefault(); // Evita que el botón realice la acción por defecto
  clearLocalStorage(); // Llama a la función clearLocalStorage()
});

// Evento que se dispara cuando el documento HTML ha sido completamente cargado
document.addEventListener('DOMContentLoaded', async function() {
  // Obtenemos el icono del carrito de compras
  const ICON_SHOPPING = document.getElementById('shopping_cart');
  // Establecemos el número de libros en el carrito (obtenido del Local Storage)
  ICON_SHOPPING.setAttribute('data-badge', getLocalStorage('app_books_quantity') || 0);
  // Obtenemos la lista de libros del Local Storage
  const LIST_BOOKS = JSON.parse(getLocalStorage('app_books_details')) || [];
  // Obtenemos el contenedor del contenido de la página
  const PAGE_CONTENT = document.querySelector('.page-content');
  // Mostramos un mensaje de carga
  PAGE_CONTENT.innerHTML = 'Cargando libros...';
  // Obtenemos los libros de la API
  const books = await getBooks();
  let htmlString = '';
  // Iteramos sobre cada libro
  books.forEach(book => {
    // Creamos el HTML para cada libro
    const bookElement = `
  <div class="demo-card-wide mdl-card mdl-shadow--2dp">
    <div class="mdl-card__title" style="background: url('${book.cover}') center / cover">
      <h2 class="mdl-card__title-text" data-title="${book.title}" data-description="${book.description}">${book.title}</h2>
    </div>
    <div class="mdl-card__supporting-text">
      ${book.description.substring(0, 100)}...
    </div>
    <div class="mdl-card__actions mdl-card--border">
      <a class="mdl-button mdl-button--colored mdl-js-button mdl-js-ripple-effect">
        Comprar este libro ${book.releaseDate}
      </a>
    </div>
    <div class="mdl-card__menu">
      <button class="mdl-button mdl-button--icon mdl-js-button mdl-js-ripple-effect share-button">
        <i class="material-icons">share</i>
      </button>
    </div>
  </div>
`;
    // Añadimos el HTML del libro a la cadena de HTML
    htmlString += bookElement;
  });
  // Actualizamos el contenido de la página con los libros
  PAGE_CONTENT.innerHTML = htmlString;

  // Obtenemos todos los botones de compra
  const buttons = document.querySelectorAll('.mdl-button--colored');
  // Iteramos sobre cada botón
  buttons.forEach(button => {
    // Obtenemos el título y la descripción del libro asociado al botón
    const title = button.parentElement.parentElement.querySelector('.mdl-card__title-text').getAttribute('data-title');
    const description = button.parentElement.parentElement.querySelector('.mdl-card__title-text').getAttribute('data-description');
    // Añadimos un evento de click al botón
    button.addEventListener('click', () => {
      // Obtenemos la cantidad de libros en el carrito
      const quantity = +ICON_SHOPPING.getAttribute('data-badge') || 0;
      // Incrementamos la cantidad de libros en el carrito
      ICON_SHOPPING.setAttribute('data-badge', quantity + 1);
      // Guardamos la nueva cantidad de libros en el Local Storage
      setLocalStorage('app_books_quantity', quantity + 1);

      // Creamos un objeto con los detalles del libro
      const bookObject = {
        title: title,
        description: description,
        date: new Date().getTime()
      };
      // Añadimos el libro a la lista de libros
      LIST_BOOKS.push(bookObject);

      // Guardamos la nueva lista de libros en el Local Storage
      setLocalStorage('app_books_details', JSON.stringify(LIST_BOOKS));
    });
  });

// Crear el modal y añadirlo al final del body
const modal = document.createElement('div');
modal.id = 'modal'; // Añadir identificador
modal.innerHTML = `
  <div id="modal-inner">
    <button id="modal-close">&times;</button>
    <p id="modal-content"></p>
  </div>
`;
document.body.appendChild(modal);

// Cerrar el modal cuando se hace clic en (x)
document.getElementById('modal-close').onclick = function() {
  modal.style.display = 'none';
}

// Cerrar el modal cuando se hace clic fuera de él
window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = 'none';
  }
}

// Obtenemos todos los botones de compartir
const shareButtons = document.querySelectorAll('.share-button');

// Añadimos un evento de clic al botón de compartir
shareButtons.forEach(shareButton => {
  shareButton.addEventListener('click', async (event) => {
    // Obtenemos el título y la descripción del libro asociado al botón
    const title = shareButton.parentElement.parentElement.querySelector('.mdl-card__title-text').getAttribute('data-title');
    const description = shareButton.parentElement.parentElement.querySelector('.mdl-card__title-text').getAttribute('data-description');
    const cover = shareButton.parentElement.parentElement.querySelector('.mdl-card__title').style.backgroundImage.slice(5, -2);

// Mostramos los detalles del libro en el modal
document.getElementById('modal-content').innerHTML = `
<div class="modal-content-wrapper">
    <img src="${cover}" alt="${title}" class="modal-cover">
    <div class="modal-text">
    <h2>${title}</h2>
    <p>${description}</p>

    <h4>Compartir en:</h4>
    <div class="share-buttons">
        <a class="share-button-icon" href="compartir en facebook" onclick="shareOnFacebook('${title}', '${cover}')">
            <img class ="share-icon" src="/icons/facebook.png" alt="Facebook Icon">
            <p> Facebook</p>
        </a>
        <a class="share-button-icon" href="compartir en twitter" onclick="shareOnTwitter('${title}', '${cover}')">
            <img class ="share-icon" src="/icons/twitter.png" alt="Twitter Icon">
            <p> Twitter</p>
        </a>
        <a class="share-button-icon" href="compartir en linkedin" onclick="shareOnLinkedIn('${title}', '${cover}')">
            <img class ="share-icon" src="/icons/linkedln.png" alt="LinkedIn Icon">
            <p> LinkedIn</p>
        </a>
        <a class="share-button-icon" href="otro" onclick="shareOnNuevaOpcion('${title}', '${cover}')">
            <img class ="share-icon" src="/icons/share.png" alt="Nueva Opcion Icon">
            <p>otro</p>
        </a>
    </div>
    </div>
</div>
`;

    // Mostramos el modal
    modal.style.display = 'block';

    // Evitamos que el evento de clic se propague para que no se cierre el menú inmediatamente
    event.stopPropagation();


// Función para codificar la URL en formato RFC3986
function encodeRFC3986(str) {
    return encodeURIComponent(str).replace(/[!'()*]/g, function(c) {
      return '%' + c.charCodeAt(0).toString(16);
    });
  }
  
  // Obtenemos los botones de compartir en el modal
  const modalShareButtons = document.querySelectorAll('.modal-content-wrapper .share-button-icon');
  
  // Añadimos un evento de clic a cada botón
  modalShareButtons.forEach(modalShareButton => {
    modalShareButton.addEventListener('click', (event) => {
      event.preventDefault(); // Evita que el botón realice la acción por defecto
      if (modalShareButton.innerHTML.includes('facebook')) {
        // Compartir en Facebook
        const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeRFC3986(document.URL)}&quote=${encodeRFC3986(title + ' - ' + description)}`;
        window.open(url, '_blank');
      } else if (modalShareButton.innerHTML.includes('twitter')) {
        // Compartir en Twitter
        const url = `https://twitter.com/intent/tweet?text=${encodeRFC3986(title + ' - ' + description)}&url=${encodeRFC3986(document.URL)}`;
        window.open(url, '_blank');
      } else if (modalShareButton.innerHTML.includes('linkedin')) {
        // Compartir en LinkedIn
        const url = `https://www.linkedin.com/feed/?linkOrigin=LI_BADGE&shareActive=true`;
        window.open(url, '_blank');
      } else if (modalShareButton.innerHTML.includes('otro')) {
        // Compartir en Nueva Opcion
        if (navigator.share) {
          navigator.share({
            title: title,
            text: description,
            url: document.URL,
          })
          .then(() => console.log('Successful share'))
          .catch((error) => console.log('Error sharing', error));
        } else {
          console.log('Web Share API not supported.');
        }
      }
    });
  });
  });
});
});