const nullFn = function(){};

const SIZE = 200;
/*
    Canvas class that binds passed-down line segments with DOM canvas

    Supports line segments and mouse / touch events as props

*/
class TheCanvas extends React.Component { 

    componentDidMount () {
        this.ctx = this.refs.theCanvas.getContext('2d');
    }

    componentDidUpdate () {
        this._paint();
    }

    /*
        points format: array of arrays
        [[0,1], [1,2],[2,3]]
    */
    _paintLineSegment (points) {
        if (!points || points.length < 2 || points[0].length < 2) {
            return;
        }
        this.ctx.beginPath();
        this.ctx.moveTo.apply(this.ctx, points[0]);
        for (var i = 1; i < points.length; ++i) {
            this.ctx.lineTo.apply(this.ctx, points[i]);
        }
        this.ctx.stroke();
    }

    _paint () {

        this.ctx.fillStyle = '#F00';
        this.ctx.fillRect(0, 0, SIZE, SIZE);

        for (let i = 0; i < this.props.lineSegments.length; ++i) {
            this.ctx.save();
            this._paintLineSegment(this.props.lineSegments[i]);
            this.ctx.restore();
        }

    }

    _getCanvasProps () {
        return {
            ref: "theCanvas",
            width: SIZE,
            height: SIZE
        };
    }

    render () {
        return (
            <div>
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