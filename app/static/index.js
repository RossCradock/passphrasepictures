var words = ''
var story_generated = false

function numberOfWordsUpdate() {
    setError(false)
    setLoading(false)
    afterStoryUpdate(false)
    const slider = document.getElementById('number-of-words');
    document.getElementById('slider-value').textContent = slider.value;
    passphrase()
}

function copy(){
    // Copy the text inside the text field
    navigator.clipboard.writeText(document.getElementById("passphrase-text").textContent);
}

function capSepUpdated(){
    document.getElementById("passphrase-text").textContent = wordsToText(words);
}

function wordsToText(words){
    var capitalise = document.getElementById('capitalise').checked
    var separator = document.getElementById('separator').value
    if (capitalise){
        var words = words.map(word => word.charAt(0).toUpperCase() + word.slice(1));
    }
    return words.join(separator)
}

function passphrase(){
    number_of_words = document.getElementById('number-of-words').value
    const endpoint = `/passphrase/?number_of_words=${encodeURIComponent(number_of_words)}`;
    
    // Send GET request to the server
    fetch(endpoint)
        .then(response => response.json())
        .then(data => {
            if (data.includes('Error')){
                setError(true, data)
            } else {
                setError(false)
                // Set passphrase and prompt on good response
                words = data;
                document.getElementById("passphrase-text").textContent = wordsToText(words);
            }
        })
        .catch(error => {
            console.error("Error getting passphrase:", error);
            setError(true, error);
        });
}

function generateStory(){
    setLoading(true);
    setError(false);
    const endpoint = `/generate_story/?prompt=${encodeURIComponent(words.toString())}`;
    fetch(endpoint)
        .then(response => response.text())
        .then(data => {
            document.getElementById("generated_story").textContent = data;
            reorderWords(data)
            capSepUpdated()
            setLoading(false)
            afterStoryUpdate(true)
        })
        .catch(error => {
            console.error("Error fetching story:", error);
            setError(true, "Error fetching story");
            setLoading(false);
        });
}

function generateImage(){
    if(!story_generated){
        return
    }
    setLoading(true);
    setError(false);
    story = document.getElementById('generated_story').textContent
    const endpoint = `/generate_image/?story=${encodeURIComponent(story)}`;
    fetch(endpoint)
        .then(response => response.text())
        .then(data => {
            setLoading(false)
            if(data.includes('content_policy_violation')){
                setError(true, 'Image content policy violation. Try another story')
                console.log('Error', data)
                return
            }
            if(data.includes('Error: failed to fetch images')){
                setError(true, 'Image failed to be generated or failed to load')
                console.log('Error', data)
                return
            }
            document.getElementById("generated_image").src = data;
        })
        .catch(error => {
            console.error("Error fetching image:", error);
            setError(true, "Error fetching image");
            setLoading(false);
        });
}

function setError(error, error_message = ''){
    const error_text = document.getElementById('error-text');
    error_text.textContent = error_message;
    console.log(error_message)
    if(error){
        setLoading(false)
        error_text.style.display = 'inherit';
    } else {
        error_text.style.display = 'none';
    }
}

function setLoading(loading){
    const loading_text = document.getElementById('loading_text');
    if(loading){
        loading_text.style.display = 'inherit';
    } else {
        loading_text.style.display = 'none';
    }
}

function afterStoryUpdate(generated){
    const generate_story_button = document.getElementById("generate_story_button")
    const generate_image_button = document.getElementById("generate_image_button")
    if(generated){
        // just after creating a new story
        generate_story_button.textContent = "Regenerate New Story" 
        generate_image_button.className = "btn btn-success"
        story_generated = true
    } else {
        // action made to create a new one
        generate_story_button.textContent = "Generate Story" 
    }
}

function reorderWords(story) {
    // Create a map to store the index of each word in the text
    const wordIndexMap = new Map();
    // Split the text into an array of words
    const wordsInStory = story.split(/\s+/);
    // Populate the map with the index of each word in the text
    wordsInStory.forEach((word, index) => {
      const normalizedWord = word.toLowerCase(); // Normalize case for comparison
      if (!wordIndexMap.has(word)) {
        wordIndexMap.set(normalizedWord, index);
      }
    });
    // Sort the words based on the index in the text
    words.sort((a, b) => {
      const indexA = wordIndexMap.get(a.toLowerCase()) || Infinity;
      const indexB = wordIndexMap.get(b.toLowerCase()) || Infinity;
      return indexA - indexB;
    });
  }

// set initial conditions
numberOfWordsUpdate();
document.getElementById('separator').value = '.';