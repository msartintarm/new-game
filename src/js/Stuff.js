import Hook from './LineSegmented/Hook';
import TwoTonWeight from './LineSegmented/TwoTonWeight';
import Floor from './LineSegmented/Floor';

class Stuff {
	constructor () {
		this.hook = new Hook().translate([-582, 202]);
		this.weight = (new TwoTonWeight()).translate([597,227]).translate([-582, 202]);
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
		return this.floor.getLines();
	};
}

export default Stuff
