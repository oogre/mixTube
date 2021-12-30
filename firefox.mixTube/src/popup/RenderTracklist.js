/*----------------------------------------*\
  mixTube - RenderTracklist.js
  @author Evrard Vincent (vincent@ogre.be)
  @Date:   2021-12-28 18:29:29
  @Last Modified time: 2021-12-30 19:10:53
\*----------------------------------------*/
import React from 'react';
import RenderTrack from './RenderTrack.js';

const RenderTracklist = ({tarcklist, onSwitchChannel}) => {
	return (
		<ul className="mixTube-element mixTube-tarcklist draggable">
			{
				tarcklist.map(track => (
					<RenderTrack 
						track={track}
						onSwitchChannel={onSwitchChannel}
					/>
				))
			}
		</ul>
	);
}

export default RenderTracklist;