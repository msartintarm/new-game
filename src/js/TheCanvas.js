import * as React from 'react';

const DEFAULT_SIZE = 800;

let warnCount = 0;

/*
    Base-level canvas class that binds passed-down line segments with DOM canvas
    Also has a toggle button to show / hide canvas
    Is position: absolute and fills parent element starting at {0,0}
*/
class TheCanvas extends React.Component {

    static defaultProps = {

        lineSegments: [],
        // Array of 2D arrays -- see this._isLineSegment check.
        // The canvas draws them directly

        drawObjs: [],
        // objects with .draw methods can be passed in instead.
        // They are passed the canvas context
        // These two methods prob have very different perf under load

        scale: 1, // zoom level of canvas
        size: DEFAULT_SIZE, // size of canvas itself (in pixels)
        offset: [ 0,0 ], // offset of canvas viewport. Independent of scale
        positionAbsolute: false, // be relative by default,
        backgroundObj: null, // is drawn before offset and scaling
        show_canvas: true // is canvas shown?
    };

    static CLASS = "the_canvas";

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
        } else if ((t = typeof points[0]) .toLowerCase() === "number") {
            return true;
        } else {
            if (warnCount <= 5) { // this can be printed out millions of times otherwise
                console.warn("Wrong type (non number) for line segment: " + t + "! :o");
                console.warn("Point list is:" + JSON.stringify(points));
                warnCount += 1;
            }
        }
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
        if (this.pattern_brick) {
            this.ctx.fill();
        }
        this.ctx.stroke();
        this.ctx.restore();
    }

    _paint (lineSegments) {

        // important optimization: do not draw canvases that are not being used
        if (!this.props.show_canvas) { return; }

        // either draw background or clear screen
        if (this.props.backgroundObj) {
            this.props.backgroundObj.draw(this.ctx);
        } else {
            this.ctx.clearRect(0, 0, this.props.size, this.props.size);
        }

        this.ctx.save();
        if (this.props.offset) {
            this.ctx.translate(...this.props.offset);
        }
        if (!!this.props.scale && this.props.scale != 1) {
            this.ctx.lineWidth = 1 / this.props.scale;
            this.ctx.scale(this.props.scale, this.props.scale);
        }
        if (!!this.pattern_brick &&
            this.ctx.fillStyle !== this.pattern_brick) {
            this.ctx.fillStyle = this.pattern_brick;
        }

        for (const obj of this.props.drawObjs) {
            obj.draw(this.ctx);
        }
        for (let i = 0; i < lineSegments.length; ++i) {
            this._paintLineSegment(lineSegments[i]);
        }
        this.ctx.restore();
    }

    _getContainerProps () {
        return {
            className: (this.props.positionAbsolute?
                'absolute_class canvas_container': 'canvas_container')
        };
    }

    _getCanvasProps () {
        return {
            ref: "theCanvas",
            width: this.props.size,
            height: this.props.size,
            className: (this.props.show_canvas?
                TheCanvas.CLASS: 'the_hidden_canvas')
        };
    }

    render () {
        return (
            <div {...this._getContainerProps()}>
                <canvas {...this._getCanvasProps()} />
            </div>
        );
    }
}


export default TheCanvas;
