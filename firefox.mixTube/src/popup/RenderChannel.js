/*----------------------------------------*\
  mixTube - RenderChannel.js
  @author Evrard Vincent (vincent@ogre.be)
  @Date:   2021-12-28 18:25:37
  @Last Modified time: 2021-12-31 13:18:14
\*----------------------------------------*/
import React from 'react';
import RenderTracklist from './RenderTracklist.js';

const RenderChannel = ({tarcklist, onSwitchChannel, className=""}) => {
	return (
		<div className={ className + " mixTube-channel" }>
			<RenderTracklist tarcklist={tarcklist} onSwitchChannel={onSwitchChannel}/>
		</div>
	);
}

export default RenderChannel;