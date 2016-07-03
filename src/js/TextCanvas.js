
/* Draws text onto a canvas */
class TextCanvas { 

    // Render text on a hidden canvas
    constructor(opts) {
        if (!opts.textSize || !opts.text) { return null; }

        this.text = opts.text;
        this.textSize = opts.textSize;
        this.font = this.textSize + "px Arial";
        this.fillStyle = "#123456";

        this.canvas = document.createElement("canvas");
        this.renderTextIntoCanvas();
    }

    setCanvasWidth(ctx) {
        this.canvas.width = Math.pow(
            2, Math.ceil(
                Math.log(ctx.measureText(this.text).width) / Math.LN2));
    }

    setCanvasHeight(ctx) {
        this.canvas.height = Math.pow(
            2, Math.ceil(
                Math.log(this.textSize) / Math.LN2));
    }

    /* Keeps around its own internal canvas to render to */
    renderTextIntoCanvas() {
        let ctx = this.canvas.getContext("2d");
        ctx.font = this.font;
        this.setCanvasWidth(ctx);
        this.setCanvasHeight(ctx);

        // Use logs to round the text width and height to the nearest power of 2

        ctx.font = this.font;
        ctx.fillStyle = this.fillStyle;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(this.text, this.canvas.width/2, this.canvas.height/2);
    }

    getCanvas () {
        return this.canvas;
    }

}

export default TextCanvas;
