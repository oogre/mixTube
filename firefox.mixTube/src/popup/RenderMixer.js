/*----------------------------------------*\
  mixTube - RenderMixer.js
  @author Evrard Vincent (vincent@ogre.be)
  @Date:   2021-12-28 18:32:49
  @Last Modified time: 2022-01-05 11:49:02
\*----------------------------------------*/
import React from 'react';
import { lerp, invlerp } from './../utilities/Math.js';
import Tooltip from './Tooltip.js';
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
			<Tooltip title="mixer" position={Tooltip.bottomCursor}>
				<input 
					class="volume" 
					type="range" 
					min={min}
					max={max}
					defaultValue={val}
					onChange={handleVolume.bind(this)}
				/>
			</Tooltip>
		</div>
	);
}

export default RenderMixer;

