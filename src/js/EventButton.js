import Component from './Component';

// for keys that fromCharCode doesn't define
const keyCodeMap = {
	16: 'Left Shift',
	32: 'Space',
	37: 'Left',
	38: 'Up',
	39: 'Right',
	40: 'Down'
};

class EventButton extends Component {
	constructor(props) {
		super(props);
		this.key_val = 55;
		this.state = {
			button_text: 'Set ' + this.props.name + ' keycode (currently '
				+ this.getKeycodeName() + ')'
		};
		this.className=(this.props.name + ' button').replace(/ /g,"-");

		this.addStartButtonText(this.state);
		this.setKey = this.setKey.bind(this);
		this.buttonMouseDown = this.buttonMouseDown.bind(this);
		this.registerHandler("mousedown", this.className, this.buttonMouseDown);
	}

	/* Edits provided object and adds key / val pair for button text */
	addStartButtonText (obj) {
		let keyName = this.getKeycodeName();
		obj.button_text = 'Set ' + (this.props.name || 'the')
			+ ' keycode (currently ' + keyName + ')';
	}

	/* Edits provided object and adds key / val pair for button text */
	addSetButtonText (obj) {
		let keyName = this.getKeycodeName();
		obj.button_text = 'The ' + (this.props.name || 'event')
			+ ' set to ' + keyName;
	}

	getKeycodeName () {
	return keyCodeMap[this.key_val]
		|| String.fromCharCode(this.key_val).trim()
		|| '\'' + this.key_val + '\'';
	}

	/* Returns function indexed by key that can be bound
		to DOM elements and deletes itself after execution
	*/
	setKey (ev) {
		let theCode = ev.keyCode;
		this.key_val = theCode;
		let newState = {};
		this.addSetButtonText(newState);
		this.setState(newState);
		document.body.removeEventListener('keydown', this.setKey);
	}

	/* Returns function indexed by key that can be bound to DOM elements */
	buttonMouseDown (e) {
		console.log("Button mouse down yo!");
		let newState = { button_text: 'next key down..' };
		this.setState(newState);
		console.log("State set yo!");
		document.body.addEventListener('keydown', this.setKey);
	}

	render () {
		return (
			<button className={this.className} >
				{this.state.button_text} 
			</button>
		)
	}

}

export default EventButton;
