var spotifyauth = require('./spotifyauth');
const axios = require('axios');

const getArtistInfo = function(name) {
    let token = spotifyauth.spotifyToken;
    const prom = new Promise(function(res, rej) {
        if(token == null){
            spotifyauth.getSpotifyClientCredentialsToken()
                .then(function(token) {
                    querySpotifyForArtist(name, token)
                        .then(function(response){
                            if(response.data.artists.items[0]){
                                res(response.data.artists.items[0].id);
                            }else{
                                rej(new Error('no-artist'));
                            }

                        });
                });
        }else {
            return querySpotifyForArtist(name, token)
                .then((response) =>{
                    if(response.data.artists.items[0]){
                        res(response.data.artists.items[0].id);
                    }else{
                        rej(new Error('no-artist'));
                    }
                });
        }
    });
    return prom;

};

const querySpotifyForArtist = (name, token) => {
    const headers = {
        'Authorization': 'Bearer '+token
    };

    return axios.get('https://api.spotify.com/v1/search',
        {headers: headers,
        params:
        {
            q: 'artist:' + name,
            type : 'artist'
        }});

    };


module.exports.getArtistsInfo = getArtistInfo;
