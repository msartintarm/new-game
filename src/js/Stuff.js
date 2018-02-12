// @flow
import type LineSegmented from './LineSegmented/LineSegmented';
import type {Frame, Vector} from './LineSegmented/Types';

import Hook from './LineSegmented/Hook';
import TwoTonWeight from './LineSegmented/TwoTonWeight';
import Floor from './LineSegmented/Floor';


type Things = {
	hooks?: Vector[];
	floors?: Vector[];
	weights?: Vector[];
};

class Stuff {
	things: LineSegmented[];
	floors: LineSegmented[];
	hooks: LineSegmented[];
	weights: LineSegmented[];

	constructor (things: Things) {
		this.hooks = things.hooks? things.hooks.map(
			offset => Hook.create({translate: offset})
		) : [];
		this.floors = things.floors? things.floors.map(
			() => Floor.create()
		) : [];
		this.weights = things.weights? things.weights.map(
			offset => TwoTonWeight.create({translate: offset})
		) : [];

		this.things = [ ...this.hooks, ...this.floors, ...this.weights ];

	}

	getLines (): Frame {
		let arr: Frame = [];
		for (const thing of this.things) {
			arr = arr.concat(thing.getLines());
		}
		return arr;
	}

	getCollisionLines = () => {
		let arr: Frame = [];
		for (const thing of this.floors) {
			arr = arr.concat(thing.getLines());
		}
		for (const thing of this.weights) {
			arr = arr.concat(thing.getCollisionLines());
		}
		return arr;
	};

	draw (ctx: CanvasRenderingContext2D) {
		for (const one_thing of this.things) {
			one_thing.draw(ctx);
		}
    }

}

export default Stuff
