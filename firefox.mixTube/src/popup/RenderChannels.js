/*----------------------------------------*\
  mixTube - RenderChannels.js
  @author Evrard Vincent (vincent@ogre.be)
  @Date:   2021-12-28 18:23:27
  @Last Modified time: 2021-12-28 22:11:36
\*----------------------------------------*/
import React from 'react';
import RenderChannel from './RenderChannel.js';

const RenderChannels = ({medias, left, right, onSwitchChannel}) => {
	

	return (
		<div className="mixTube-element mixTube-channels">
			<RenderChannel 
				className="mixTube-channel-left"
				tarcklist={left.map(tabId => medias[tabId])}
				onSwitchChannel={onSwitchChannel}
			/>
			<RenderChannel 
				className="mixTube-channel-right"
				tarcklist={right.map(tabId => medias[tabId])}
				onSwitchChannel={onSwitchChannel}
			/>
		</div>
	);
}

export default RenderChannels;