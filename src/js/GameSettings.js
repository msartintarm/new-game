import * as React from 'react';

class GameSettings extends React.Component {
	constructor (props) {
		super(props);
	}

	getZoomLevel (zoomProp) {
		return zoomProp || "?";
	}

	render () {

		return(
				<div className="settings">
				<div className="settings_child">
				<h3>Keys:</h3>
							</div>
				<div className="settings_child">
				Zoom Level: {
					this.getZoomLevel(
						this.props.zoom)}
			</div>
				</div>
		);


	}
}

export default GameSettings;
