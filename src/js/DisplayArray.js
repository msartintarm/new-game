import Component from './Component';

const BAD_JSON_WARNING = 'JSON does not like the array passed';

class DisplayArray extends Component {
	constructor (propz) {
		super(propz);
		this.timer = 0;
		this.floorArr = propz.array.map((childArr) => {
			return childArr.map((num) => {
				return Math.floor(num);
			});
		});
	}

	shouldComponentUpdate () {
		const newTime = (this.timer + 1) % 30;
		this.timer = newTime;
		return (newTime === 0);
	}
	componentWillUpdate (newProps) {
		// can display either nested arrays or single level
		this.floorArr = newProps.array.map((arrOrNum) => {
			if (typeof arrOrNum === "number") {
				return Math.floor(arrOrNum);
			}
			return arrOrNum.map((num) => {
					return Math.floor(num);
			});
		});
	}
	render () {

		let text;

		try {
			text = JSON.stringify(this.floorArr);
		} catch(e) {
			text = BAD_JSON_WARNING;
		}
		const label = "Coords for " + this.props.line_label;

		return(
			<div className="display_array" >
				<b className="display_label">{label}</b>
				<div className="display_array_text">{text}</div>
			</div>
		);
	}
}

export default DisplayArray;
