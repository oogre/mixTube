/*----------------------------------------*\
  mixTube - RenderChannel.js
  @author Evrard Vincent (vincent@ogre.be)
  @Date:   2021-12-28 18:25:37
  @Last Modified time: 2022-01-04 13:23:44
\*----------------------------------------*/
import React from 'react';
import RenderTracklist from './RenderTracklist.js';

const RenderChannel = ({name, tarcklist, onSwitchChannel, className=""}) => {
	return (
		<div className={ className + " mixTube-channel" }>
			<div className="mixTube-channel-bg noselect">
				{name}
			</div>
			<RenderTracklist tarcklist={tarcklist} onSwitchChannel={onSwitchChannel}/>
		</div>
	);
}

export default RenderChannel;