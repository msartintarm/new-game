import LineSegmented from './LineSegmented';


let floorFrame = [
	[1,168,610,169,610,184,2,181]
];

class Floor extends LineSegmented {
	constructor(opts) {
		super(opts, floorFrame);
	}
}

export default Floor
