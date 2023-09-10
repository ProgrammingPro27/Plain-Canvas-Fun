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

let size = 250;
let baseX = width / 2 - (3 * size) / 2
let baseY = height / 2 - (3 * size) / 2

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
function updateChunkCoordinates() {
    return [
        { x: baseX, y: baseY },
        { x: baseX, y: baseY + size },
        { x: baseX, y: baseY + 2 * size },
        { x: baseX + size, y: baseY },
        { x: baseX + 2 * size, y: baseY },
        { x: baseX + 2 * size, y: baseY + size },
        { x: baseX + 2 * size, y: baseY + 2 * size },
        { x: baseX + size, y: baseY + 2 * size },
        { x: baseX + size, y: baseY + size }
    ];
}

let coordinates = updateChunkCoordinates();

function render() {
    requestAnimationFrame(render);
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, width, height);
    view.apply();

    let absoluteCenter = getWindowToCanvas(canvas, width / 2, height / 2)

    for (let i = 0; i < coordinates.length; i++) {
        if (checkAbsolutePointInRectangle(absoluteCenter, coordinates[i])) {
            switch (i) {
                case 0: baseX -= size; baseY -= size; break;
                case 1: baseX -= size; break;
                case 2: baseX -= size; baseY += size; break;
                case 3: baseY -= size; break;
                case 4: baseX += size; baseY -= size; break;
                case 5: baseX += size; break;
                case 6: baseX += size; baseY += size; break;
                case 7: baseY += size; break;
            }
            coordinates = updateChunkCoordinates();
        }
        //OPTIONAL elements
        let curr = coordinates[i]
        ctx.fillStyle = "black"
        ctx.beginPath()
        ctx.rect(curr.x, curr.y, size, size)
        ctx.fill()
        ctx.strokeStyle = "red"
        ctx.stroke()

        ctx.beginPath()
        let text = `X:${curr.x}`
        let text2 = `Y:${curr.y}`
        ctx.fillStyle = "white"
        ctx.font = "15px Arial";
        ctx.fillText(text, curr.x + size / 2 - ctx.measureText(text).width / 2, curr.y + (size / 2) - 10);
        ctx.fillText(text2, curr.x + size / 2 - ctx.measureText(text2).width / 2, curr.y + (size / 2) + 10);
        ctx.stroke()
        //----------------
    }
    //OPTIONAL element
    ctx.beginPath()
    ctx.arc(absoluteCenter.x, absoluteCenter.y, 5, 0, 2 * Math.PI);
    ctx.fillStyle = "red"
    ctx.fill()
}

render();

window.addEventListener("resize", function () {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});
