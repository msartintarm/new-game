
let image = null;



/* Draws background. */
class Background { 

    constructor(opts) {
        this.width = opts.width || opts.size || 200;
        this.height = opts.height || opts.size || 200;
        this.red_val_inc = true;
        this.red_val_hi = 255;
        this.red_val_low = 230;
        this.red_val = this.red_val_low;
    }

    incRedVal() {
        if (this.red_val_inc) {
            this.red_val += 1;
            if (this.red_val >= this.red_val_hi) {
                this.red_val_inc = false;
            }
        } else {
            this.red_val -= 1;
            if (this.red_val <= this.red_val_low) {
                this.red_val_inc = true;
            }
        }
    }

    draw (ctx) {
        this.incRedVal;
        ctx.save();
        ctx.fillStyle = "rgb(" + this.red_val + ",0,0)";
        ctx.fillRect(0, 0, this.width, this.height);
        ctx.restore();
    }

}

export default Background;
