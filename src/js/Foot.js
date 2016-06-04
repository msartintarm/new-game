import Component from './Component';

/* The Foot */
class Foot { 
    render () { return null; }
    componentDidMount () {
        this.ctx = this.refs.theCanvas.getContext('2d');
        this.registerList
    }

    componentDidUpdate () {
        this._paint();
    }
}

Foot.defaultProps = {
    // format array of array of 2D array: 
    // [ [[10, 20], [20, 30], [30, 40]], [[10, 30], [20, 30]] ]
    lineSegments: [],
    // format: array of 2D array (same as lineSegments[0])
    // [[10, 20], [20, 30], [30, 40]]
    lineSegment: []
};

export default Foot;