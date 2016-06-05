import Foot from './Foot';

/* Has its own line segments and manages connections to feet and arms */
class Body { 

    constructor(props) {
        this.Foot1 = (new Foot()).translate([0, 0]);
        this.Foot2 = (new Foot()).translate([20, 20]);
        this.lineSegments = [[57,130],[139,129]],[[96,130],[94,13],[125,44]];
    }

    getLines () {
        return [
	        this.lineSegments,
	        this.Foot1.getLines(),
	        this.Foot2.getLines()
        ];
	    }
}

export default Body;