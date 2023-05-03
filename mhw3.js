let token;


function onTokenResponse(response)
{
    console.log('Risposta ricevuta');
    return response.json();
}



function onTokenJson(json)
{
    console.log(json);
    token = json.access_token;
}



// OAuth credentials --- NON SICURO!
const client_id = 'd4c860fba30d49e5ad6cce24a046379b';
const client_secret = '5174c572bd624d8588ce342797b766a4';

// All'apertura della pagina, richiediamo il token
fetch("https://accounts.spotify.com/api/token",
	{
   method: "post",
   body: 'grant_type=client_credentials',
   headers:
   {
    'Content-Type': 'application/x-www-form-urlencoded',
    'Authorization': 'Basic ' + btoa(client_id + ':' + client_secret)
   }
  }
).then(onTokenResponse).then(onTokenJson);



function onResponse(response)
{
    console.log('Richiesta ricevuta');
    return response.json();
}



function onJsonSpotify(json)
{
    console.log('JSON ricevuto');
    console.log(json);
    
    // Svuotiamo la libreria
    const page = document.querySelector('#page-view');
    page.innerHTML = '';
    


    // Leggi il numero di risultati
    const results = json.albums.items;
    let num_results = results.length;
    

    // Processa ciascun risultato
    for(let i=0; i<num_results; i++)
    {
        // Leggi il documento
        const album_data = results[i]



    // Leggiamo info
    const title = album_data.name;
    const selected_image = album_data.images[0].url;
    
    // Creiamo il div che conterrà immagine e didascalia
    const album = document.createElement('div');
    album.classList.add('album');
    
    // Creiamo l'immagine
    const img = document.createElement('img');
    img.src = selected_image;
    
    // Creiamo la didascalia
    const caption = document.createElement('span');
    caption.textContent = title;
    
    // Aggiungiamo immagine e didascalia al div
    album.appendChild(img);
    album.appendChild(caption);
    
    // Aggiungiamo il div alla libreria
    page.appendChild(album);
    }
}










const API_KEY = 'k_64j467tl';

function onJsonMovie(json)
{
    console.log(json);
    const movie = document.querySelector('#movie');
    movie.innerHTML = '';
    const movie_json = json.results[0];
    const title = document.createElement('h2');
    const year = document.createElement('h1');
    const img = document.createElement('img');
    title.textContent = movie_json.title;
    year.textContent = movie_json.description;
    img.src = movie_json.image;
    movie.appendChild(title);
    movie.appendChild(year);
    movie.appendChild(img);
    const url = 'https://imdb-api.com/en/API/MetacriticReviews/' + API_KEY + '/' + movie_json.id;
    fetch(url).then(onResponse).then(onJsonMovieDescription);
}

function onJsonMovieDescription(json)
{
    console.log(json);
    const movie = document.querySelector('#movie');
    const movie_json = json.items[0];
    const author = document.createElement('h1');
    const description = document.createElement('p');
    author.textContent = movie_json.author;
    description.textContent = '"' + movie_json.content + '"';
    movie.appendChild(author);
    movie.appendChild(description);
}










function movieSearch(event)
{
    event.preventDefault();
    const movie_input = movie_form.querySelector('#movie_text');
    const movie_value = encodeURIComponent(movie_input.value);
    console.log('Cerco: ' + movie_value);
    const url = 'https://imdb-api.com/en/API/SearchMovie/' + API_KEY + '/' + movie_value;
    console.log('URL: ' + url);
    fetch(url).then(onResponse).then(onJsonMovie);
}






function spotifySearch(event)
{
    event.preventDefault();
    const album_input = spotify_form.querySelector('#album_text');
    const album_value = encodeURIComponent(album_input.value);
    console.log('Cerco: ' + album_value);
    const url = 'https://api.spotify.com/v1/search?type=album&q=' + album_value;
    console.log('URL: ' + url);
    fetch(url,
    {
        headers: {
            'Accept': 'application/vnd.api+json',
            'Authorization': 'Bearer ' + token,
            'Content-Type': 'application/x-wwwform-urlencoded'
        }
    }).then(onResponse).then(onJsonSpotify);
}










const movie_form = document.querySelector('#movie_form');
const spotify_form = document.querySelector('#spotify_form');



movie_form.addEventListener('submit', movieSearch);
spotify_form.addEventListener('submit', spotifySearch);










function onMovieClick(event)
{
    console.log('Scelto film');
    purge();
    const movie_form = document.querySelector('#movie_form');
    movie_form.classList.remove('hidden');
    movie_reset.classList.remove('hidden');
}






function onSpotifyClick(event)
{
    console.log('Scelto album');
    purge();
    const spotify_form = document.querySelector('#spotify_form');
    spotify_form.classList.remove('hidden');
    spotify_reset.classList.remove('hidden');
}






function purge()
{
    const movie = document.querySelector('#movie_box');
    const spotify = document.querySelector('#spotify_box');
    const movie_form = document.querySelector('#movie_form');
    const spotify_form = document.querySelector('#spotify_form');
    const question = document.querySelector('#question');
    movie.classList.add('hidden');
    spotify.classList.add('hidden')
    question.classList.add('hidden');
    movie_form.classList.add('hidden');
    spotify_form.classList.add('hidden')
}






function onMovieResetClick(event)
{
    const movie = document.querySelector('#movie');
    movie.innerHTML = '';
    movie_reset.classList.add('hidden');
    onSpotifyClick();
}

function onSpotifyResetClick(event)
{
    const movie = document.querySelector('#movie');
    movie.innerHTML = '';
    spotify_reset.classList.add('hidden');
    onMovieClick();
}



const movie_box = document.querySelector('#movie_box div');
const spotify_box = document.querySelector('#spotify_box div');
const movie_reset = document.querySelector('#movie_reset');
const spotify_reset = document.querySelector('#spotify_reset');

movie_box.addEventListener('click', onMovieClick);
spotify_box.addEventListener('click', onSpotifyClick);
movie_reset.addEventListener('click', onMovieResetClick);
spotify_reset.addEventListener('click', onSpotifyResetClick);