
// Function that randomises GIF on main page before using search

async function getRandomGif() {
    var response = await fetch(`https://api.giphy.com/v1/gifs/search?q=wdym&api_key=[GIPHYAPI]`);
    var data = await response.json();

    var randomIndex = Math.floor(Math.random() * data.data.length);
    var randomGif = data.data[randomIndex];

    return randomGif.images.original.url;

}

async function displayGif() {
    var gifUrl = await getRandomGif();
    var randomGifElement = document.getElementById('gif');
    randomGifElement.src = gifUrl;

}

getRandomGif()
displayGif();

// Display Results Functions


function search() {
    var searchTerm = $('#searchInput').val();

    if (!searchTerm) {
        alert('Please enter a search term.');
        return;
    }

    $.when(
        fetchUrbanDictionaryResults(searchTerm),

    ).done(function (urbanDictionaryResults) {

        $('#randomGif').hide();
        $('#urbanDictionaryResults').show();

        displayResultsUrban('urbanDictionaryResults', 'Urban Dictionary', urbanDictionaryResults.list);

    }).fail(function (error) {
        displayResultsUrban('urbanDictionaryResults', 'Urban Dictionary', "Did you just type something random? That's not even slang. Sorry, no results to display here!");
        console.error('Error fetching search UD results:', error);
    });


    $.when(
        fetchDictionaryResults(searchTerm)
    ).done(function (dictionaryResults) {

        $('#randomGif').hide();
        $('#dictionaryResults').show();
        displayResultsDictionary('dictionaryResults', 'Dictionary', dictionaryResults);

    }).fail(function (error) {
        displayResultsDictionary('dictionaryResults', 'Dictionary', "Sorry, no results were found in the dictionary :(");
        console.error('Error fetching Dictionary search results:', error);
    });

    $.when(

        fetchGoogleResults(searchTerm)
    ).done(function (googleResults) {

        $('#randomGif').hide();
        $('#googleResults').show();
        displayResultsGoogle('googleResults', 'Google', googleResults.items);


    }).fail(function (error) {
     displayResultsGoogle('googleResults', 'Google', "Not even Google could find a result. There's no hope for you");
        console.error('Error fetching Google search results:', error);
    });
}


function displayResultsUrban(containerId, title, results) {

    var resultBox = $('<div>').addClass('result-box');
    resultBox.append(`<h3>${title} Results (Slang)</h3>`);

    if (Array.isArray(results) && results.length > 0) {
        var resultItems = results.map(item => {
            var definition = item.definition || 'No definition available';
            var example = item.example || 'No example available';
            var permalink = item.permalink || '#';

            return `
                <div class="urban-entry">
                    <h6>Definition:</h6><p>${definition}</p>
                    <p><strong>Example Use:</strong> ${example}</p>
                    <a href="${permalink}" target="_blank">Read more</a>
                </div>`;
        });

        resultBox.append(resultItems.join(''));
    } else if (results && results.error) {
        resultBox.append(`<p>${results.error}</p>`);
    } else {
        resultBox.append('<p>No matches found</p>');
    }

    $(`#${containerId}`).empty().append(resultBox);


}

function displayResultsDictionary(containerId, title, results) {
    var resultBox = $('<div>').addClass('result-box');
    resultBox.append(`<h3>${title} Definitions</h3>`);

    if (Array.isArray(results)) {
        var resultItems = results.map(result => {
            var content = result.definitions?.[0]?.definition || result.meanings?.[0]?.definitions?.[0]?.definition || result.word || result;
            return `<li class="dictionary-entry">${content}</li>`;
        });

        resultBox.append($('<ul>').html(resultItems.join('')));
    } else {

        resultBox.append(`<p>${results}</p>`);
        console.log("test");
    }



    $(`#${containerId}`).empty().append(resultBox);


}

function displayResultsGoogle(containerId, title, results) {
    var resultBox = $('<div>').addClass('result-box');
    resultBox.append(`<h3>${title} Results</h3>`);

    if (Array.isArray(results)) {
        var resultItems = results.map(item => {
            var title = item.title || 'No title available';
            var snippet = item.snippet || 'No snippet available';
            var link = item.link || '#';

            return `
                <li class="google-entry">
                    <h6>${title}</h6>
                    <p>${snippet}</p>
                    <a href="${link}" target="_blank">${link}</a>
                </li>`;
        });

        resultBox.append($('<ul>').html(resultItems.join('')));
    } else {
        resultBox.append(`<p>${results}</p>`);
    }

    $(`#${containerId}`).empty().append(resultBox);
}

// Search Functions


function fetchUrbanDictionaryResults(searchTerm) {
    var apiUrl = `https://api.urbandictionary.com/v0/define?term=${searchTerm}`;
    return $.ajax({
        url: apiUrl,
        method: 'GET',
        dataType: 'json'
    });
}

function fetchDictionaryResults(searchTerm) {
    var apiUrl = `https://api.dictionaryapi.dev/api/v2/entries/en/${searchTerm}`;
    return $.ajax({
        url: apiUrl,
        method: 'GET',
        dataType: 'json'
    });
}

function fetchGoogleResults(searchTerm) {
    var apiUrl = `https://www.googleapis.com/customsearch/v1?q=${searchTerm}&key=[GOOGLEAPI]&cx=[ENGINEID]`;
    return $.ajax({
        url: apiUrl,
        method: 'GET',
        dataType: 'json'
    });
}


// Activate search function on Enter

var searchInput = document.getElementById('searchInput');
searchInput.addEventListener('keydown', (event) => {

    if (event.key === 'Enter') {
        search();

    }

});

// Refresh the app by clicking on the logo

document.getElementById("logo").onclick = function() {
    location.reload();
   }
