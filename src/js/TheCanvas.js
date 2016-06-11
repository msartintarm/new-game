import Component from './Component';

const DEFAULT_SIZE = 800;
/*
    Canvas class that binds passed-down line segments with DOM canvas

    Supports line segments and mouse / touch events as props

*/
class TheCanvas extends Component { 

    constructor(opts) {
        super(opts);
        this.size = opts.size || DEFAULT_SIZE;
    }

    componentDidMount () {
        this.ctx = this.refs.theCanvas.getContext('2d');
        this._paint(this.props.lineSegments);
    }

    componentDidUpdate () {
        this._paint(this.props.lineSegments);
    }

    /* Returns false if this is not an array of 2d arrays [[0,1], [1,2],[2,3]] */
    _isLineSegment (points) {
        let t;
        if (!points)
            console.warn("No point list provided");
        else if (points.length < 1) 
            {} // empty array.. means no points in list
        else if (points[0].length < 1)
            console.warn("Points cannot be empty arrays");
        else if ((t = typeof points[0][0]) .toLowerCase() !== "number") 
            console.warn("Wrong type (non number) for line segment: " + t + "! :o");
        else return true;
        return false;
    }

    /*
        input needs to be 'line segment' 
    */
    _paintLineSegment (points) {
        if (!this._isLineSegment(points)) return; // make sure input is 'line segment format'
        this.ctx.save();
        this.ctx.beginPath();
        this.ctx.moveTo(...points[0]);
        for (var i = 1; i < points.length; ++i) {
            this.ctx.lineTo(...points[i]);
        }
        this.ctx.stroke();
        this.ctx.restore();
    }

    _paint (lineSegments) {

        this.ctx.fillStyle = '#F00';
        this.ctx.fillRect(0, 0, this.size, this.size);
        this.ctx.save();
        this.ctx.scale(0.5, 0.5);
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

TheCanvas.defaultProps = {
    // format array of array of 2D array: 
    // [ [[10, 20], [20, 30], [30, 40]], [[10, 30], [20, 30]] ]
    lineSegments: [],
    // format: array of 2D array (same as lineSegments[0])
    // [[10, 20], [20, 30], [30, 40]]
    lineSegment: []
};

export default TheCanvas;