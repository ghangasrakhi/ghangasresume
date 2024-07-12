let audioContext;
let analyser;
let dataArray;

function addCandles() {
    const cakeContainer = document.getElementById('cake-container');
    const cakeImage = document.getElementById('cake');
    const numCandles = document.getElementById('numCandles').value;
    const customMessage = document.getElementById('customMessage').value;
    cakeContainer.querySelectorAll('.candle').forEach(c => c.remove()); // Clear previous candles

    const cakeWidth = cakeImage.clientWidth;
    const cakeHeight = cakeImage.clientHeight;
    const candleSpacing = cakeWidth / numCandles;

    for (let i = 0; i < numCandles; i++) {
        const candle = document.createElement('div');
        candle.className = 'candle';
        candle.style.left = `${(i * candleSpacing) + (candleSpacing / 2) - 5}px`; // Adjusted positioning

        const flame = document.createElement('div');
        flame.className = 'flame';

        candle.appendChild(flame);
        cakeContainer.appendChild(candle);
    }

    // Update the message on the card
    const messageContainer = document.getElementById('message-container');
    if (messageContainer) {
        messageContainer.textContent = customMessage;
    } else {
        console.error('Message container not found!');
    }
}

function setupMic() {
    // Initialize AudioContext
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
    analyser = audioContext.createAnalyser();

    // Request access to the user's microphone
    navigator.mediaDevices.getUserMedia({ audio: true, video: false })
        .then(stream => {
            const source = audioContext.createMediaStreamSource(stream);
            source.connect(analyser);
            analyser.fftSize = 256;
            const bufferLength = analyser.frequencyBinCount;
            dataArray = new Uint8Array(bufferLength);

            // Start checking the microphone input level
            checkMicLevel();
        })
        .catch(err => {
            console.error('Error accessing microphone:', err);
        });
}

function checkMicLevel() {
    analyser.getByteTimeDomainData(dataArray);
    let sum = 0;
    for (let i = 0; i < dataArray.length; i++) {
        sum += (dataArray[i] - 128) * (dataArray[i] - 128);
    }
    let rms = Math.sqrt(sum / dataArray.length);
    console.log('Mic level:', rms);

    if (rms > 20) { // Adjust the threshold as needed
        blowOutCandles();
    }

    requestAnimationFrame(checkMicLevel);
}

function blowOutCandles() {
    const flames = document.querySelectorAll('.flame');
    flames.forEach(flame => {
        flame.classList.add('blown-out');
        flame.style.backgroundColor = 'gray'; // Change flame color to gray
    });
    console.log('Who turned out the lights?'); // Log message
}

function changeBackground(image) {
    const cardBack = document.querySelector('.card-back');
    cardBack.style.backgroundImage = `url(${image})`;
}

// Initialize microphone and start listening after user interaction
window.addEventListener('click', () => {
    setupMic();
}, { once: true });

document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.bg-option').forEach(option => {
        option.addEventListener('click', (event) => {
            const imageUrl = event.target.dataset.image;
            changeBackground(imageUrl);
        });
    });
});
