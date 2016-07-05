import Hook from './LineSegmented/Hook';
import TwoTonWeight from './LineSegmented/TwoTonWeight';
import Floor from './LineSegmented/Floor';

class Stuff {
	constructor () {
		let theOffset = [ -582, 202 ];
		this.hook = new Hook().translate(theOffset);
		this.weight = (new TwoTonWeight()).translate([ 597,227 ]).translate(theOffset);
		this.floor = new Floor();
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

    draw (ctx) {
        this.hook.draw(ctx);
        this.weight.draw(ctx);
        this.floor.draw(ctx);
    }

}

export default Stuff
