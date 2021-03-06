const express = require('express');
const request = require('request');
const querystring = require('querystring');
const md5 = require('md5');
const xml2js = require('xml2js');
const parser = new xml2js.Parser();
const util = require('util');
const spotifyauth = require('./spotifyauth');
const spotifyartist = require('./spotifyartist');

const app = express();

//hand these through on the command line eg heroku or intellij
const api_key = process.env.API_KEY;
const client_secret = process.env.CLIENT_SECRET; // Your secret
const redirect_uri = process.env.CALLVACK_URL; // Your redirect uri
var port = process.env.PORT || 3000;


app.use(express.static(__dirname + '/../public'));



//this is how you can authenticate against last fm
app.get('/login', function(req, res) {

    // your application requests authorization
    res.redirect('https://last.fm/api/auth?' +
        querystring.stringify({
            api_key: api_key,
            cb: redirect_uri
        }));
});

//this is called by last fm after user authenticates
app.get('/callback', function(req, res) {

    // your application requests refresh and access tokens
    // after checking the state parameter

    var token = req.query.token || null;

    if (token === null) {
        res.redirect('/#' +
            querystring.stringify({
                error: 'state_mismatch'
            }));
    } else {

        //this is getting the session token needed for certain api calls
        const signed_call_string = 'api_key'+api_key+'methodauth.getSession'+'token'+token+client_secret;

        const signed_call = md5(signed_call_string);


        var options = {
            url: 'https://ws.audioscrobbler.com/2.0/?method=auth.getSession&' + querystring.stringify({
            api_key: api_key,
            token: token,
            api_sig: signed_call}),
            method: 'get'
        };
        console.log('url', options.url);
        function callback(error, response, body) {
            if (!error && response.statusCode == 200) {
                const xml = parser.parseString(body, function (err, result) {
                    console.dir(result.lfm.session[0].key[0]);
                });
                //const tokenResult = JSON.stringify(xml);
            }
        }

        request(options, callback);

    }
});

app.get('/artistInfo', (req, res) => {
    const artistName = req.query.name;

    const i = req.url.indexOf('?');
    const query = req.url.substr(i+1);
    const spotifyRequest = spotifyartist.getArtistsInfo(artistName);

    spotifyRequest.then((artistId) => {
            res.json({url: "spotify://artist/" + artistId});
        }).catch((error) => {
            res.json({error: 'no-artist'});

        });


});

//this gets the top artists for the user.
app.get('/myartists', function(req, res){

    const spotRequest = spotifyauth.getSpotifyClientCredentialsToken();
    spotRequest.then((token_data) => {
       console.log('token', token_data);
    });

    let lastfm_user = req.query.user;
    console.log('lastfm_user', lastfm_user);
    topArtistCallback = (error, response, body) =>{
        if (!error && response.statusCode == 200) {
            const xml = parser.parseString(body, function (err, result) {

                let artists = result.lfm.topartists[0].artist.map( (artist) => {
                    return ({name: artist.name[0], image: artist.image[2]._})
                });

                res.send(artists);
            });
        }
    }
    const topArtistsOptions = {
        url: `https://ws.audioscrobbler.com/2.0/?method=user.gettopartists&user=${lastfm_user}&api_key=`+api_key,
        method: 'get'
    };

    request(topArtistsOptions, topArtistCallback);


});

app.listen(port, function() {
    console.log('listening....', port);
});

