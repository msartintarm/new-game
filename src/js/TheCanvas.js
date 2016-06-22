import { registerHandler } from './EventHandler';

const DEFAULT_SIZE = 800;

const BRICK_SRC = "http://4.bp.blogspot.com/__lKAPG3mt5k/TEYmLgadeaI/AAAAAAAAALE/iKewdsrZSwk/s640/Complex+Brick+Seamless+Texture.jpg";

let warnCount = 0;

let canvasNum = 0;


let image_brick = null;


/*
    Canvas class that binds passed-down line segments with DOM canvas
    Supports line segments and mouse / touch events as props

*/
class TheCanvas extends React.Component { 

    constructor(opts) {
        super(opts);
        this.size = opts.size || DEFAULT_SIZE;

        this.button_classname = "toggle_canvas" + canvasNum;

        this.state = { show_canvas: true };
        canvasNum += 1;

        registerHandler('mousedown', this.button_classname,
            this.toggleCanvasOnMouseDown);
    }

    defaultProps = {
        // format array of array of 2D array: 
        // [ [[10, 20], [20, 30], [30, 40]], [[10, 30], [20, 30]] ]
        lineSegments: [],
        // format: array of 2D array (same as lineSegments[0])
        // [[10, 20], [20, 30], [30, 40]]
        lineSegment: [],
        scale: 1,
        offset: [0,0]
    };

    componentDidMount () {
        this.ctx = this.refs.theCanvas.getContext('2d');
        if(!image_brick) {
            image_brick = new Image();
            image_brick.onload = () => { 
                console.log("On load yesh", BRICK_SRC);
                this.pattern_brick = this.ctx.createPattern(image_brick, "repeat");
            };
            image_brick.src = BRICK_SRC;
        } else {
            this.pattern_brick = this.ctx.createPattern(image_brick, "repeat");
        }
        this._paint(this.props.lineSegments);
    }

    componentDidUpdate () {
        this._paint(this.props.lineSegments);
    }

    /* Returns false if this is not an array of 2d arrays [0,1,1,2,2,3] */
    _isLineSegment (points) {
        let t;
        if (!points) {
            console.warn("No point list provided");
        } else if (points.length < 2) { 
            // empty array.. means no points in list
        } else if ((t = typeof points[0]) .toLowerCase() !== "number") {
            if (warnCount <= 5) { // this can be printed out millions of times otherwise
                console.warn("Wrong type (non number) for line segment: " + t + "! :o");
                console.warn("Point list is:" + JSON.stringify(points));
                warnCount += 1;
            }
        } else return true;
        return false;
    }

    toggleCanvasOnMouseDown = (e) => {
    let newState = { show_canvas: (!this.state.show_canvas) };
        this.setState(newState);
    };

    /*
        input needs to be 'line segment' 
    */
    _paintLineSegment (points) {
        if (!this._isLineSegment(points)) return; // make sure input is 'line segment format'
        this.ctx.save();
        this.ctx.beginPath();
        this.ctx.moveTo(points[0], points[1]);
        for (let i = 2; i < points.length; i += 2) {
            this.ctx.lineTo(points[i], points[i+1]);
        }
        if (!!this.pattern_brick) {
            this.ctx.fill();
        }
        this.ctx.stroke();
        this.ctx.restore();
    }

    _paint (lineSegments) {

        this.ctx.fillStyle = '#F00';
        this.ctx.fillRect(0, 0, this.size, this.size);
        this.ctx.save();
        if (this.props.offset) { 
            this.ctx.translate(...this.props.offset);
        }
        if (this.props.scale) {
            this.ctx.scale(this.props.scale, this.props.scale);
        }
        if (!!this.pattern_brick) {
            this.ctx.fillStyle = this.pattern_brick;
        }

        if (!!this.props.drawObjs) {
            for (let obj of this.props.drawObjs) {
                obj.draw(this.ctx);
            }
        } else {
            for (let i = 0; i < lineSegments.length; ++i) {
                this._paintLineSegment(lineSegments[i]);
            }
        }
        this.ctx.restore();
    }

    _getCanvasProps () {
        return {
            ref: "theCanvas",
            width: this.size,
            height: this.size
        };
    }

    render () {
        let theCanvas = (<canvas {...this._getCanvasProps()} />);
        return (
            <div className="canvas_ container">
                <div className={this.button_classname}>Toggle Canvas!</div>
                { this.state.show_canvas? theCanvas: null }
            </div>
        );
    }
}


export default TheCanvas;