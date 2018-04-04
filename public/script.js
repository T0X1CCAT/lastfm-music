(function(){
    fetch('/myartists')
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

                    var template = null;
                    var templateScript = null;
                    var context = null;
                    var html = null;

                    data.forEach( function(artist){
                        template = document.getElementById('artistTemplate').innerHTML;
                        templateScript = Handlebars.compile(template);
                        context = { "display_name" : artist.name, "image_url": artist.image};
                        html = templateScript(context);
                        document.getElementById("insertHere").innerHTML += html;
                    });

                });
            }
        )
        .catch(function(err) {
            console.log('Fetch Error :-S', err);
        });
}());


