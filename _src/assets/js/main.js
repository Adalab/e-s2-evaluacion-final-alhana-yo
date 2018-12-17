'use strict';

const inputName = document.querySelector('.search__name');
const searchButton = document.querySelector('.search__button');
const list = document.querySelector('.list');
let arrayFavourites = [];
const keyLocalStorage = 'Favourite TV Shows';
/*let arrayObjectsSeries = []; //array donde almaceno mis nuevos objetos*/


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
  const questName = inputName.value; //guardamos el valor que escribe el usuario
  const url = `http://api.tvmaze.com/search/shows?q=${questName}`;

  return url;
}

/** Función que hace la búsqueda de los datos que necesitamos , en la respuesta que nos da el fetch y que los pinta en el html
*/
function paintData (arrayShows) {

  let nameServer = [];
  let arrayImageUrlServer = [];
  let thingsToPaint = '';
  let isFavouriteClass = '';

  //recorremos el array de resultados que nos devuelve la petición y almacenamos los resultados que nos interesan (nombre de serie y url de imagen) en nuestros propios arrays de nombres y urls, respectivamente.

  for (let i = 0; i < arrayShows.length ; i++ ) {
    
    nameServer.push(arrayShows[i].show.name);
  /* ESto hace lo mismo que el if
    const url = arrayShows[i].show.image && arrayShows[i].show.image.medium || 'https://via.placeholder.com/210x295/cccccc/666666/?text=TV';
    arrayImageUrlServer.push(url);
    */


    if (arrayShows[i].show.image){ // true
    
      arrayImageUrlServer.push(arrayShows[i].show.image.medium);

    } else { //false
    
      arrayImageUrlServer.push('https://via.placeholder.com/210x295/cccccc/666666/?text=TV');

    }

   
  
    
    //hago aquí un if que me compruebe Si hay algo guardado en localStorage 

    if (localStorage.getItem(keyLocalStorage)) { 
    
      //me bajo el contenido del LocalStorage a un array y con el método includes, compruebo si ese array (del Local Storage) contiene el nombre que acaban de cargar en la lista
      let arrayLocalStorageData = JSON.parse(localStorage.getItem(keyLocalStorage));
      arrayFavourites = arrayLocalStorageData;
  
      console.log('viendo lo que tengo en el array en el que me bajo el contenido del localStorage',arrayLocalStorageData);
      isFavouriteClass = '';
      for (let j = 0; j < arrayLocalStorageData.length; j++) {
        if(arrayLocalStorageData[j].includes(arrayShows[i].show.name)){

          console.log('ya está almacenado en el Local Storage');
    
          isFavouriteClass = 'list__element--favourite';
        } 
      }
      
    } else { //si no está en localStorage, no es favorito
      isFavouriteClass = '';
    }

    thingsToPaint += `
        <li class="list__element list__element${i} ${isFavouriteClass}">
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

  console.log('toggle', toggle);

  if (toggle) {
  //si lo marco (y no está marcado): agregamelo al array
    arrayFavourites.push(infoCurrentLi);

  }else { //si lo desmarco: quitamelo del array
    
    //hay que encontrarlo en el array

     
    for ( let j = 0; j < arrayFavourites.length; j++) {
      /*
      console.log('iteración',j);
      console.log('¿incluye el título que he desclcado?', arrayFavourites[j].includes(infoCurrentLi[1]));*/
     
      console.log('valor en esa iteración',arrayFavourites[j]);

      //si en esa posición del arrayFav tenemos el titulo desclicado
      if (arrayFavourites[j].includes(infoCurrentLi[1])){ //true
        let arrayPosition = j;
        //console.log('posición del array que contiene el titulo', arrayPosition);
        //borrarlo del array
        arrayFavourites.splice( arrayPosition, 1 );
      }
      // const favouriteIndexToEliminate = arrayFavourites.indexOf(infoCurrentLi[1]);
      // if (favouriteIndexToEliminate >= 0) {
      //   arrayFavourites.splice( favouriteIndexToEliminate, 1 );
      // }
      
    } 
 
  } //fin del else
  console.log('array favoritos al final del metodo', arrayFavourites);

  addToLocalStorage(arrayFavourites);
}

  
/**Función que almacena datos en el LocalStorage */

function addToLocalStorage(data) {

  //Si hay datos guardados en localStorage

  //si no hay datos guardados, los guardo
  localStorage.setItem(keyLocalStorage, JSON.stringify(arrayFavourites));
}



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