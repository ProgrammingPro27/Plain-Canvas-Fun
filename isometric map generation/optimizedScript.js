function getWindowToCanvas(canvas, x, y) {
    let rect = canvas.getBoundingClientRect();
    let screenX = (x - rect.left) * (canvas.width / rect.width);
    let screenY = (y - rect.top) * (canvas.height / rect.height);
    const ctx = canvas.getContext("2d");
    let transform = ctx.getTransform();
    if (transform.isIdentity) {
        return {
            x: screenX,
            y: screenY
        };
    } else {
        //   console.log(transform.invertSelf()); //don't invert twice!!
        const invMat = transform.invertSelf();

        return {
            x: Math.round(screenX * invMat.a + screenY * invMat.c + invMat.e),
            y: Math.round(screenX * invMat.b + screenY * invMat.d + invMat.f)
        };
    }
}

function generateMatrix(rows, cols) {
    let coords = []
    for (let i = 0; i < rows; i++) {
        coords[i] = []
        coords[i].length = cols
    }
    return coords;
}

let matrix = generateMatrix(3, 3);
let size = 250;

function fillMatrix(matrix, size) {
    let x = width / 2 - size * matrix.length / 2;
    let y = height / 2 - size * matrix.length / 2;
    let oriX = x;
    for (let i = 0; i < matrix.length; i++) {
        for (let j = 0; j < matrix[i].length; j++) {
            matrix[i][j] = { x, y }
            x += size;
        }
        x = oriX;
        y += size;
    }
    return matrix
}

let filledMatrix = fillMatrix(matrix, size)

ctx.strokeStyle = "red"

function checkAbsolutePointInRectangle(absoluteCenter, curr) {
    if (
        absoluteCenter.x > curr.x &&
        absoluteCenter.x < curr.x + size &&
        absoluteCenter.y > curr.y &&
        absoluteCenter.y < curr.y + size
    ) {
        return true
    }
}

// ctx.translate(width / 2, height / 2);
// ctx.scale(1, 0.5);
// ctx.rotate(Math.PI / 4);
// ctx.translate(-width / 2, -height / 2);

//rotation       
//Degrees -> 45 * (Math.PI/180);

function uniF1(dir, dir2, i, op) {
    let popped = filledMatrix[dir]()
    for (let k = 0; k < popped.length; k++) {
        if (op == "-") {
            popped[k].y = filledMatrix[i][k].y - size
        } else {
            popped[k].y = filledMatrix[i][k].y + size
        }
    }
    filledMatrix[dir2](popped)
}

function uniF2(dir, dir2, i, op) {
    for (let z = 0; z < filledMatrix.length; z++) {
        let shifted = filledMatrix[z][dir]()
        if (op == "-") {
            shifted.x = filledMatrix[z][i].x - size
        } else {
            shifted.x = filledMatrix[z][i].x + size
        }
        filledMatrix[z][dir2](shifted)
    }
}

function render() {
    requestAnimationFrame(render);
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, width, height);
    view.apply();

    let absoluteCenter = getWindowToCanvas(canvas, width / 2, height / 2)
    //draw here
    for (let i = 0; i < filledMatrix.length; i++) {
        for (let j = 0; j < filledMatrix[i].length; j++) {
            let curr = filledMatrix[i][j];
            ctx.fillStyle = "black"
            ctx.beginPath()
            ctx.rect(curr.x, curr.y, size, size)
            ctx.fill()
            ctx.stroke()

            if (checkAbsolutePointInRectangle(absoluteCenter, curr)) {
                if (i == 0 && j == 0) {
                    uniF1("pop", "unshift", 0, "-")
                    uniF2("pop", "unshift", 0, "-")
                }
                if (i == 0 && j == 2) {
                    uniF1("pop", "unshift", 0, "-")
                    uniF2("shift", "push", 1, "+")
                }
                if (i == 2 && j == 0) {
                    uniF2("pop", "unshift", 0, "-")
                    uniF1("shift", "push", 1, "+")
                }
                if (i == 2 && j == 2) {
                    uniF2("shift", "push", 1, "+")
                    uniF1("shift", "push", 1, "+")
                }
                //===================================
                if (i == 0 && j == 1) {
                    uniF1("pop", "unshift", 0, "-")
                }
                if (i == 2 && j == 1) {
                    uniF1("shift", "push", 1, "+")
                }
                if (i == 1 && j == 0) {
                    uniF2("pop", "unshift", 0, "-")
                }
                if (i == 1 && j == 2) {
                    uniF2("shift", "push", 1, "+")
                }
            }
            // optional !
            ctx.beginPath()
            ctx.arc(absoluteCenter.x, absoluteCenter.y, 5, 0, 2 * Math.PI);
            ctx.fillStyle = "red"
            ctx.fill()

            ctx.beginPath()
            let text = `X:${curr.x}`
            let text2 = `Y:${curr.y}`
            ctx.fillStyle = "white"
            ctx.font = "15px Arial";
            ctx.fillText(text, curr.x + size / 2 - ctx.measureText(text).width / 2, curr.y + (size / 2) - 10);
            ctx.fillText(text2, curr.x + size / 2 - ctx.measureText(text2).width / 2, curr.y + (size / 2) + 10);
            ctx.stroke()
        }
    }
}

render();

window.addEventListener("resize", function () {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    ctx.strokeStyle = "red"
});
