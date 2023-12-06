
    // Function that randomises GIF on main page before using search
    
    async function getRandomGif() {
        var response = await fetch(`https://api.giphy.com/v1/gifs/search?q=wdym&api_key=OBXwlhFG7x9ODt6AZN21VX3uccqdMBxK`);
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

// Search Functions


    function search() {
        var searchTerm = $('#searchInput').val();
    
        if (!searchTerm) {
            alert('Please enter a search term.');
            return;
        }
    
        $.when(
            fetchUrbanDictionaryResults(searchTerm),
            fetchDictionaryResults(searchTerm),
            fetchGoogleResults(searchTerm)
        ).done(function(urbanDictionaryResults, dictionaryResults, googleResults) {
            
            $('#randomGif').hide();
            $('#urbanDictionaryResults, #dictionaryResults, #googleResults').show();
    
            displayResults('urbanDictionaryResults', 'Urban Dictionary', urbanDictionaryResults[0].list);
            displayResults('dictionaryResults', 'Dictionary', dictionaryResults[0]);
            displayResults('googleResults', 'Google', googleResults[0].items);
        }).fail(function(error) {
            console.error('Error fetching search results:', error);
        });
    }
    
  
    function displayResults(containerId, title, results) {
        var resultBox = $('<div>').addClass('result-box');
        resultBox.append(`<h3>${title} Results</h3>`);
    
        if (Array.isArray(results)) {
            var resultItems = results.map(item => {
                
                var content = item.definition || item.text || item; 
                return `<li>${content}</li>`;
            });
    
            resultBox.append($('<ul>').html(resultItems.join('')));
        } else {
            
            resultBox.append(`<p>${results}</p>`);
        }
    
        
        $(`#${containerId}`).empty().append(resultBox);
    }
    
    
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
        var apiUrl = `https://www.googleapis.com/customsearch/v1?q=${searchTerm}&key=[GOOGLEAPIKEY]&cx=BROWSERID`;
        return $.ajax({
            url: apiUrl,
            method: 'GET',
            dataType: 'json'
        });
    }

    