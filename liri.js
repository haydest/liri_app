require("dotenv").config();
var keys = require(keys.js);
var spotify = new Spotify(keys.spotify);

switch (process.argv[2]) {
    case ('concert-this' | 'concerts' | 'concert' | 'bands-in-town'):
    concert();
    break;

    case('spotify-this-song' | 'spotify' | 'song' | 'this-song'):
    spotify();
    break;

    case ('movie-this' | 'movie' | 'movies' | 'this-movie'):
    movie();
    break;

    case ('do-what-it-says'):
    command();
};

function spotify() {
    var song = process.argv[3];
    var spotifyURL = `${song}`

};

function concert() {

};

function movie() {

};

function command() {

};