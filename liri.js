require("dotenv").config();
var keys = require(keys.js);
var spotify = new Spotify(keys.spotify);

switch (process.argv) {
    case ('concert-this'):
    concert();
    break;

    case("spotify-this-song"):
    spotify();
    break;

    case ('movie-this'):
    movie();
    break;

    case ('do-what-it-says'):
    command();
};