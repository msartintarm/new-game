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
let lineIntersection = (v1, v2, v3, v4) => {
	// type checking because JS doesn't have it...
	for (let arg of arguments) {
		if (typeof v1.X != "number" ||
			typeof v1.Y != "number" ) 
			throw (NON_NUMBER_WARNING);
	}

    let tolerance = 0.000001;
    let EmptyPt = { X:0, Y:0 };

    let a = Det2(v1.X - v2.X, v1.Y - v2.Y, v3.X - v4.X, v3.Y - v4.Y);
    if (Math.abs(a) < Number.EPSILON) return EmptyPt; // Lines are parallel

    let d1 = Det2(v1.X, v1.Y, v2.X, v2.Y);
    let d2 = Det2(v3.X, v3.Y, v4.X, v4.Y);
    let x = Det2(d1, v1.X - v2.X, d2, v3.X - v4.X) / a;
    let y = Det2(d1, v1.Y - v2.Y, d2, v3.Y - v4.Y) / a;

    if (x < Math.Min(v1.X, v2.X) - tolerance || 
    	x > Math.Max(v1.X, v2.X) + tolerance) return EmptyPt;
    if (y < Math.Min(v1.Y, v2.Y) - tolerance ||
    	y > Math.Max(v1.Y, v2.Y) + tolerance) return EmptyPt;
    if (x < Math.Min(v3.X, v4.X) - tolerance ||
    	x > Math.Max(v3.X, v4.X) + tolerance) return EmptyPt;
    if (y < Math.Min(v3.Y, v4.Y) - tolerance ||
    	y > Math.Max(v3.Y, v4.Y) + tolerance) return EmptyPt;

    return { X: x, Y: y };

};

export default lineIntersection
