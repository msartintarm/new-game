import LineSegmented from './LineSegmented';


let floorFrame = [
	[1,168,610,169,610,184,2,181,1,168], [3,794,2,769,779,764,782,785,3,794]
];

class Floor extends LineSegmented {
	constructor(opts) {
		super(opts, floorFrame);
	}
}

export default Floor
