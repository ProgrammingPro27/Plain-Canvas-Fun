let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");
let width = canvas.width = window.innerWidth;
let height = canvas.height = window.innerHeight;
// let r = 50;
// let x = width / 2 - r / 2
// let y = height / 2 - r / 2
// 
// let bX = width / 2 - r / 2
// let bY = height / 2 - r / 2
// 
// let z = 0;
// let h = 0;
// function render() {
//     requestAnimationFrame(render);
//     ctx.clearRect(0, 0, canvas.width, canvas.height);
// 
//     ctx.beginPath();
//     ctx.arc(x, y, r, 0, 2 * Math.PI);
//     ctx.stroke();
//     x = bX + Math.sin(Math.PI * z) * 150
//     y = bY + Math.sin(Math.PI * h) * 150
//      z += 0.01
//     // h += 0.01
// };
// 
// render();







// const amplitude = 100;       // Amplitude of the sine wave
// const frequency = 0.02;      // Frequency of the sine wave
// let phase = 0;               // Initial phase of the sine wave
// 
// function draw() {
//     ctx.clearRect(0, 0, canvas.width, canvas.height);
//     ctx.beginPath();
//     for (let x = 0; x < canvas.width; x++) {
//         const y = amplitude * Math.sin(frequency * x + phase);
//         ctx.lineTo(x, canvas.height / 2 - y);
//     }
//     ctx.stroke();
//     ctx.closePath();
//     phase -= 0.05;  // Increase the phase for animation
//     requestAnimationFrame(draw); // Continuously update the canvas
// }
// 
// draw(); // Start the drawing loop



const amplitude = 200;       // Amplitude of the sine wave
const frequency = 0.02;      // Frequency of the sine wave
let phase = 0;               // Initial phase of the sine wave
let r = 20;
let x = 0;
function draw() {
    requestAnimationFrame(draw); // Continuously update the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const y = amplitude * Math.sin(frequency * x + phase);
    ctx.beginPath();

    ctx.arc(x, canvas.height / 2 - y, r, 0, 2 * Math.PI);

    ctx.fill();
    if (x < canvas.width) {
        x++
    } else {
        x = 0
    }
    phase -= 0.05;  // Increase the phase for animation
}

draw(); // Start the drawing loop