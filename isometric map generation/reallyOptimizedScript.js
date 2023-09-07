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

function render() {
    requestAnimationFrame(render);
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, width, height);
    view.apply();

    let absoluteCenter = getWindowToCanvas(canvas, width / 2, height / 2)

    let coordinates = [
        { x: baseX, y: baseY },
        { x: baseX, y: baseY + size },
        { x: baseX, y: baseY + 2 * size },
        { x: baseX + size, y: baseY },
        { x: baseX + 2 * size, y: baseY },
        { x: baseX + 2 * size, y: baseY + size },
        { x: baseX + 2 * size, y: baseY + 2 * size },
        { x: baseX + size, y: baseY + 2 * size }
    ];

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
        }
    }

    //OPTIONAL elements
    ctx.beginPath()
    ctx.arc(absoluteCenter.x, absoluteCenter.y, 5, 0, 2 * Math.PI);
    ctx.fillStyle = "red"
    ctx.fill()

    // boundaries
    ctx.beginPath()
    ctx.moveTo(baseX, baseY)//top
    ctx.lineTo(baseX, baseY + 3 * size)//left
    ctx.lineTo(baseX + 3 * size, baseY + 3 * size)//bottom
    ctx.lineTo(baseX + 3 * size, baseY)//right
    ctx.lineTo(baseX, baseY)//top
    ctx.stroke()

    ctx.beginPath()
    ctx.moveTo(baseX, baseY + 2 * size)
    ctx.lineTo(baseX + 3 * size, baseY + 2 * size)
    ctx.stroke()

    ctx.beginPath()
    ctx.moveTo(baseX, baseY + size)
    ctx.lineTo(baseX + 3 * size, baseY + size)
    ctx.stroke()

    ctx.beginPath()
    ctx.moveTo(baseX + size, baseY)
    ctx.lineTo(baseX + size, baseY + 3 * size)
    ctx.stroke()

    ctx.beginPath()
    ctx.moveTo(baseX + 2 * size, baseY)
    ctx.lineTo(baseX + 2 * size, baseY + 3 * size)
    ctx.stroke()
}

render();

window.addEventListener("resize", function () {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});