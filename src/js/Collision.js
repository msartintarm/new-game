const NON_LINE_WARNING = "You need a 2d line to detect collisions. [1, 99, 3, 97]. Kapisch please.";

import lineIntersection from './LineSegmented/lineIntersection';

/*
    Contains lines and checks for collisions between them and env.
    Returns coords where collisions occurs in JSON object:
    {
        points: [pointX, pointY],
        line: [lineAX, lineAY, lineBX, lineBY]
    }
*/
const DetectCollision = (theLine, theSegs) => {

    if (theLine.length !== 4) { throw (NON_LINE_WARNING); }
    const resArr = [];
    const lnAX = theLine[0];
    const lnAY = theLine[1];
    const lnBX = theLine[2];
    const lnBY = theLine[3];
    for (const line of theSegs) {
        if (line.length < 4) { break; } // no segs here
        let aX, aY, bX, bY;
        for (let i = 0; i < line.length - 2; i += 2) {
            aX = line[i];
            aY = line[i+1];
            bX = line[i+2];
            bY = line[i+3];
            const res = lineIntersection(lnAX, lnAY, lnBX, lnBY, aX, aY, bX, bY);
            if (res) {
                resArr.push({
                    coords: [...res],
                    line: [ aX, aY, bX, bY ],
                    srcLine: [...theLine]
                });
            }
        }
    }
    return resArr;
};

export { DetectCollision };
