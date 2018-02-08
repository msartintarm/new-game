// @flow
import type LineSegmented from './LineSegmented/LineSegmented';
import Hook from './LineSegmented/Hook';
import TwoTonWeight from './LineSegmented/TwoTonWeight';
import Floor from './LineSegmented/Floor';

class Stuff {

	floor: LineSegmented;
	hook: Hook;
	weight: LineSegmented;

	constructor () {
		const theOffset = [ -582, 202 ];
		this.hook = new Hook().translate(theOffset);
		this.weight = TwoTonWeight.create().translate([ 597,227 ]).translate(theOffset);
		this.floor = Floor.create();
	}

	getLines () {
		return [
			...this.hook.getLines(),
			...this.weight.getLines(),
			...this.floor.getLines()

		];
	}

	getCollisionLines = () => {
		return [
			...this.floor.getLines(),
			...this.weight.getCollisionLines()
		];
	};

    draw (ctx: CanvasRenderingContext2D) {
        this.hook.draw(ctx);
        this.weight.draw(ctx);
        this.floor.draw(ctx);
    }

}

export default Stuff
