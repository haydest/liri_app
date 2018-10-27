const result = require('./.env').config();
const keys = require('./keys.js');
const inquirer = require('inquirer');
const axios = require('axios');
const Spotify = require('node-spotify-api');
const spotify = new Spotify(keys.spotify);
const moment = require('moment');
const fs = require('fs');

if (result.err) {
    throw result.err
};

inquirer.prompt([
  {
    type: 'list',
    name: 'searchParams',
    message: 'what would you like to search for?',
    choices: [{
      name: 'get info about a song'
    },
    {
      name: 'get info about a movie'
    },
    {
      name: 'get info about a concert'
    },
    {
      name: 'DO WHAT IT SAYS'
    },
    ]}]).then(answers => {

    switch (answers.menuChoice) {
      case 'get info about a song':
        inquirer.prompt([
        {
          type: 'input',
          name: 'songSearch',
          message: 'what song would you like to search for?'
        }
        ]).then(response => {
          spotifySearch(response.songSearch)
        })
        break;

        case 'get info about a movie':
          inquirer.prompt([
          {
            type: 'input',
            name: 'movieSearch',
            message: 'what movie would you like to search for?'
          }]).then(response => {
            movieSearch(response.movieSearch)
          })
        break;
        
        case 'get info about a concert':
          inquirer.prompt([
          {
            type: 'input',
            name: 'artistSearch',
            message: 'what artist would you like to search for?'
          }]).then(response => {
                eventSearch(response.artistSearch)
          })
          break;
        
          case 'DO WHAT IT SAYS':
            whatItSays();
            break;
    }
}).catch(err => {
    console.log(err)
});

function spotifySearch(song) {
  if (!song || song == '') {
    song = 'The Sign'
  }
  spotify.search({
    type: 'track',
    query: song,
    limit: 3
  }).then(function (response) {
    let tracks = response.tracks.items;
    tracks.forEach(element => {
      songInfo = {}
      element.artists.forEach(element => {
      songInfo.artists = element.name
      });

      songInfo.album_name = element.album.name
      songInfo.songtitle = element.name
      songInfo.urlpreview = element.external_urls.spotify
      console.log(songInfo)
    });
  }).catch(function (err) {
      console.log(err);
    })
};

function movieSearch(movie) {
  if (!movie || movie == '') {
    movie = 'cinema paradiso'
  }

  var movieUrl = `http://www.omdbapi.com/?apikey=trilogy&t=${movie}&type=movie`;
  var movieInfo = {};

  axios.get(movieUrl)
    .then(response => {
      if (response.data.Response === 'False') {
        console.log(response.data.err)
      }
      else {
        console.log(response.data)
        movieInfo.title = response.data.Title;
        movieInfo.year = response.data.Year;
        movieInfo.imdbRating = response.data.imdbRating;

        response.data.Ratings.forEach(element => {
          if (element.Source === 'Rotten Tomatoes') {
            movieInfo.rtRating = element.Value;
          }
        });

        movieInfo.country = response.data.Country;
        movieInfo.language = response.data.Language;
        movieInfo.plot = response.data.Plot;
        movieInfo.actors = response.data.Actors;
        console.log(movieInfo);
      }
    }).catch(err => {
      console.log(err);
    })};

function eventSearch(artist) {
  if (!artist || artist == '') {
    artist = 'paris hilton';
  }
  artistUrl = `https://rest.bandsintown.com/artists/${artist}/events?app_id=codingbootcamp&date=upcoming`;
  eventInfo = {};

  axios.get(artistUrl)
    .then(response => {
      if (response.data.includes('err')) {
        console.log('There was an err while searching for this concert event')
      } 
      else {
        console.log(response.data);
        response.data.forEach(element => {
          eventInfo.artist = element.lineup[0];
          eventInfo.venueName = element.venue.name;

      if (element.venue.region === '') {
        delete eventInfo.region;
      } 
      else eventInfo.region = element.venue.region;
        eventInfo.city = element.venue.city;
        eventInfo.date = moment(element.venue.datetime).format('L');
        console.log(eventInfo);
        })
      };
    }).catch(err => {
      console.log(err);
      })};

function whatItSays() {
  fs.readFile('random.txt', 'utf8', (err, data) => {
    if (err) {
      console.log(err)
    }
    else {
      console.log(data);
      addData = data.split(',');

    for (var count = 0; count <= addData.length - 1; count++) {
      if (addData[count].includes('spotify')) {
        spotifySearch(addData[count + 1]);
        count++;
      }
      else if (addData[count].includes('movie')) {
        movieSearch(addData[count + 1]);
        count++;
      } else if (addData[count].includes('concert')) {
        eventSearch(addData[count + 1]);
        count++;
      }
    };
    };
  });
};