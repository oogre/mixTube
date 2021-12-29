/*----------------------------------------*\
  mixTube - RenderItem.js
  @author Evrard Vincent (vincent@ogre.be)
  @Date:   2021-12-28 17:37:08
  @Last Modified time: 2021-12-28 17:42:02
\*----------------------------------------*/

import React from 'react';
import { lerp, invlerp } from './../utilities/Math.js';
import { on, sendMessage } from './../utilities/com.js';

const RenderItem = ({item}) => {

	const handlePlay = (item, event)=>{
		sendMessage("play", item)
			.then(() => { })
			.catch(e => error(e));
	}
	const handlePause = (item, event)=>{
		sendMessage("pause", item)
			.then(() => { })
			.catch(e => error(e));
	}
	const handleProgress = (item, event)=>{
		item.currentTime = event.target.value * 0.01 * item.duration;
		sendMessage("progress", item)
			.then(() => { })
			.catch(e => error(e));
	}
	const handleVolume = (item, event)=>{
		item.volume = event.target.value*0.01;
		sendMessage("volume", item)
			.then(() => { })
			.catch(e => error(e));
	}

	const handleSpeed = (item, event)=>{
		item.playbackRate = event.target.value*0.01;
		item.playbackRate = lerp(0.5, 2, item.playbackRate);
		sendMessage("speed", item)
			.then(() => { })
			.catch(e => error(e));
	}

	return (
		<ul>
			<li>{item.title}</li>
			<li>
				{
					
					item.playing ?
					<button 
						onClick={handlePause.bind(this, item)}
					>
						pause
					</button>
					:
					<button 
						onClick={handlePlay.bind(this, item)}
					>
						play
					</button>
				}
				
			</li>
			<li>
				<input 
					class="progressBar" 
					type="range" 
					min="0" 
					max="100" 
					defaultValue={item.currentTime / item.duration * 100}
					onChange={handleProgress.bind(this, item)}
				/>

			</li>

			<li>
				<input 
					class="volume" 
					type="range" 
					min="0" 
					max="100" 
					defaultValue={item.volume * 100}
					onChange={handleVolume.bind(this, item)}
				/>
			</li>

			<li>
				<input 
					class="volume" 
					type="range" 
					min="0" 
					max="100" 
					defaultValue={ invlerp(0.5, 2, item.playbackRate) * 100}
					onChange={handleSpeed.bind(this, item)}
				/>
			</li>
		</ul>
	);
}

export default RenderItem;