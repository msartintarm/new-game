// @flow
import * as React from 'react';

type Props = {
	children?: React.Node,
	status: string,
	scale: number,
	decreaseScale: () => void,
	increaseScale: () => void
};

class GameSettings extends React.Component<Props> {
	render () {
		return(
				<div className="settings">
    				{this.props.children}
	    			<div className="settings_child">
		    		    <h3>Keys:</h3>
			    	</div>
				<div className="settings_child">
				Status: {this.props.status}
				</div>
		<div className="settings_child">
				        Zoom Level:
				<input type="button" value="-" onClick={this.props.decreaseScale}/>
				<input type="textarea" value={this.props.scale} readOnly/>
				<input type="button" value="+" onClick={this.props.increaseScale}/>
				</div>
				</div>
		);
	}
}

export default GameSettings;
