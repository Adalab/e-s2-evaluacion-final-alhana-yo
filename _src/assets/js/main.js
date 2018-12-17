'use strict';

const inputName = document.querySelector('.search__name');
const searchButton = document.querySelector('.search__button');
const list = document.querySelector('.list');
let arrayFavourites = [];
/*let arrayObjectsSeries = []; //array donde almaceno mis nuevos objetos*/

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
  const questName = inputName.value; //guardamos el valor que escribe el usuario
  const url = `http://api.tvmaze.com/search/shows?q=${questName}`;

  return url;
}

/** Función que hace la búsqueda de los datos que necesitamos , en la respuesta que nos da el fetch y que los pinta en el html*/

function paintData (arrayShows) {

  let nameServer = [];
  let arrayImageUrlServer = [];
  let thingsToPaint;

  //recorremos el array de resultados que nos devuelve la petición y almacenamos los resultados que nos interesan (nombre de serie y url de imagen) en nuestro propio array de objetos series

  for (let i = 0; i < arrayShows.length ; i++ ) {
    
    nameServer.push(arrayShows[i].show.name);

    if (arrayShows[i].show.image){ // true
    
      arrayImageUrlServer.push(arrayShows[i].show.image.medium);

    } else { //false
    
      arrayImageUrlServer.push('https://via.placeholder.com/210x295/cccccc/666666/?text=TV');

    }
  
    /**creo mi objeto, dentro de la posición i de mi array de objetos 
      createShow(nameServer,arrayImageUrlServer);
    */

             
    thingsToPaint += `
            <li class="list__element list__element${i}">
                <img src="${arrayImageUrlServer[i]}" alt="${arrayShows[i].show.name}" class="elemet__image">
                <p class="element__name">${arrayShows[i].show.name}</p>
            </li>`;  
 
  }
  /*console.log('nombre de la serie', nameServer);
  console.log('url de imagen', arrayImageUrlServer);
  console.log('lis almacenados', thingsToPaint);*/
  list.innerHTML = thingsToPaint;

  addListeners();
    
}

/** Función con la que añadimos los listeners a los li que se hayan pintado */

function addListeners () {

  let listElements = document.querySelectorAll('.list__element');

  for (let i = 0; i < listElements.length; i++) {
    listElements[i].addEventListener('click', favourite);
  }

}

/** Función que marca como favorito (o lo desmarca) el li que se ha clickado. Además almacena en un array la url de su imagen y su título */
function favourite(ev) {
  let currentLi = ev.currentTarget;
  let infoCurrentLi;
  let toggle;
      
  toggle = currentLi.classList.toggle('list__element--favourite');
  
  for ( let i = 0; i < currentLi.children.length-1; i++) {
      
    infoCurrentLi = [currentLi.children[i].src, currentLi.children[i+1].innerHTML]; 
        
  }

  //si lo marco: agregamelo al array
  arrayFavourites.push(infoCurrentLi);

  //console.log('el array del current', infoCurrentLi);
  //console.log ('el array global', arrayFavourites);
  console.log('toggle', toggle);

  
  if (!toggle) {
    //si lo desmarco: quitamelo del array
    
    console.log('lo incluye borraloooo', arrayFavourites);

    //Necesito el valor de lo que se ha seleccionado 
    //encontrarlo en el array
    //borrarlo del array
  } 
}

  
/**Función que nos devuelve los valores del currentTarget */



/*
** Función que crea un objeto de tipo Show 
 * parametros: 
 *  name: string, nombre de la serie
 *  image: array de strings, con dos urls distintas
*

function favouriteTvShow( name, image) {
  this.name = name;
  this.imageURL = image;
      
}

**Función que crea un objeto y lo guarda en el array de objetos 
 * recibe por parámetro el nombre que nos da el server y el array de URLs que nos da el server
*
function createNewShow( nombreDelServer, arrayUrlsImageServer) {
  
  let tvShow = new favouriteTvShow(nombreDelServer, arrayUrlsImageServer);
  arrayObjectsSeries.push(tvShow);
   
}
*/



searchButton.addEventListener('click', searchShow);


