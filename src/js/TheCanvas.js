import Component from './Component';

const DEFAULT_SIZE = 800;

let warnCount = 0;

/*
    Canvas class that binds passed-down line segments with DOM canvas
    Supports line segments and mouse / touch events as props

*/
class TheCanvas extends Component { 

    constructor(opts) {
        super(opts);
        if (opts.translateVec) { 
            this.translateVec = [...opts.translateVec]; }
        this.size = opts.size || DEFAULT_SIZE;
        this.scale = opts.scale || 1;

    }

    defaultProps = {
        // format array of array of 2D array: 
        // [ [[10, 20], [20, 30], [30, 40]], [[10, 30], [20, 30]] ]
        lineSegments: [],
        // format: array of 2D array (same as lineSegments[0])
        // [[10, 20], [20, 30], [30, 40]]
        lineSegment: [],
        scale: 1
    };

    componentDidMount () {
        this.ctx = this.refs.theCanvas.getContext('2d');
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
//        this.ctx.fill();
        this.ctx.stroke();
        this.ctx.restore();
    }

    _paint (lineSegments) {

        this.ctx.fillStyle = '#F00';
        this.ctx.fillRect(0, 0, this.size, this.size);
        this.ctx.save();
        if (this.translateVec) { 
            console.log(this.translateVec);
            this.ctx.translate(...this.translateVec);
        }
        if (this.props.scale) {
            this.ctx.scale(this.props.scale, this.props.scale);
        }
        this.ctx.fillStyle = '#33E';
        for (let i = 0; i < lineSegments.length; ++i) {
            this._paintLineSegment(lineSegments[i]);
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
        return (
            <div className="canvas_container">
                <canvas {...this._getCanvasProps()} />
            </div>
        );
    }
}


export default TheCanvas;