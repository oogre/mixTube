/*----------------------------------------*\
  mixTube - SubMenu.js
  @author Evrard Vincent (vincent@ogre.be)
  @Date:   2021-12-30 15:30:28
  @Last Modified time: 2022-01-05 18:19:19
\*----------------------------------------*/
import React from 'react';
import RenderTracklist from './RenderTracklist.js';
import { invlerp, lerp } from './../utilities/Math.js';
import Tooltip from './Tooltip.js';

const SubMenu = ({className, track, onSwitchChannel, onMuted=()=>{}, onRemove=()=>{}, onShow=()=>{}, onSpeedChange=()=>{}, onMouseLeft=()=>{}}) => {
	
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

	const dict = [
		[0.25, "1/4"],
		[0.33333333333333337, "1/3"],
		[0.41666666666666674, "0.5"],
		[0.5,  							  "1/2"],
		[0.5833333333333333,  "0.6"],
		[0.6666666666666667,  "2/3"],
		[0.75, 							  "0.75"],
		[0.8333333333333333,  "0.8"],
		[0.9166666666666666,  "0.9"],
		[1, 									"1"],
		[1.0833333333333335,  "1.1"],
		[1.1666666666666667,  "1.15"],
		[1.25, 								"1.25"],
		[1.3988888888888886, 	"1.4"],
		[1.636111111111111, 	"1.6"],
		[1.9899999999999998, 	"2"],
		[2.483888888888888, 	"2.5"],
		[3.1411111111111096, 	"3"],
		[3.985, 							"4"]
	];

	const [rate, value] = dict.find(entry=>{
		return Math.abs(entry[0] - track.playbackRate) < 1/12
	})

	// console.log(rate, value);
	return (
		<ul 
			className={ "mixTube-subMenu " + className} 
			onMouseEnter={handleMouseEnter.bind(this)} 
			onMouseLeave={handleMouseLeave.bind(this)}
		>
			<li className="mixTube-subMenu-horizontal">
				<ul>
					<li className="mixTube-subMenu-item">
						<Tooltip 
							title="remove" 
							position={Tooltip.topLeft}
						>
							<button 
								onClick={removeHandler.bind(this, track)} 
							>
								✖
							</button>
						</Tooltip>
					</li>
					<li className="mixTube-subMenu-item">
						<Tooltip 
							title="send to" 
							position={Tooltip.topMiddle}
						>
							<button onClick={switchChannelHandler.bind(this, track)}>
								<span className="mixTube-goLeft">A</span>
								<span className="mixTube-goRight">B</span>
							</button>
						</Tooltip>
					</li>
					<li className="mixTube-subMenu-item">
						<Tooltip 
							title="show" 
							position={Tooltip.topMiddle}
						>
							<button onClick={openHandler.bind(this, track)}>
								☉
							</button>
						</Tooltip>
					</li>
					<li className="mixTube-subMenu-item">
						<Tooltip 
							title={track.muted ? "unmute" : "mute" } 
							position={Tooltip.topRight}
						>
							<button 
								className={track.muted ? `muted` : "" } 
								onClick={muteHandler.bind(this, track)}
							>
								♪
							</button>
						</Tooltip>
					</li>
				</ul>
			</li>
			<li className="mixTube-subMenu-speed">
				<Tooltip title={`speed ${value}`} position={Tooltip.bottomMiddle}>
					<div>
						<input 
							type="range" 
							min={min}
							max={max}
							value={speed}
							onChange={handleChange.bind(this)}
						/>
					</div>
				</Tooltip>
			</li>			
		</ul>
	);
}

export default SubMenu;

