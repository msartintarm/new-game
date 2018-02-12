// @flow
import * as React from 'react';
import DisplayArray from './DisplayArray';
//import ExpandableOption from './ExpandableOption';

type Props = {
	children?: React.Node,
	status: string,
	scale: number,
	decreaseScale: () => void,
	increaseScale: () => void,
	player_pos: number[],
	polygon: number[],
	new_line: number[]

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


  <DisplayArray array={this.props.player_pos} line_label="Playuh"/>
  <DisplayArray array={this.props.polygon} line_label="polygon"/>
  <DisplayArray array={this.props.new_line} line_label="new line"/>
</div>
		);
	}
}

export default GameSettings;
