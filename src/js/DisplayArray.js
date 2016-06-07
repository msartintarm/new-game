import Component from './Component';

const BAD_JSON_WARNING = 'JSON does not like the array passed';

class DisplayArray extends Component {
	render () {
		let text, label;

		try {
			text = JSON.stringify(this.props.array)
		} catch(e) {
			text = BAD_JSON_WARNING;
		}
		label = "Coords for " + this.props.line_label;

		return(
			<div className="display_array" >
				<b className="display_label">{label}</b>
				<div className="display_array_text">{text}</div>
			</div>
		);
	}
}

export default DisplayArray
