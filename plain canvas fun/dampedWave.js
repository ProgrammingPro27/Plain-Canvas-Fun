let canvas = document.getElementById("canvas");
let context = canvas.getContext("2d");
let width = canvas.width = window.innerWidth;
let height = canvas.height = window.innerHeight;



const amplitude = 300;       // Amplitude of the sine wave
const frequency = 0.05;      // Frequency of the sine wave
const dampingFactor = 0.003; // Damping factor for the amplitude
let phase = 0;               // Initial phase of the sine wave


context.lineWidth = 2;
function draw() {
    context.clearRect(0, 0, canvas.width, canvas.height);

    context.beginPath();


    for (let x = 0; x < canvas.width; x++) {
        const damping = Math.exp(-dampingFactor * x); // Calculate damping factor
        const y = damping * amplitude * Math.sin(frequency * x + phase);
        context.lineTo(x, canvas.height / 2 - y);
    }

    context.stroke();
    context.closePath();

    phase -= 0.15;  // Increase the phase for animation
    requestAnimationFrame(draw); // Continuously update the canvas
}

draw(); // Start the drawing loop