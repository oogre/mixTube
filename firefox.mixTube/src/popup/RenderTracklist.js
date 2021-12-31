/*----------------------------------------*\
  mixTube - RenderTracklist.js
  @author Evrard Vincent (vincent@ogre.be)
  @Date:   2021-12-28 18:29:29
  @Last Modified time: 2021-12-30 23:59:19
\*----------------------------------------*/
import React from 'react';
import RenderTrack from './RenderTrack.js';
import { on, sendMessage } from './../utilities/com.js';


const RenderTracklist = ({tarcklist, onSwitchChannel}) => {

	const handleAdd = event => {
		sendMessage("openYoutube")
			.then(() => { })
			.catch(e => error(e));
	}
	return (
		<ul className="mixTube-element mixTube-tarcklist">
			{
				tarcklist.map(track => (
					<RenderTrack 
						track={track}
						onSwitchChannel={onSwitchChannel}
					/>
				))
			}
			{/*<li className="mixTube-tarcklist-item mixTube-tarcklist-add">
				<button onClick={handleAdd.bind(this)}>+</button>
			</li>*/}
		</ul>
	);
}

export default RenderTracklist;