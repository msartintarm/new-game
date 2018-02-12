// @flow
import * as React from 'react';

import type {Frame, Segment} from './LineSegmented/Types';
import type Background from './Background';
import type Player from './Player';
import type Stuff from './Stuff';

const DEFAULT_SIZE = 800;

type ObjectsToDraw = Player | Stuff;

type Props = {

    lineSegments: Frame,
    // Array of 2D arrays -- see this._isLineSegment check.
    // The canvas draws them directly

    drawObjs: ObjectsToDraw[],
    // objects with .draw methods can be passed in instead.
    // They are passed the canvas context
    // These two methods prob have very different perf under load

    scale: number, // zoom level of canvas
    size: number, // size of canvas itself (in pixels)
    offset: number[], // offset of canvas viewport. Independent of scale
    positionAbsolute: boolean, // be relative by default,
    backgroundObj?: Background, // is drawn before offset and scaling
    show_canvas: boolean // is canvas shown?
};

/*
    Base-level canvas class that binds passed-down line segments with DOM canvas
    Also has a toggle button to show / hide canvas
    Is position: absolute and fills parent element starting at {0,0}
*/
class TheCanvas extends React.Component<Props> {

    ctx: CanvasRenderingContext2D;
    pattern_brick: string;
	canvas: HTMLCanvasElement;

    static defaultProps = {

        lineSegments: [],
        drawObjs: [],
        scale: 1,
        size: DEFAULT_SIZE,
        offset: [ 0,0 ],
        positionAbsolute: false,
        show_canvas: true
    };

    static CLASS = "the_canvas";

    componentDidMount () {
        this.ctx = this.canvas.getContext('2d');
        this._paint(this.props.lineSegments);
    }

    componentDidUpdate () {
        this._paint(this.props.lineSegments);
    }

    /*
        input needs to be 'line segment'
    */
    _paintLineSegment (points: Segment) {
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

    _paint (lineSegments: Frame) {

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

	setCanvasRef = (ref: React.ElementRef<*>) => { if (ref) { this.canvas = ref; }}

    _getCanvasProps () {
        return {
            ref: this.setCanvasRef,
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
