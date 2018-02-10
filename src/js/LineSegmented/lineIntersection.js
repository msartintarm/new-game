// @flow

/// <summary>
/// Returns the determinant of the 2x2 matrix defined as
/// <list>
/// <item>| x1 x2 |</item>
/// <item>| y1 y2 |</item>
/// </list>
/// </summary>
const Det2 = (x1: number, x2: number, y1: number, y2: number) => {
    return (x1 * y2 - y1 * x2);
};

/// Returns the intersection point of the given lines.
/// Returns Empty if the lines do not intersect.
/// Source: http://mathworld.wolfram.com/Line-LineIntersection.html
/// </summary>
const lineIntersection = (x1: number, y1: number, x2: number, y2: number,
						  x3: number, y3: number, x4: number, y4: number) => {

    const tolerance = 0.000001;
    const EmptyPt = null;

    const a = Det2(x1 - x2, y1 - y2, x3 - x4, y3 - y4);
    if (Math.abs(a) < Number.EPSILON) return EmptyPt; // Lines are parallel

    const d1 = Det2(x1, y1, x2, y2);
    const d2 = Det2(x3, y3, x4, y4);
    const x = Det2(d1, x1 - x2, d2, x3 - x4) / a;
    const y = Det2(d1, y1 - y2, d2, y3 - y4) / a;

    if (x < Math.min(x1, x2) - tolerance ||
        x > Math.max(x1, x2) + tolerance) return EmptyPt;
    if (y < Math.min(y1, y2) - tolerance ||
        y > Math.max(y1, y2) + tolerance) return EmptyPt;
    if (x < Math.min(x3, x4) - tolerance ||
        x > Math.max(x3, x4) + tolerance) return EmptyPt;
    if (y < Math.min(y3, y4) - tolerance ||
        y > Math.max(y3, y4) + tolerance) return EmptyPt;

    return [ x, y ];

};

export default lineIntersection;
