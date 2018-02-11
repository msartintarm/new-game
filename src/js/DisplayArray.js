// @flow
import * as React from 'react';

const BAD_JSON_WARNING = 'JSON does not like the array passed';

type Props = {
	array: number[];
	line_label: string;

};

const setArray = (arrOrNum: number): number => {
	return Math.floor(arrOrNum);
};

class DisplayArray extends React.Component<Props> {

	timer: number;
	floorArr: number[];

	constructor (propz: Props) {
		super(propz);
		this.timer = 0;
		this.floorArr = propz.array.map(setArray);
	}

	shouldComponentUpdate () {
		const newTime = (this.timer + 1) % 30;
		this.timer = newTime;
		return (newTime === 0);
	}
	componentWillUpdate (newProps: Props) {
		// can display either nested arrays or single level
		this.floorArr = newProps.array.map(setArray);
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
