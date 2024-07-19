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

function showLights() {
    const body = document.body;

    // Hide the "Want lights???" button
    const lightsButton = document.querySelector('.fancy-button');
    lightsButton.style.display = 'none';

    const bulbContainer = document.createElement('div');
    bulbContainer.className = 'bulb-container';

    const colors = ['red', 'blue', 'green', 'yellow', 'white', 'orange', 'pink'];
    const spacing = 180; // Adjust spacing between bulbs

    // Change background color to white
    body.style.backgroundColor = '#ffffff';

    // Create bulbs and position them
    colors.forEach((color, index) => {
        const bulb = document.createElement('img');
        bulb.src = `bulb_${color}.png`;
        bulb.className = 'bulb';
        bulb.style.width = '50px'; // Adjust size as needed
        bulb.style.position = 'absolute';
        bulb.style.left = `${index * spacing}px`; // Position each bulb horizontally
        bulbContainer.appendChild(bulb);
    });

    // Append bulb container to body
    body.appendChild(bulbContainer);

    body.style.backgroundColor = '#ffffff';
    // Show the "Balloons!" button
    const balloonsButton = document.querySelector('.balloon-button');
    balloonsButton.style.display = 'block';


}




function flyBalloons() {
    const body = document.body;

    // Create a container for balloons
    const balloonContainer = document.createElement('div');
    balloonContainer.className = 'balloon-container';

    // Create and position balloons randomly
    const numBalloons = 10;
    for (let i = 1; i <= numBalloons; i++) {
        const balloon = document.createElement('img');
        balloon.src = `b${i}.png`;
        balloon.className = 'balloon';
        balloon.style.width = '50px'; // Adjust size as needed
        balloon.style.position = 'absolute';
        balloon.style.left = `${Math.random() * 100}vw`; // Random horizontal position
        balloon.style.top = `${Math.random() * 100}vh`; // Random vertical position

        // Add balloon to container
        balloonContainer.appendChild(balloon);
    }

    // Append balloon container to body
    body.appendChild(balloonContainer);

    // Animate balloons
    animateBalloons(balloonContainer);
}

function animateBalloons(container) {
    const balloons = container.querySelectorAll('.balloon');
    balloons.forEach(balloon => {
        // Random animation properties
        const animationDuration = `${Math.random() * 10 + 5}s`; // Random duration between 5s to 15s
        const randomAngle = `${Math.random() * 360}deg`; // Random rotation angle

        balloon.style.animation = `floatAnimation ${animationDuration} linear infinite`;
        balloon.style.transform = `rotate(${randomAngle})`;
    });
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
    const lightsButton = document.querySelector('.fancy-button');
    lightsButton.addEventListener('click', showLights);

    // Event listener for "Balloons!" button click
    const balloonsButton = document.querySelector('.balloon-button');
    balloonsButton.addEventListener('click', flyBalloons);
});