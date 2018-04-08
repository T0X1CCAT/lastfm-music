const Handlebars  = require('handlebars');

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
                    console.log(data);

                    let template = null;
                    let templateScript = null;
                    let context = null;
                    let html = null;

                    data.forEach( function(artist){
                        template = document.getElementById('artistTemplate').innerHTML;
                        templateScript = Handlebars.compile(template);
                        context = { "display_name" : artist.name, "image_url": artist.image ? artist.image : 'http://placeimg.com/150/150/notfound/grayscale'};
                        html = templateScript(context);
                        document.getElementById("insertHere").innerHTML += html;
                    });

                });
            }
        )
        .catch(function(err) {
            console.log('Fetch Error :-S', err);
        });
};



