/*----------------------------------------*\
  bcksp.es - popup.js
  @author Evrard Vincent (vincent@ogre.be)
  @Date:   2018-05-29 00:52:06
  @Last Modified time: 2021-12-21 17:13:08
\*----------------------------------------*/

import React from 'react';
import ReactDOM from 'react-dom';
import { lerp, invlerp } from './../utilities/Math.js';
import { on, sendMessage } from './../utilities/com.js';
import { isBoolean } from './../utilities/validation.js';
import { log, info, warn, error } from './../utilities/log.js';

//T.setTexts(JSON.parse(localStorage.getItem("translation")), { MDFlavor: 1 });
let closeTimeOut;

const Popup = ({connected, loggedIn}) => {
	React.useEffect(() => {//componentDidMount
		document.querySelector(".bcksp-popup").addEventListener("mouseleave", mouseLeavePopupHandler);
		document.querySelector(".bcksp-popup").addEventListener("mouseenter", mouseEnterPopupHandler);
		return () => {//componentWillUnmount
			document.querySelector(".bcksp-popup").removeEventListener("mouseleave", mouseLeavePopupHandler);
			document.querySelector(".bcksp-popup").removeEventListener("mouseenter", mouseEnterPopupHandler);
		}
	}, []); 

	const [medias, setMedias] = React.useState({});

	React.useEffect(() => {//componentDidMount
		sendMessage("getMedias")
		.then(medias => setMedias(medias))
		.catch(e => error(e));

		on("medias", (medias, resolve) => {
			setMedias(medias)
			resolve(true);
		});
		return () => {//componentWillUnmount
		
		}
	}, []);
	
	const mouseEnterPopupHandler = event => {
		clearTimeout(closeTimeOut);
	}
	const mouseLeavePopupHandler = event => {
		closeTimeOut = setTimeout(()=>{
			sendMessage("closePopup")
			.then(() => { })
			.catch(e => error(e));
		}, 500);
	}
	const handlePlay = (item, event)=>{
		sendMessage("play", item)
			.then(() => { })
			.catch(e => error(e));
	}
	const handlePause = (item, event)=>{
		sendMessage("pause", item)
			.then(() => { })
			.catch(e => error(e));
	}
	const handleProgress = (item, event)=>{

		item.currentTime = event.target.value * 0.01 * item.duration;
		sendMessage("progress", item)
			.then(() => { })
			.catch(e => error(e));
	}
	const handleVolume = (item, event)=>{
		item.volume = event.target.value*0.01;
		sendMessage("volume", item)
			.then(() => { })
			.catch(e => error(e));
	}

	const handleSpeed = (item, event)=>{
		item.playbackRate = event.target.value*0.01;
		item.playbackRate = lerp(0.5, 2, item.playbackRate);
		sendMessage("speed", item)
			.then(() => { })
			.catch(e => error(e));
	}

	const RenderItem = ({item})=>{
		return (
			<ul>
				<li>{item.title}</li>
				<li>
					{
						
						item.playing ?
						<button 
							onClick={handlePause.bind(this, item)}
						>
							pause
						</button>
						:
						<button 
							onClick={handlePlay.bind(this, item)}
						>
							play
						</button>
					}
					
				</li>
				<li>
					<input 
						class="progressBar" 
						type="range" 
						min="0" 
						max="100" 
						defaultValue={item.currentTime / item.duration * 100}
						onChange={handleProgress.bind(this, item)}
					/>

				</li>

				<li>
					<input 
						class="volume" 
						type="range" 
						min="0" 
						max="100" 
						defaultValue={item.volume * 100}
						onChange={handleVolume.bind(this, item)}
					/>
				</li>

				<li>
					<input 
						class="volume" 
						type="range" 
						min="0" 
						max="100" 
						defaultValue={ invlerp(0.5, 2, item.playbackRate) * 100}
						onChange={handleSpeed.bind(this, item)}
					/>
				</li>
			</ul>
		);
	}

	return (
		<div className="bcksp-popup">
			{
				Object.values(medias)
				.map((media, k) => (
					<RenderItem 
						key={k}
						item={media}
					/>
				))
			}
		</div>
	);
}

	ReactDOM.render(<Popup/>, document.getElementById('app'))	