const Handlebars  = require('handlebars');
const encodeurl = require('encodeurl');

getArtists = (user) =>  {
    fetch(`/myartists?${user}`)
        .then(
            function(response) {
                if (response.status !== 200) {
                    console.log('Looks like there was a problem. Status Code: ' +
                        response.status);
                    return;
                }

                // Examine the text in the response
                response.json().then(function(data) {

                    let template = null;
                    let templateScript = null;
                    let context = null;
                    let html = null;
                    let encodedArtistName = null;
                    data.forEach( function(artist){

                        encodedArtistName = convertAmpersand(artist.name);
                        encodedArtistName =encodeurl(encodedArtistName);
                        template = document.getElementById('artistTemplate').innerHTML;
                        templateScript = Handlebars.compile(template);

                        context = { "display_name" : artist.name,
                                    "image_url": artist.image ? artist.image : 'http://placeimg.com/150/150/notfound/grayscale',
                                    "artist_spotify_url": "getArtistUrl(\'"+encodedArtistName+"\')"};
                        html = templateScript(context);
                        document.getElementById("insertHere").innerHTML += html;
                    });

                });
            }
        )
        .catch(function(err) {
        });
};

convertAmpersand = (artistName) => {
    return artistName.replace('&', '%26');
};

getArtistUrl = (artistName) => {
    fetch('/artistInfo?name='+ artistName)
    .then((response) => {
        if (response.status !== 200) {
            console.log('Looks like there was a problem. Status Code: ' +
                response.status);
            return;
        }

        // Examine the text in the response
        response.json().then(function( spotify_artist_url) {
            if(spotify_artist_url.url) {
                window.location = `${spotify_artist_url.url}`;
            }else {
                alert('artist prolly not in spotify', artistName);

            }
        });
    })
    .catch(function(err) {
    });
};




