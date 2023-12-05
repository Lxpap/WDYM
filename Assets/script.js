
    async function getRandomGif() {
        try {
            var response = await fetch(`https://api.giphy.com/v1/gifs/search?q=wdym&api_key=[GIPHYKEY]`);
            var data = await response.json();
     
            var randomIndex = Math.floor(Math.random() * data.data.length);
            var randomGif = data.data[randomIndex];
     
            return randomGif.images.original.url;
        } catch (error) {
            console.error('Error retrieving random GIF:', error);
            throw new Error('Failed to retrieve random GIF');
        }
    }
    
    async function displayGif() {
        try {
            var gifUrl = await getRandomGif();
            var randomGifElement = document.getElementById('gif');
            randomGifElement.src = gifUrl;
        } catch (error) {
            console.error('Error displaying random GIF:', error.message);
        }
    }

    getRandomGif()
        .then((gifUrl) => {
            console.log('Random GIF URL:', gifUrl);
        })
        .catch((error) => {
            console.error('Error:', error.message);
        });

    displayGif();