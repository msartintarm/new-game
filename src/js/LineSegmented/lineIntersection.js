const NON_NUMBER_WARNING = "non number passed into LineIntersection, you twat.";

/// <summary>
/// Returns the determinant of the 2x2 matrix defined as
/// <list>
/// <item>| x1 x2 |</item>
/// <item>| y1 y2 |</item>
/// </list>
/// </summary>
let Det2 = (x1, x2, y1, y2) => {
    return (x1 * y2 - y1 * x2);
};

/// Returns the intersection point of the given lines. 
/// Returns Empty if the lines do not intersect.
/// Source: http://mathworld.wolfram.com/Line-LineIntersection.html
/// </summary>
let lineIntersection = (x1, y1, x2, y2, x3, y3, x4, y4) => {
	// type checking because JS doesn't have it...
	for (let oneArg of [x1, y1, x2, y2, x3, y3, x4, y4]) {
		if (typeof oneArg != "number") {
			throw (NON_NUMBER_WARNING);
        }
	}

    let tolerance = 0.000001;
    let EmptyPt = null;

    let a = Det2(x1 - x2, y1 - y2, x3 - x4, y3 - y4);
    if (Math.abs(a) < Number.EPSILON) return EmptyPt; // Lines are parallel

    let d1 = Det2(x1, y1, x2, y2);
    let d2 = Det2(x3, y3, x4, y4);
    let x = Det2(d1, x1 - x2, d2, x3 - x4) / a;
    let y = Det2(d1, y1 - y2, d2, y3 - y4) / a;

    if (x < Math.min(x1, x2) - tolerance ||
    	x > Math.max(x1, x2) + tolerance) return EmptyPt;
    if (y < Math.min(y1, y2) - tolerance ||
    	y > Math.max(y1, y2) + tolerance) return EmptyPt;
    if (x < Math.min(x3, x4) - tolerance ||
    	x > Math.max(x3, x4) + tolerance) return EmptyPt;
    if (y < Math.min(y3, y4) - tolerance ||
    	y > Math.max(y3, y4) + tolerance) return EmptyPt;

    return [x, y];

};

export default lineIntersection;
