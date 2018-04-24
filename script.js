const titleBox = document.querySelector("#title");
const authorBox = document.querySelector("#author");
const submitButton = document.querySelector("#button");
const parentDiv = document.querySelector("#parent");

submitButton.addEventListener('click', e => {
    if (titleBox.value.length > 1) {
        getBooksAndGifs(titleBox.value, authorBox.value);
    } else {
        parentDiv.innerHTML = "Please enter a title query.";
    }
    
});

function getBooksAndGifs(titleQuery, authorQuery) {
    parentDiv.innerHTML = "Loading...";
    fetch(`https://www.googleapis.com/books/v1/volumes?q=${titleQuery}+inauthor:${authorQuery}&key=AIzaSyCI4ZK774sY9aOofAIPkfo2FnAcE-NMuE0`)
    .then(function(data) {
        return data.json();
    }).then(function(json){
        let gifs = [];
        fetch(`https://api.giphy.com/v1/gifs/search?api_key=bUcqXpfbxgQvjT33mQ7ZPfhWhpaKODLA&q=${titleQuery}&limit=${json.items.length}&offset=0&rating=G&lang=en`)
        .then(function(data) {
          return data.json()
        })
        .then(function(GIFjson) {
            for (let i = 0; i < json.items.length; i++) {
                let url = GIFjson.data[i].images.original.url;
                gifs.push(url);
            }
            return gifs;
        }).then(function(gifs) {
            printBooks(json, gifs)
        });
        ;
    });
}

function printBooks(json, gifs) {
    parentDiv.innerHTML = "";
    
    for (let j = 0; j < json.items.length; j++) {
        let book = json.items[j];
        
        // Get title
        let title = book.volumeInfo.title;
        
        // Get author
        let author = "";
        let authorArray = book.volumeInfo.authors;
        if (authorArray.length === 1) {
            author = authorArray[0];
        } else {
            for (let i = 0; i < authorArray.length; i++) {
                if (i > 0) author += ", ";
                author += authorArray[i];
            }
        }
        
        // Get summary
        let summary = book.volumeInfo.description;
        
        // Get link
        let linkURL = book.volumeInfo.infoLink;
        
        // Create HTML for Materialize card
        let html = '<div class="card">';
        html += '<div class="card-image waves-effect waves-block waves-light">';
        html += `<img class="activator" src="${gifs[j]}">`;
        html += '</div>';
        html += '<div class="card-content">';
        html += `<span class="card-title activator grey-text text-darken-4">${title}<i class="material-icons right">more_vert</i></span>`;
        html += `<p>${author}</p>`
        html += '</div>';
        html += '<div class="card-reveal">';
        html += `<span class="card-title grey-text text-darken-4">${title}<i class="material-icons right">close</i></span>`;
        html += `<p>${summary}</p>`;
        html += `<p><a href="${linkURL}">Read more</a>`;
        html += "</div>";
        html += "</div>";
        
        // Append HTML to parent div
        parentDiv.innerHTML += html;
    }
}
