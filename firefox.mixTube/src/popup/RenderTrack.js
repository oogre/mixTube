/*----------------------------------------*\
  mixTube - RenderTrack.js
  @author Evrard Vincent (vincent@ogre.be)
  @Date:   2021-12-30 19:08:09
  @Last Modified time: 2021-12-31 13:44:23
\*----------------------------------------*/
import React from 'react';
import { on, sendMessage } from './../utilities/com.js';
import Marquee from './Marquee.js';
import Seekbar from './Seekbar.js';
import SubMenu from './SubMenu.js';
import RenderCue from './RenderCue.js';


const RenderTrack = ({track, onSwitchChannel}) => {
	// console.log(tarcklist);
	const [subMenuVisible, setSubMenuVisible] = React.useState(false);
	
	const cueTime = React.useRef({
		start : null,
		stop : null
	});
	const cueDownTime = React.useRef(null);
	const looper = React.useRef(null);

	const playPauseHandler = (track, event) => {
		if(track.playing && looper.current != null) {
			clearInterval(looper.current);
			looper.current = null;
			cueTime.current.start = null;
			cueTime.current.stop = null;
		}else if (track.playing){
			sendMessage("pause", track)
				.then(() => { })
				.catch(e => error(e));
		}else{
			track.muted = false;
			sendMessage("muted", track)
				.then(() => { })
				.catch(e => error(e));
			sendMessage("play", track)
				.then(() => { })
				.catch(e => error(e));
		}
	}

	const pauseHandler = (track, event) => {
		
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

	const handleSwitchChannel = (event, tarck)=>{
		handleHideSubMenu();
		onSwitchChannel(event, tarck);
	}

	const handleProgress = (track, value)=>{
		track.currentTime = track.duration * value;
		sendMessage("setCurrentTime", track)
			.then(() => { })
			.catch(e => error(e));
	}

	const handleSpeed = (track, value)=>{
		track.playbackRate = value
		sendMessage("speed", track)
			.then(() => { })
			.catch(e => error(e));
	}

	const handleShow = (track, event) => {
		sendMessage("show", track)
			.then(() => { })
			.catch(e => error(e));
	}
	const handleRemove = (track, event) => {
		sendMessage("remove", track)
			.then(() => { })
			.catch(e => error(e));
	}

	const handleMute = (track, event) => {
		track.muted = !track.muted;
		sendMessage("muted", track)
			.then(() => { })
			.catch(e => error(e));
	}
	
	const handleShowSubMenu = ()=>{
		setSubMenuVisible(true);
	}

	const handleHideSubMenu = ()=>{
		setSubMenuVisible(false);
	}

	const cueUpHandler = (track, event)=>{
		if(!track.playing)return;
		cueTime.current.stop = track.currentTime;
		if(cueTime.current.stop == cueTime.current.start){
			cueTime.current.stop = cueTime.current.start = null;
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
		cueTime.current.start = track.currentTime
	}

	return (
		<li className={`mixTube-tarcklist-item ${track.muted ? `muted` : "" }`}>
			<ul>
				<li className="mixTube-tarcklist-item-play-pause">
					<button onClick={playPauseHandler.bind(this, track)}>
							<span>{track.playing ? '▶' : '▷'}</span>
						</button>
				</li>
				<li className="mixTube-tarcklist-item-cue">
					<RenderCue 
						isCuing={cueTime.current.start!=null}
						onMouseDown={cueDownHandler.bind(this)}
						onMouseUp={cueUpHandler.bind(this)}
						track={track} 
					/>
				</li>
				<li className="mixTube-tarcklist-item-title">
					<Marquee 
						run={track.playing ? 1 : 0}
						text={track.title}
					/>
				</li>
				<li 
					className="mixTube-tarcklist-item-menu" 
					onClick={handleShowSubMenu.bind(this)}
				>
					{
						subMenuVisible && 
							<SubMenu
								onMuted={handleMute.bind(this)}
								onRemove={handleRemove.bind(this)}
								onShow={handleShow.bind(this)}
								onMouseLeft={handleHideSubMenu.bind(this)}
								onSpeedChange={handleSpeed.bind(this, track)}
								onSwitchChannel={handleSwitchChannel.bind(this)}
								track={track}
							/>
					}
					<div className="mixTube-menu-btn">
					 	<div></div>
						<div></div>
						<div></div> 
					</div>
				</li>
			</ul>
			<div className="mixTube-tarcklist-seek-bar">
				<Seekbar 
					progress={track.currentTime/track.duration}
					onChange={handleProgress.bind(this, track)}
				/>
			</div>
		</li>
	);
}

export default RenderTrack;