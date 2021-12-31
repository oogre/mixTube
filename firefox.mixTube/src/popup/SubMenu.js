/*----------------------------------------*\
  mixTube - SubMenu.js
  @author Evrard Vincent (vincent@ogre.be)
  @Date:   2021-12-30 15:30:28
  @Last Modified time: 2021-12-31 01:13:56
\*----------------------------------------*/
import React from 'react';
import RenderTracklist from './RenderTracklist.js';
import RenderController from './RenderController.js';
import { invlerp, lerp } from './../utilities/Math.js';

const SubMenu = ({track, onSwitchChannel, onMuted=()=>{}, onRemove=()=>{}, onShow=()=>{}, onSpeedChange=()=>{}, onMouseLeft=()=>{}}) => {
	
	const timer = React.useRef(null);
	const min = -9;
	const max = 9;

	const handleMouseLeave = () => {
		timer.current = setTimeout(onMouseLeft, 250);
	}

	const handleMouseEnter = () => {

		clearTimeout(timer.current);
	}

	const switchChannelHandler = (track, event) => {
		onMouseLeft();
		onSwitchChannel(event, track);
	}

	const mapValToSpeed = input => {
		input = lerp(-3, 3, invlerp(min, max, input));
		if(input <= 1){
			return input * 0.25 + 1;
		}else{
			return Math.min(input * input * input * 0.105 + 1.15, 4);
		}
	}

	const mapSpeeadToVal = input => {
		if(input <= 1.25){
			return (input - 1) * 4 * 3
		}else{
			return Math.pow((input-1.15) * 9.52, 0.333) * 3;
		}
	}

	const handleChange = event => {
		let value = mapValToSpeed(parseInt(event.target.value));
		onSpeedChange(value);
	}

	const speed = mapSpeeadToVal(track.playbackRate);
	
	const openHandler = (track, event) => {
		onShow(track, event);
	}

	const muteHandler = (track, event) => {
		onMuted(track, event);
	}

	const removeHandler=(track, event) => {
		onRemove(track, event);
	}

	return (
		<ul 
			className="mixTube-subMenu" 
			onMouseEnter={handleMouseEnter.bind(this)} 
			onMouseLeave={handleMouseLeave.bind(this)}
		>
			<li>
				<button 
					onClick={removeHandler.bind(this, track)} 
				>
					✖
				</button>
				<button onClick={switchChannelHandler.bind(this, track)}>
					<span className="mixTube-goLeft">◀</span>
					<span className="mixTube-goRight">▶</span>
				</button>
				<button onClick={openHandler.bind(this, track)}>
					☉
				</button>
				<button className={track.muted ? `muted` : "" } onClick={muteHandler.bind(this, track)}>
					♪
				</button>
			</li>
			<li className="mixTube-subMenu-speed">
				<div>
					<input 
						type="range" 
						min={min}
						max={max}
						value={speed}
						onChange={handleChange.bind(this)}
					/>
				</div>
			</li>			
		</ul>
	);
}

export default SubMenu;

