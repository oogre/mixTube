/*----------------------------------------*\
  mixTube - RenderController.js
  @author Evrard Vincent (vincent@ogre.be)
  @Date:   2021-12-28 18:30:42
  @Last Modified time: 2022-01-04 14:04:05
\*----------------------------------------*/
import React from 'react';
import { on, sendMessage } from './../utilities/com.js';
import useAnimationFrame from './../utilities/useAnimationFrame.js'
import Tooltip from './Tooltip.js';

const RenderCue = ({ isCuing, setCuing, track }) => {
	const [step, setStep] = React.useState(0);
	const cueTime = React.useRef({
		start : null,
		stop : null
	});
	const looper = React.useRef(null);

	const cueUpHandler = (track, event)=>{
		if(!track.playing)return;
		cueTime.current.stop = track.currentTime;
		if(cueTime.current.stop == cueTime.current.start){
			cueTime.current.stop = cueTime.current.start = null;
			setCuing(false);
			return;
		}
		const loop = () => {
			track.currentTime = cueTime.current.start;
			sendMessage("setCurrentTime", track)
				.then(() => { })
				.catch(e => error(e));	
		}
		clearInterval(looper.current);
		looper.current = null;
		looper.current = setInterval(loop, (cueTime.current.stop - cueTime.current.start) * 1000)
		loop();
	}

	const cueDownHandler = (track, event)=>{
		if(!track.playing)return;
		clearInterval(looper.current);
		looper.current = null;
		cueTime.current.start = track.currentTime;
		setCuing(true);
	}

	useAnimationFrame(time => {
		setStep(prevStep => prevStep + 1 );	
		return time + 30;
 	});

 	if(!isCuing){
 		clearInterval(looper.current);
		looper.current = null;
 	}

	return (
		<Tooltip title="loop">
			<button 
				onMouseUp={cueUpHandler.bind(this, track)} 
				onMouseDown={cueDownHandler.bind(this, track)}
			>
			{	 
				(!isCuing || (step>>1) % 2 == 0) && 
					<span>♯</span>
			}
			</button>
		</Tooltip>
	);
}

export default RenderCue;