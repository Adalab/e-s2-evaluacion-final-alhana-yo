'use strict';

/** url de petición de búsqueda al servidor:
 * http://api.tvmaze.com/search/shows?q=
 */

const inputName = document.querySelector('.search__name');
const searchButton = document.querySelector('.search__button');

function searchShow() {
  
  //let arrayShow;

  let url = giveURL();
  let arrayObjectsSeries = [];
  let objectSerie = {
    name: 'pruebaNombre',
    imageUrl:'pruebaUrl',

  };

  
  fetch(url)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      
      let arrayShows = data;
      let nameServer;
      let arrayImageUrlServer;

      //recorremos el array de resultados que nos devuelve la petición

      for (let i = 0; i < arrayShows.length ; i++ ) {
        console.log('contenido de data en cada iteración', arrayShows[i]);
        nameServer = arrayShows[i].show.name;

        console.log('nombre de la serie', nameServer);

        //y almacenamos los resultados que nos interesan (nombre de serie y url de imagen) en nuestro propio array de objetos series
        for ( let j = 0; j < arrayShows.length ; j++) {
          
          arrayImageUrlServer = arrayShows[i].show.image;
          
          console.log('url de imagen', arrayImageUrlServer);

        }


        //objectSerie.name = 

      }
      
    


    });


}

/**Función que nos devuelve la URL con la búsqueda que quiere hacer el usuario
 * devuelve la URL
 */
function giveURL() {
  const questName = inputName.value; //guardamos el valor que escribe el usuario
  console.log('nombre que da el usuario', questName);

  const url = `http://api.tvmaze.com/search/shows?q=${questName}`;

  console.log('url de bśuqueda', url);

  return url;

}


searchButton.addEventListener('click', searchShow);


