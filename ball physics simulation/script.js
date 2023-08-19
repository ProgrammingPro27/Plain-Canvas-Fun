function checkCircleCollision(circleA, circleB) {
    const dx = circleB.x - circleA.x;
    const dy = circleB.y - circleA.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    return distance < circleA.r + circleB.r;
}

function resolveCircleCollision(circleA, circleB) {
    const dx = circleB.x - circleA.x;
    const dy = circleB.y - circleA.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    const overlap = (circleA.r + circleB.r) - distance;

    const normalX = dx / distance;
    const normalY = dy / distance;

    // Calculate relative velocity along the normal direction
    const relativeVelocityX = circleB.vx - circleA.vx;
    const relativeVelocityY = circleB.vy - circleA.vy;
    const dotProduct = (relativeVelocityX * normalX) + (relativeVelocityY * normalY);

    // Calculate impulse magnitude
    const impulseMagnitude = dotProduct / (1 / circleA.r + 1 / circleB.r);

    // Apply impulse to update velocities
    circleA.vx += (impulseMagnitude / circleA.r) * normalX;
    circleA.vy += (impulseMagnitude / circleA.r) * normalY;
    circleB.vx -= (impulseMagnitude / circleB.r) * normalX;
    circleB.vy -= (impulseMagnitude / circleB.r) * normalY;

    // Move circles based on their mass and overlap for realistic collision response
    const totalMass = circleA.r + circleB.r;
    const movePerMassA = (overlap * (circleA.r / totalMass));
    const movePerMassB = (overlap * (circleB.r / totalMass));
    circleA.x -= movePerMassA * normalX;
    circleA.y -= movePerMassA * normalY;
    circleB.x += movePerMassB * normalX;
    circleB.y += movePerMassB * normalY;

    circleA.vx += (impulseMagnitude / circleA.r) * normalX * restitution;
    circleA.vy += (impulseMagnitude / circleA.r) * normalY * restitution;
    circleB.vx -= (impulseMagnitude / circleB.r) * normalX * restitution;
    circleB.vy -= (impulseMagnitude / circleB.r) * normalY * restitution;
}

function calculateDeflectionVector(circleA, circleB) {
    const collisionNormal = {
        x: circleA.x - circleB.x,
        y: circleA.y - circleB.y
    };
    const distance = Math.sqrt(collisionNormal.x * collisionNormal.x + collisionNormal.y * collisionNormal.y);
    collisionNormal.x /= distance;
    collisionNormal.y /= distance;

    const relativeVelocity = {
        x: circleA.vx - circleB.vx,
        y: circleA.vy - circleB.vy
    };
    const speedAlongNormal = relativeVelocity.x * collisionNormal.x + relativeVelocity.y * collisionNormal.y;

    const impulseMagnitude = (2 * speedAlongNormal) / (1 / circleA.mass + 1 / circleB.mass);
    const impulse = {
        x: impulseMagnitude * collisionNormal.x,
        y: impulseMagnitude * collisionNormal.y
    };

    return impulse;
}

let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");
let width = canvas.width = window.innerWidth;
let height = canvas.height = window.innerHeight;

let arr = [];

let flag = false;
let gX = 0;
let gY = 0;
let r = 30
ctx.fillStyle = "red";
ctx.lineWidth = 1;


const friction = 0.98;
const airResistance = 0.99;
const gravity = 0.3;
const restitution = 0.9; 
window.addEventListener("mousedown", function () {
    flag = true;
    arr.push({ x: gX, y: gY, r: r, vx: 0, vy: 0, ax: 0, ay: 0, mass: Math.PI * r * r });
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
        const randomVX = Math.random() * 2 - 1; // Random value between -1 and 1
        const randomVY = Math.random() * 2 - 1; // Random value between -1 and 1
        arr.push({ x: gX, y: gY, r: r, vx: randomVX, vy: randomVY, ax: 0, ay: 0, mass: Math.PI * r * r });
    }
}, 100);

function applyPhysics(coords) {
    const distanceToMouse = Math.sqrt((coords.x - gX) * (coords.x - gX) + (coords.y - gY) * (coords.y - gY));

    // Calculate an additional acceleration based on distance from the mouse
    const additionalAy = gravity * (distanceToMouse / height);

    coords.ay = gravity + additionalAy;

    // Apply easing to x and y velocities
    coords.vx *= airResistance;
    coords.vy *= airResistance;

    coords.vx *= friction;
    coords.vy *= friction;

    coords.vy += coords.ay;  // Update y velocity with acceleration

    coords.y += coords.vy;

    if (coords.y + coords.r >= height) {
        coords.y = height - coords.r;
        coords.vy *= -1 * restitution; // Apply restitution to y velocity on collision
    }

    coords.ax = 0;  // Reset x acceleration

    coords.vx += coords.ax;  // Update x velocity with acceleration

    coords.x += coords.vx;

    if (coords.x - coords.r <= 0) {
        coords.x = coords.r;
        coords.vx *= -1 * restitution; // Apply restitution to x velocity on collision
    } else if (coords.x + coords.r >= width) {
        coords.x = width - coords.r;
        coords.vx *= -1 * restitution; // Apply restitution to x velocity on collision
    }
}

function drawArc(coords) {
    applyPhysics(coords);

    for (let i = 0; i < arr.length; i++) {
        if (coords !== arr[i] && checkCircleCollision(coords, arr[i])) {
            resolveCircleCollision(coords, arr[i]);

            // Update acceleration after collision resolution
            coords.ax += (1 / coords.mass) * (coords.vx - arr[i].vx);
            coords.ay += (1 / coords.mass) * (coords.vy - arr[i].vy);
        }
    }

    ctx.beginPath();
    ctx.arc(coords.x, coords.y, coords.r, 0, 2 * Math.PI);
    ctx.fill();
    ctx.stroke();
}

function draw() {
    requestAnimationFrame(draw);
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (arr.length !== 0) {
        for (let i = 0; i < arr.length; i++) {
            drawArc(arr[i]);
        }
    }
}

draw();