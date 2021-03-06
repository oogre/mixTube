/*----------------------------------------*\
  mixTube - Seekbar.js
  @author Evrard Vincent (vincent@ogre.be)
  @Date:   2021-12-30 14:19:33
  @Last Modified time: 2022-01-06 15:39:00
\*----------------------------------------*/

import React from 'react';
import { invlerp, lerp } from './../utilities/Math.js';
import Tooltip from './Tooltip.js';
const Seekbar = ({ currentTime, duration, progress, onChange=()=>{} }) => {
	const min = 0;
	const max = 1000;
	const val = lerp(min, max, progress);
	const [mouse, setMouse] = React.useState({x:0, y:0});

	const updateMousePosition = event => {
		let rect = event.target.getBoundingClientRect();
		const [x, y] =[(event.clientX - rect.left)/rect.width, (event.clientY - rect.top)/rect.height]
		setMouse({
			x : x,
			y : y
		});
	}

	const mouseEnterHandler = event => {
		updateMousePosition(event);
		setDisplay(true);
	}
	const mouseLeaveHandler = ()=>{
		setDisplay(false);	
	}

	Number.prototype.toHHMMSS = function () {
		var sec_num = this; // don't forget the second param
		var hours   = Math.floor(sec_num / 3600);
		var minutes = Math.floor((sec_num - (hours * 3600)) / 60);
		var seconds = sec_num - (hours * 3600) - (minutes * 60);
		if (hours   < 10) {hours   = "0"+hours;}
		if (minutes < 10) {minutes = "0"+minutes;}
		if (seconds < 10) {seconds = "0"+seconds.toFixed(2);}
		else seconds = seconds.toFixed(3);
		while(seconds.length<6)seconds+="0";
		return hours+':'+minutes+':'+seconds;
	}

	const handleChange = event => {
		onChange(mouse.x);
	}
	return (
		<Tooltip title={`${(mouse.x*duration).toHHMMSS()}`} position={Tooltip.topCursor}>
			<input 
				onMouseMove={updateMousePosition.bind(this)}
				type="range" 
				min={min}
				max={max}
				value={val}
				onChange={handleChange.bind(this)}
			/>
		</Tooltip>
	);
}

export default Seekbar;