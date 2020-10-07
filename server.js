const express = require('express')
const app = express()

var cors = require('cors');
app.use(cors());

var mongoose = require('mongoose');
mongoose.set('useCreateIndex', true);

const port = 8080

app.use(express.json())
app.use(express.urlencoded({
    extended: true
}))

app.use(express.static('public'));

var db = require('./config/db');
console.log("connecting--",db);
mongoose.connect(db.url);

var Artist = require('./app/models/artist');

app.get("/", function (request, response) {
    response.sendFile(__dirname + '/views/index.html');
});

 app.get('/single', (req, res) => {

    let artist = req.query.id;

    Artist.find({
        $text: {
            $search: artist
        }
    }, function(err, result) {
        if (err) throw err;
        if (result) {
            res.json(result)
        } else {
            res.send(JSON.stringify({
                error : 'Error'
            }))
        }
    })
});

app.post('/api/artists/send', function (req, res) {
    var artist = new Artist();
    artist.artist = req.body.artist;
    artist.name = req.body.name;
    artist.aci = req.body.aci;
    artist.timestamp = req.body.timestamp;
    artist.save(function(err) {
       if (err)
          res.send(err);
          res.json({ message: 'artist created!' });
    });
 });

 //spotify
 var SpotifyWebApi = require('spotify-web-api-node');

var spotifyApi = new SpotifyWebApi({
    clientId: '3f03adf3c3ff44c19241dc261776dfb2',
    clientSecret: '8fe17622b35c43e5883199304e926d0e',
});

spotifyApi.clientCredentialsGrant()
    .then(function (data) {
        console.log('The access token expires in ' + data.body['expires_in']);
        console.log('The access token is ' + data.body['access_token']);

        // Save the access token so that it's used in future calls
        spotifyApi.setAccessToken(data.body['access_token']);
    }, function (err) {
        console.log('Something went wrong when retrieving an access token', err.message);
    });

app.get("/", function (req, res) {
    res.sendFile(__dirname + '/views/index.html');
});

app.get('/artist', (req, res) => {

    let artistId = req.query.id;
    //2hazSY4Ef3aB9ATXW7F5w3
    spotifyApi.getArtist(artistId)
        .then(function (data) {
            var rank = parseInt(data.body.popularity) * parseInt(data.body.followers.total);
            res.send(data.body);
        }, function (err) {
            console.error(err);
        });
});

app.get('/search', (req, res) => {
    let artistName = req.query.name;
    spotifyApi.searchArtists(artistName)
        .then(function (data) {
            res.send(data.body);
        }, function (err) {
            console.error(err);
        });
    });
    
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})