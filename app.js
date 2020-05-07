require('dotenv').config();

const express = require('express');
const hbs = require('hbs');
// require spotify-web-api-node package here:
const SpotifyWebApi = require('spotify-web-api-node');



const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

// setting the spotify-api goes here:

const spotifyApi = new SpotifyWebApi({
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET
});

// Retrieve an access token
spotifyApi
  .clientCredentialsGrant()
  .then(data => spotifyApi.setAccessToken(data.body['access_token']))
  .catch(error => console.log('Something went wrong when retrieving an access token', error));

// Our routes go here:

app.get('/', (request, response) => {
  response.render('home');
});

app.get('/artist-search', (request, response) => {
  const artistSearchTerm = request.query.artistSearchTerm;
  //console.log('Received from form:', artistSearchTerm);
  spotifyApi
    .searchArtists(artistSearchTerm)
    .then(data => {
      //console.log('The received data from the API: ', data.body.artists.items);
      // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
      const artistSeachResults = data.body.artists.items
      //console.log('The received data from the API: ', artistSeachResults);
      //console.log('The received images from the API: ', data.body.artists.items[0]);
      response.render('artist-search-results', { results: artistSeachResults });
    })
    .catch(err => console.log('The following error occurred while searching artists: ', err));
});

app.get('/albums/:artistId', (request, response, next) => {
  const artistId = request.params.artistId
  //console.log('Received artistId from form:', artistId);
  spotifyApi
    .getArtistAlbums(artistId)
    .then(data => {
      //console.log('The received data from the API: ', data.body.items);
      // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
      const albumSeachResults = data.body.items
      //console.log('The received data from the API: ', artistSeachResults);
      //console.log('The received images from the API: ', data.body.artists.items[0]);
      response.render('albums', { results: albumSeachResults });
    })
    .catch(err => console.log('The following error occurred while searching albums: ', err));
    
  // .getArtistAlbums() code goes here
});


app.get('/tracks/:albumId', (request, response, next) => {
  const albumId = request.params.albumId
  console.log('Received albumId from form:', albumId);
  spotifyApi
    .getAlbumTracks(albumId)
    .then(data => {
      console.log('The received track data from the API: ', data.body.items);
      // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
      const trackSeachResults = data.body.items
      //console.log('The received data from the API: ', artistSeachResults);
      //console.log('The received images from the API: ', data.body.artists.items[0]);
      response.render('album-tracks', { results: trackSeachResults });
    })
    .catch(err => console.log('The following error occurred while searching albums: ', err));
    
  // .getArtistAlbums() code goes here
});


app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
