
const FILL_STYLE_TICK_CHANGE = 40; // higher number means slower change

/* Draws background. */
class Background {

    constructor(opts) {
        this.width = opts.width || opts.size || 200;
        this.height = opts.height || opts.size || 200;

        // do some crazy stuff with colors
        this.r_inc = true;
        this.g_inc = true;
        this.r_inc = true;
        this.r_hi = 255;
        this.r_low = 230;
        this.g_hi = 100;
        this.g_low = 0;
        this.b_hi = 66;
        this.b_low = 0;
        this.r_val = this.r_low;
        this.g_val = this.g_low;
        this.b_val = this.b_low;

        this.count = 0;
        this.setFillStyle();
    }

    setFillStyle() {
        this.fillStyle =
            "rgb(" + [ this.r_val, this.g_val, this.b_val ].join(',') + ")";
    }

    incRedVal() {
        if (this.r_inc) {
            this.r_val += 1;
            if (this.r_val >= this.r_hi) {
                this.r_inc = false;
            }
        } else {
            this.r_val -= 1;
            if (this.r_val <= this.r_low) {
                this.r_inc = true;
            }
        }
    }

    incGreenVal() {
        if (this.g_inc) {
            this.g_val += 1;
            if (this.g_val >= this.g_hi) {
                this.g_inc = false;
            }
        } else {
            this.g_val -= 1;
            if (this.g_val <= this.g_low) {
                this.g_inc = true;
            }
        }
    }

    incBlueVal() {
        if (this.b_inc) {
            this.b_val += 1;
            if (this.b_val >= this.b_hi) {
                this.b_inc = false;
            }
        } else {
            this.b_val -= 1;
            if (this.b_val <= this.b_low) {
                this.b_inc = true;
            }
        }
    }

    draw (ctx) {
        this.count = (this.count + 1) % FILL_STYLE_TICK_CHANGE;
        if (this.count == 0) {
            this.incRedVal();
            this.incGreenVal();
            this.incBlueVal();
            this.setFillStyle();
        }
        ctx.fillStyle = this.fillStyle;
//        ctx.save();
        ctx.fillRect(0, 0, this.width, this.height);
//        ctx.restore();
    }

}

export default Background;
