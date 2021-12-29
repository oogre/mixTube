/*----------------------------------------*\
  mixTube - RenderChannel.js
  @author Evrard Vincent (vincent@ogre.be)
  @Date:   2021-12-28 18:25:37
  @Last Modified time: 2021-12-28 21:31:24
\*----------------------------------------*/
import React from 'react';
import RenderTracklist from './RenderTracklist.js';
import RenderController from './RenderController.js';

const RenderChannel = ({tarcklist, onSwitchChannel, className=""}) => {
	return (
		<div className={ className + " mixTube-channel" }>
			<RenderTracklist tarcklist={tarcklist} onSwitchChannel={onSwitchChannel}/>
		</div>
	);
}

export default RenderChannel;