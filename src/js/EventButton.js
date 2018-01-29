import * as React from 'react';

import { registerHandler, deregisterHandler } from './EventHandler';

// for keys that fromCharCode doesn't define
const keyCodeMap = {
	16: 'Left Shift',
	32: 'Space',
	37: 'Left',
	38: 'Up',
	39: 'Right',
	40: 'Down'
};

const getKeycodeName = (val) => {
	return keyCodeMap[val]
		|| String.fromCharCode(val).trim()
		|| '\'' + val + '\'';
};

let initial_val = 54; // first button has key '7'
class EventButton extends React.Component {
	constructor(props) {
		super(props);
		this.key_val = ++initial_val;
		this.className=(this.props.name + ' button').replace(/ /g,"-");
		this.state = this.addStartButtonText({});
		this.setKey = this.setKey.bind(this);
		this.buttonMouseDown = this.buttonMouseDown.bind(this);
		registerHandler("mousedown", this.className, this.buttonMouseDown);
	}

	/* Edits provided object and adds key / val pair for button text */
	addStartButtonText (obj) {
		const keyName = getKeycodeName(this.key_val);
		obj.button_text = 'Set ' + (this.props.name || 'the')
			+ ' keycode (currently ' + keyName + ')';
		return obj;
	}

	/* Edits provided object and adds key / val pair for button text */
	addSetButtonText (obj) {
		const keyName = getKeycodeName(this.key_val);
		obj.button_text = 'The ' + (this.props.name || 'event')
			+ ' set to ' + keyName;
	}

	/* Returns function indexed by key that can be bound
		to DOM elements and deletes itself after execution
	*/
	setKey = (ev) => {
		const theCode = ev.keyCode;
		this.key_val = theCode;
		const newState = {};
		this.addSetButtonText(newState);
		this.setState(newState);
		deregisterHandler('keydown', 'default');
	};

	/* Returns function indexed by key that can be bound to DOM elements */
	buttonMouseDown = () => {
		const newState = { button_text: 'next key down..' };
		this.setState(newState);
		registerHandler('keydown', 'default', this.setKey);
	};

	render () {
		return (
			<button className={this.className} >
				{this.state.button_text}
			</button>
		)
	}

}

export default EventButton;
