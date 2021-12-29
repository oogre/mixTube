/*----------------------------------------*\
  mixTube - RenderMixer.js
  @author Evrard Vincent (vincent@ogre.be)
  @Date:   2021-12-28 18:32:49
  @Last Modified time: 2021-12-29 01:36:22
\*----------------------------------------*/
import React from 'react';
import { lerp, invlerp } from './../utilities/Math.js';

const RenderMixer = ({onVolumeChange, lvl=0}) => {


	const handleVolume = (event)=>{
		const value = invlerp(parseInt(event.target.min), parseInt(event.target.max), parseInt(event.target.value));
		onVolumeChange(event, value);
	}

	const min = -10;
	const max = 10;
	const val = lerp(min, max, lvl);
	return (
		<div className="mixTube-element mixTube-mixer">
			<input 
					class="volume" 
					type="range" 
					min={min}
					max={max}
					defaultValue={val}
					onChange={handleVolume.bind(this)}
				/>
		</div>
	);
}

export default RenderMixer;

