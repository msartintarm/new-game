import LineSegmented from './LineSegmented';


let floorFrame = [
	[1,168,610,169,610,184,2,181,1,168],
	[3,794,2,769,779,764,782,785,3,794],
	[1596,1560,2,756],

	[257,6,728,26,742,351,727,366,347,361,
		346,378,773,389,762,22,1584,16,1564,
		880,1123,969,935,939,1570,1198,1568,
		1156,1164,998,1588,909,1552,14],

	[1606,1177,2441,546,2435,465,1660,1098,1687,
		44,2264,47,2192,333,1870,339,1894,165,
		1915,168,1912,294,2147,279,2177,119,
		1756,80,1732,933,1813,393,2315,363,
		2387,65,3168,50,3144,657,3159,2834,
		2789,2774,1624,1540,2768,525,2768,
		603,2765,279,2822,279,2825,792,
		2978,789,2978,828,2825,846,
		2822,900,2966,930,2969,978,
		2822,1017,2816,1071,2966,1122,
		2969,1195,2567,1189,2603,882,1870,
		1486,2069,1498,2078,1819,2876,1912,
		2912,2150,3105,2086,3102,1489,2411,
		1483,2405,1453,3180,1432]
];

class Floor {
    constructor(opts) {
	    return new LineSegmented(opts, floorFrame);
    }
}

export default Floor
