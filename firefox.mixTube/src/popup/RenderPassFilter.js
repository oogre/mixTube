/*----------------------------------------*\
  mixTube - RenderPassFilter.js
  @author Evrard Vincent (vincent@ogre.be)
  @Date:   2022-01-05 23:27:07
  @Last Modified time: 2022-01-06 00:23:40
\*----------------------------------------*/
import React from 'react';
import { invlerp, lerp } from './../utilities/Math.js';
import Tooltip from './Tooltip.js';

const RenderPassFilter = ({ passFilter, onChange=()=>{} }) => {
	const min = -10;
	const max = 10;
	const val = passFilter * 10;

	const handleChange = event => {
		onChange(lerp(-1, 1, invlerp(min, max, event.target.value)));
	}
	return (
		<Tooltip title={`pass`} position={Tooltip.bottomMiddle}>
			<div>
				<input 
					type="range" 
					min={min}
					max={max}
					value={val}
					onChange={handleChange.bind(this)}
				/>
			</div>
		</Tooltip>
	);
}

export default RenderPassFilter;