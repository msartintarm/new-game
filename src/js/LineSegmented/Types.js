// @flow
export type Segment = number[]; // A line segment is an array of points
export type Frame = (Segment)[]; // A frame consists of multiple segments
export type Vector = number[]; // Always a fixed length segment

export type Options = {
    translate?: number[],
    numFrames?: number,
    setToFrame?: number,
    fillStyle?: CanvasPattern | string,
    fillFrames?: boolean[],
    collisionIndex?: number
};
