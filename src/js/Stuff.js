import Hook from './LineSegmented/Hook';
import TwoTonWeight from './LineSegmented/TwoTonWeight';

class Stuff {
	constructor () {
		this.hook = new Hook();
		this.weight = (new TwoTonWeight()).translate([597,227]);
	}

	getLines () {
		return [
			...this.hook.getLines(),
			...this.weight.getLines()
		];
	}
}

export default Stuff
