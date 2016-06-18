import LineSegmented from './LineSegmented';


let floorFrame = [
	[1,168,610,169,610,184,2,181,1,168],
	[3,794,2,769,779,764,782,785,3,794],
	[1596,1560,2,756],

	[257,6,728,26,742,351,727,366,347,361,
		346,378,773,389,762,22,1584,16,1564,
		880,1123,969,935,939,1570,1198,1568,
		1156,1164,998,1588,909,1552,14]

];

class Floor {
    constructor(opts) {
	    return new LineSegmented(opts, floorFrame);
    }
}

export default Floor
