// @flow
import * as React from 'react';

// import { registerHandler } from './EventHandler';

type Props = {
    children: React.ChildrenArray<*>
};

type State = {
    is_open: boolean
};



class ExpandableOption extends React.Component<Props, State> {
	constructor(props: Props) {
		super(props);
		this.state = { is_open: false };
	}
	render () {
		return this.props.children.map(option => {
				<div className="expandable_option">
				<h4> yo!</h4>
				{option}
			</div>
		});
	}
}


export default ExpandableOption;
