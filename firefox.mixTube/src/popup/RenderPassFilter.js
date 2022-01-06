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
	const range = 4;
	const min = -1*range;
	const max = range;
	const val = passFilter * range;

	const handleChange = event => {
		onChange(event.target.value / range);
	}
	const label = val == 0 ? "all" : (val < 0 ? "low" : "high");
	return (
		<Tooltip title={`${label}Pass`} position={Tooltip.topMiddle}>
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