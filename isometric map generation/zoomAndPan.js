const view = (() => {
    const matrix = [1, 0, 0, 1, 0, 0]; // current view transform
    let m = matrix;             // alias 
    let scale = 1;              // current scale
    let ctx;                    // reference to the 2D context
    const pos = { x: 0, y: 0 }; // current position of origin
    let dirty = true;
    const API = {
        set context(_ctx) { ctx = _ctx; dirty = true },
        apply() {
            if (dirty) { this.update() }
            ctx.setTransform(m[0], m[1], m[2], m[3], m[4], m[5])
            //desired projection (in this case, isometric)
            ctx.translate(width / 2, height / 2);
            ctx.scale(1, 0.5);
            ctx.rotate(Math.PI / 4);
            ctx.translate(-width / 2, -height / 2);
        },
        get scale() { return scale },
        get position() { return pos },
        isDirty() { return dirty },
        update() {
            dirty = false;
            m[3] = m[0] = scale;
            m[2] = m[1] = 0;
            m[4] = pos.x;
            m[5] = pos.y;
        },
        pan(amount) {
            if (dirty) { this.update() }
            pos.x += amount.x;
            pos.y += amount.y;
            dirty = true;
        },
        scaleAt(at, amount) { // at in screen coords
            if (dirty) { this.update() }
            scale *= amount;
            pos.x = at.x - (at.x - pos.x) * amount;
            pos.y = at.y - (at.y - pos.y) * amount;
            dirty = true;
        },
    };
    return API;
})();

view.context = ctx;

canvas.addEventListener("mousemove", mouseEvent, { passive: true });
canvas.addEventListener("mousedown", mouseEvent, { passive: true });
canvas.addEventListener("mouseup", mouseEvent, { passive: true });
canvas.addEventListener("mouseout", mouseEvent, { passive: true });
canvas.addEventListener("wheel", mouseWheelEvent, { passive: false });

const mouse = { x: 0, y: 0, oldX: 0, oldY: 0, button: false };

function mouseEvent(event) {
    if (event.type === "mousedown") { mouse.button = true }
    if (event.type === "mouseup" || event.type === "mouseout") { mouse.button = false }
    mouse.oldX = mouse.x;
    mouse.oldY = mouse.y;
    mouse.x = event.offsetX;
    mouse.y = event.offsetY
    if (mouse.button) { // pan
        view.pan({ x: mouse.x - mouse.oldX, y: mouse.y - mouse.oldY });
    }
}
function mouseWheelEvent(event) {
    let x = event.offsetX;
    let y = event.offsetY;
    if (event.deltaY < 0) { view.scaleAt({ x, y }, 1.1) }
    else { view.scaleAt({ x, y }, 1 / 1.1) }
    event.preventDefault();
}