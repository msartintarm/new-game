import * as React from 'react';

class GameSettings extends React.Component {
	constructor (props) {
		super(props);
	}

	render () {

		return(
				<div className="settings">
    				{this.props.children}
	    			<div className="settings_child">
		    		    <h3>Keys:</h3>
			    	</div>
				    <div className="settings_child">
				        Zoom Level:
				<input type="button" value="-" onClick={this.props.scale.decrease}/>
				<input type="textarea" value={this.props.scale.val} readOnly/>
				<input type="button" value="+" onClick={this.props.scale.increase}/>
				</div>
				</div>
		);
	}
}

export default GameSettings;
