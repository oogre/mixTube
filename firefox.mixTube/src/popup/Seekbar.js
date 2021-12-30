/*----------------------------------------*\
  mixTube - Seekbar.js
  @author Evrard Vincent (vincent@ogre.be)
  @Date:   2021-12-30 14:19:33
  @Last Modified time: 2021-12-30 15:25:06
\*----------------------------------------*/

import React from 'react';
import { invlerp, lerp } from './../utilities/Math.js';

const Seekbar = ({ progress, onChange=()=>{} }) => {
	const min = 0;
	const max = 100;
	const val = lerp(min, max, progress);

	const handleChange = event => {
		onChange(invlerp(min, max, event.target.value)  );
	}

	return (
		<input 
			type="range" 
			min={min}
			max={max}
			value={val}
			onChange={handleChange.bind(this)}
		/>
	);
}

export default Seekbar;