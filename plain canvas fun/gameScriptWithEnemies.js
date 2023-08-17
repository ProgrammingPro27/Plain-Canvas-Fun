let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");
let width = canvas.width = window.innerWidth;
let height = canvas.height = window.innerHeight;

let arr = [];
let arr2 = [];

let flag = false
let gX = 0;
let gY = 0;

window.addEventListener("mousedown", function () {
    flag = true
})
window.addEventListener("mouseup", function () {
    flag = false
})
window.addEventListener("mousemove", function (e) {
    gX = e.clientX;
    gY = e.clientY;
})

setInterval(function () {
    if (flag == true) {
        arr.push({ x: gX, y: gY, r: 20 });
    }
}, 80);


setInterval(function () {
    arr2.push({ x: Math.random() * ((width - 50) - 50) + 50, y: -50, r: 50 });
}, 100);

function drawEnemy(coords) {
    ctx.beginPath();
    ctx.arc(coords.x, coords.y, coords.r, 0, 2 * Math.PI);
    ctx.fillStyle = "red"
    ctx.fill();


    if (coords.y > height + coords.r) {
        arr2.shift()
    }
    coords.y += 0.8
}

function drawArc(coords) {
    ctx.beginPath();
    ctx.arc(coords.x, coords.y, coords.r, 0, 2 * Math.PI);
    ctx.fillStyle = "black"
    ctx.fill();

    if (coords.y < -coords.r) {
        arr.shift()
    }
    coords.y -= 5
}

function circlesIntersect(c1, c2) {
    const dx = c1.x - c2.x;
    const dy = c1.y - c2.y;
    const d = Math.sqrt(dx * dx + dy * dy);
    return d <= c1.r + c2.r;
}

function removeIntersectingElements() {
    for (let i = arr.length - 1; i >= 0; i--) {
        for (let j = arr2.length - 1; j >= 0; j--) {
            if (circlesIntersect(arr[i], arr2[j])) {
                arr.splice(i, 1);
                arr2.splice(j, 1);
                break; // Exit the inner loop since we've removed the elements
            }
        }
    }
}

function draw() {
    requestAnimationFrame(draw); // Continuously update the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    removeIntersectingElements();

    for (let i = 0; i < arr2.length; i++) {
        drawEnemy(arr2[i])
    }

    if (arr.length !== 0) {
        for (let i = 0; i < arr.length; i++) {
            drawArc(arr[i])
        }
    }

}

draw(); // Start the drawing loop
