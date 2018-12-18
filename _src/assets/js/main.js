'use strict';

const inputName = document.querySelector('.search__name');
const searchButton = document.querySelector('.search__button');
const list = document.querySelector('.list');
let arrayFavourites = [];
const keyLocalStorage = 'Favourite TV Shows';



/**Función que hace una petición de búsqueda al servidor con el dato que el usuario nos da.
 */
function searchShow() {
 
  let url = giveURL();
    
  fetch(url)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      
      let arrayShows = data;

      paintData(arrayShows);
         
    });
}

/**Función que nos devuelve la URL con la búsqueda que quiere hacer el usuario
 * devuelve la URL
 */
function giveURL() {
  const questName = inputName.value; 
  const url = `http://api.tvmaze.com/search/shows?q=${questName}`;

  return url;
}

/** Función que hace la búsqueda de los datos que necesitamos , en la respuesta que nos da el fetch y que los pinta en el html
*/
function paintData (arrayShows) {

  let nameServer = [];
  let arrayImageUrlServer = [];
  let thingsToPaint = '';
  /*let isFavouriteClass = '';*/

  //recorremos el array de resultados que nos devuelve la petición y almacenamos los resultados que nos interesan (nombre de serie y url de imagen) en nuestros propios arrays de nombres y urls, respectivamente.

  for (let i = 0; i < arrayShows.length ; i++ ) {
    
    nameServer.push(arrayShows[i].show.name);

    if (arrayShows[i].show.image){ // true
    
      arrayImageUrlServer.push(arrayShows[i].show.image.medium);

    } else { //false
    
      arrayImageUrlServer.push('https://via.placeholder.com/210x295/cccccc/666666/?text=TV');

    }

    //hago aquí un if que me compruebe Si hay algo guardado en localStorage 
    let isFavouriteClass = isContentAddedToLocalStorage(i, arrayShows);

    thingsToPaint += `
        <li class="list__element list__element${i} ${isFavouriteClass}">
            <img src="${arrayImageUrlServer[i]}" alt="${arrayShows[i].show.name}" class="elemet__image">
            <p class="element__name">${arrayShows[i].show.name}</p>
        </li>`; 
 
  }
 
  list.innerHTML = thingsToPaint;

  addListeners();
   
}

/**Función que comprueba si hay algo almacenado en localStorage
 *** Si hay algo almacenado: busca si el título de una serie está contenido en el local storage. Y nos añade un valor en la clase de favoritos.
 *** Si no hay nada almacenado: gaurdamos cadena vaciopara la clase favoritos.
 * Recibe como parámetros la posición del array y el array que devuelve la petición del server.
 * Devuelve el valor que debe tener la clase en el caso de que el dato revisado estén el array de favoritos.
 */

function isContentAddedToLocalStorage (i, arrayShows) {

  let isFavouriteClass = '';

  if (localStorage.getItem(keyLocalStorage)) { 
    
    let arrayLocalStorageData = JSON.parse(localStorage.getItem(keyLocalStorage));
    arrayFavourites = arrayLocalStorageData;

    isFavouriteClass = '';

    for (let j = 0; j < arrayLocalStorageData.length; j++) {
      if(arrayLocalStorageData[j].includes(arrayShows[i].show.name)){
        isFavouriteClass = 'list__element--favourite';
      } 
    }
    
  } else { //si no está en localStorage, no es favorito
    isFavouriteClass = '';
  }

  return isFavouriteClass;
}

/** Función con la que añadimos los listeners a los li que se hayan pintado */

function addListeners () {

  let listElements = document.querySelectorAll('.list__element');

  for (let i = 0; i < listElements.length; i++) {
    listElements[i].addEventListener('click', markFavourite);
  }

}

/** Función que marca como favorito (o desmarca) el li que se ha clickado. Además almacena (o elimina), en un array de favoritos, la url de su imagen y su título */

function markFavourite(ev) {
  let currentLi = ev.currentTarget;
  let infoCurrentLi;
  let toggle;
   
  toggle = currentLi.classList.toggle('list__element--favourite');
  
  infoCurrentLi = [currentLi.children[0].src, currentLi.children[1].innerHTML]; 

  if (toggle) {
    //si lo marco (y no está marcado): agregamelo al array
    arrayFavourites.push(infoCurrentLi);

  }else { //si lo desmarco: quitamelo del array
    
    //hay que encontrarlo en el array
    for ( let j = 0; j < arrayFavourites.length; j++) {
     
      //si en esa posición del arrayFav tenemos el titulo desclicado
      if (arrayFavourites[j].includes(infoCurrentLi[1])){ //true
        let arrayPosition = j;
        //borrarlo del array
        arrayFavourites.splice( arrayPosition, 1 );
      }
    } 
 
  } //fin del else
 
  addToLocalStorage(arrayFavourites);
}

  
/**Función que almacena datos en el LocalStorage */

function addToLocalStorage(data) {

  localStorage.setItem(keyLocalStorage, JSON.stringify(arrayFavourites));
}



searchButton.addEventListener('click', searchShow);