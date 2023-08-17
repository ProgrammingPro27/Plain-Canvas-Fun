let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");
let width = canvas.width = window.innerWidth;
let height = canvas.height = window.innerHeight;

let arr = [];

let flag = false;
let gX = 0;
let gY = 0;
ctx.fillStyle = "red";
ctx.lineWidth = 1;
window.addEventListener("mousedown", function () {
    flag = true;
    arr.push({ x: gX, y: gY, r: 50 });

});

window.addEventListener("mouseup", function () {
    flag = false;
});

window.addEventListener("mousemove", function (e) {
    gX = e.clientX;
    gY = e.clientY;
});

setInterval(function () {
    if (flag == true) {
        arr.push({ x: gX, y: gY, r: 50 });
    }
}, 100);

function drawArc(coords) {
    coords.vy += 0.2; // Apply gravity-like acceleration
    coords.y += coords.vy; // Update the position based on velocity

    ctx.beginPath();
    ctx.arc(coords.x, coords.y, coords.r, 0, 2 * Math.PI);
    ctx.fill();
    ctx.stroke();

    if (coords.y + coords.r >= height) {
        coords.y = height - coords.r; // Move the ball just above the ground
        coords.vy *= -0.8; // Reverse vertical velocity with some damping
    }
}

function draw() {
    requestAnimationFrame(draw);
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (arr.length !== 0) {
        for (let i = 0; i < arr.length; i++) {
            if (!arr[i].vy) {
                arr[i].vy = 0; // Initialize vertical velocity if not set
            }
            drawArc(arr[i]);
        }
    }
}

draw();