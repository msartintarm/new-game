import LineSegmented from './LineSegmented';


let floorFrame = [
	[1,168,610,169,610,184,2,181,1,168], [3,794,2,769,779,764,782,785,3,794],
	[1596,1560,2,756]
];

class Floor {
    constructor(opts) {
	    return new LineSegmented(opts, floorFrame);
    }
}

export default Floor
