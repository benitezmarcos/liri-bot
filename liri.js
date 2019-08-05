
// our local environmental config file - gitignored
require("dotenv").config();

// gitignored keys for apis
var keys = require("./keys.js");

// axios required for calls to the various API's
const axios = require("axios");

// node-spotify-api for search and request methods 
var Spotify = require("node-spotify-api");

// file system interaction package
const fs = require("fs");

// moment npm for date formatting
var moment = require("moment");

//create spotify object with keys linked
var spotify = new Spotify(keys.spotify);

//color for terminal output
var colors = require('colors');





//spotify-this-song
//spotify
function spotifyThisSong(songName) {
    //* If no song is provided then your program will default to "The Sign" by Ace of Base.
    if (songName === "") {
        songName = "The Sign Ace of Base";
    }

    spotify.search(
        {
            type: "track",
            query: songName,
            limit: 3
        },
        function (err, data) {
            if (err) {
                console.log(" ERROR! Try Again? ".rainbow + error);
                return;
            }

            var songs = data.tracks.items;

            for (var i = 0; i < songs.length; i++) {
                console.log("➽  ".yellow + i);
                console.log("Artist: ".red + songs[i].artists.map(artistName));
                console.log("Song name: ".white + songs[i].name.cyan);
                console.log("Preview song: ".green + songs[i].preview_url);
                console.log("Album: " + songs[i].album.name.blue);
                console.log("♫♪♫".green);
            }
        }
    );
};//end spotifyThis

//get name of artist
var artistName = function (artist) {
    return artist.name;
};

//concert-this

function getThisBand(artist) {

    var bandURL = "https://rest.bandsintown.com/artists/" + artist + "/events?app_id=codingbootcamp";
    axios.get(bandURL)
        .then(function (response) {

            var bandData = response.data;

            if (!bandData.length) {
                console.log("No info for this Artist: ".red + artist.red);
                return;
            }


            for (var i = 0; i < bandData.length; i++) {
                var show = bandData[i];

               
                console.log("➽  ".yellow + i);
                console.log(show.venue.city.cyan +
                    "," +
                    (show.venue.region || show.venue.country).blue +
                    " at " +
                    show.venue.name.yellow +
                    " " +
                    moment(show.datetime).format("MM/DD/YYYY").magenta
                );

                // add a line to a lyric file, using appendFile
                fs.appendFile('empirestate.txt', '\nRight there up on Broadway', (err) => {  
                    if (err) throw err;
                    console.log('The lyrics were updated!');
                });


            }
        }).catch(function (error) {
            console.log("Unknown command or band.".red);
        });
}; 


//movie-this

function movieThis(movie) {

    //default movie = Mr Nobody
    
    if (movie === "") {
        movie = "Mr Nobody";
    }

    var omdbURL = "http://www.omdbapi.com/?t=" + movie + "&y=&plot=short&tomatoes=true&apikey=trilogy";

    axios.get(omdbURL).then(
        function (response) {
            var movieData = response.data;


            console.log("\nYou searched for: ".green + movieData.Title.yellow);
            console.log("Made in: ".green + movieData.Year);
            console.log("Rated: ".green + movieData.Rated.blue);
            console.log("IMDB Rating: ".green + movieData.imdbRating.yellow);
            console.log("Country: ".green + movieData.Country.america);
            console.log("Language: ".green + movieData.Language.magenta);
            console.log("Plot: ".green + movieData.Plot.white);
            console.log("Actors: ".green + movieData.Actors.magenta);
            console.log("Rotten Tomatoes: ".red + movieData.Ratings[1].Value);
        }).catch(function (error) {
            console.log("Sorry unknown movie\n");
        });
};

//do-what-it-says

//get spotify-this-song <song> from file

function doWhatItSays() {
    fs.readFile("random.txt", "utf8", function (err, data) {

        console.log("Song from File: " + data);

        var dataSplit = data.split(",");

        if (dataSplit.length === 2) {
            userChoice(dataSplit[0], dataSplit[1]);
        } else if (dataSplit.length === 1) {
            userChoice(dataSplit[0]);
        }
    })


};








function userChoice(caseData, functionData) {
    switch (caseData) {
        case "concert-this":
            getThisBand(functionData);
            break;
        case "spotify-this-song":
            spotifyThisSong(functionData);
            break;
        case "movie-this":
            movieThis(functionData);
            break;
        case "do-what-it-says":
            doWhatItSays();
            break;
        default:
            console.log("\n  No Command entered: ".red);
    }
};

function getChoice(argOne, argTwo) {
    userChoice(argOne, argTwo);
};

getChoice(process.argv[2], process.argv.slice(3).join(" "));