/*----------------------------------------*\
  mixTube - RenderTracklist.js
  @author Evrard Vincent (vincent@ogre.be)
  @Date:   2021-12-28 18:29:29
  @Last Modified time: 2021-12-29 12:59:48
\*----------------------------------------*/
import React from 'react';
import { on, sendMessage } from './../utilities/com.js';
import { lerp } from './../utilities/Math.js';
import Marquee from './Marquee.js';

const RenderTracklist = ({tarcklist, onSwitchChannel}) => {
	// console.log(tarcklist);
	const switchChannelHandler = (track, event) => {
		onSwitchChannel(event, track);
	}
	const playHandler = (track, event) => {
		sendMessage("play", track)
			.then(() => { })
			.catch(e => error(e));
	}

	const pauseHandler = (track, event) => {
		sendMessage("pause", track)
			.then(() => { })
			.catch(e => error(e));
	}
	const timeConverter = (time)=> {
		function str_pad_left(string,pad,length) {
			return (new Array(length+1).join(pad)+string).slice(-length);
		}

		var hours = Math.floor(time / 3600);
		time -= hours*3600;
		var minutes = Math.floor(time / 60);
		time -= minutes*60;
		var seconds = Math.floor(time);
		time -= seconds;
		var millis = time;

		time = "";
		if(hours > 0){
			time += str_pad_left(hours,'0',2) + ":"
		}
		time += str_pad_left(minutes,'0',2) + ":"
		time += str_pad_left(seconds,'0',2)
		return time;
	}

	const min = 0;
	const max = 100;

	return (
		<ul className="mixTube-element mixTube-tarcklist draggable">
			{
				tarcklist.map(track => (
					<li className="mixTube-tarcklist-item">
						<ul>
							<li style={{ width:"25px"}}>
								{
									track.playing ? 
										<button onClick={pauseHandler.bind(this, track)}>
											<span>▷</span>
										</button>
									:
										<button onClick={playHandler.bind(this, track)}>
											<span>▶</span>
										</button>
									}
							</li>
							<li className="title screen" style={{width:"70%"}}>
								<Marquee 
									text={track.title}
								/>
							</li>
							<li style={{width:"30%"}}>
								{
									timeConverter(track.currentTime)}/{timeConverter(track.duration)
								}
							</li>
							<li style={{width:"25px"}}>
								<button onClick={switchChannelHandler.bind(this, track)}>
									<span className="mixTube-goLeft">{"<"}</span>
									<span className="mixTube-goRight">{">"}</span>
								</button>
							</li>
						</ul>
						<div className="mixTube-tarcklist-seek-bar">
							<input 
								type="range" 
								min={min}
								max={max}
								value={lerp(min, max, track.currentTime/track.duration)}
								//onChange={handleVolume.bind(this)}
							/>
						</div>
					</li>
				))
			}
		</ul>
	);
}

export default RenderTracklist;