const axios = require('axios');
const base64 = require('base-64');
var token = null;

/**
 * nice example of how to use Promises and especially Promise.resolve(). Regardless of whether we have the spotify
 * token already the calling code is the same (see index.js)
 * @returns {*}
 */
getSpotifyClientCredentialsToken = () => {

    const spotify_clientid = process.env.SPOTIFY_CLIENT_ID;
    const spotify_client_secret = process.env.SPOTIFY_CLIENT_SECRET;
    if (token === null){
        //request client credentials token ;
        const auth = base64.encode(spotify_clientid + ':' + spotify_client_secret);
        const headers = {
            'Authorization': 'Basic '+auth
        };
        return axios.post('https://accounts.spotify.com/api/token?grant_type=client_credentials',
            null,
            {"headers": headers})
            .then((response) =>{
                token = response.data.access_token;
                module.exports.spotifyToken = token;
                return Promise.resolve(token);
            })

    }else {
        return Promise.resolve(token);
    }

};
module.exports.getSpotifyClientCredentialsToken = getSpotifyClientCredentialsToken;
module.exports.spotifyToken = token;
