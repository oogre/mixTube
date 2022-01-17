/*----------------------------------------*\
  bcksp.es - popup.js
  @author Evrard Vincent (vincent@ogre.be)
  @Date:   2018-05-29 00:52:06
  @Last Modified time: 2022-01-06 17:09:58
\*----------------------------------------*/

import React from 'react';
import ReactDOM from 'react-dom';
import RenderItem from "./RenderItem.js";
import RenderChannels from './RenderChannels.js';
import RenderMixer from './RenderMixer.js';
import { log, info, warn, error } from './../utilities/log.js';
import { on, sendMessage } from './../utilities/com.js';

let closeTimeOut;

const Popup = ({connected, loggedIn}) => {
	React.useEffect(() => {//componentDidMount
		document.querySelector(".mixTube-popup").addEventListener("mouseleave", mouseLeavePopupHandler);
		document.querySelector(".mixTube-popup").addEventListener("mouseenter", mouseEnterPopupHandler);
		return () => {//componentWillUnmount
			document.querySelector(".mixTube-popup").removeEventListener("mouseleave", mouseLeavePopupHandler);
			document.querySelector(".mixTube-popup").removeEventListener("mouseenter", mouseEnterPopupHandler);
		}
	}, []); 

	const [medias, setMedias] = React.useState([]);
	const [side, setSide] = React.useState([[], []]);
	const [lvl, setLvl] = React.useState(1);

	React.useEffect(() => {//componentDidMount
		sendMessage("getMedias")
			.then(({medias, side, lvl}) => {
				setMedias(medias);
				setSide(side);
				setLvl(lvl);
			})
			.catch(e => error(e));
		on("medias", ({medias, side, lvl}, resolve) => {
			setMedias(medias);
			setSide(side);
			setLvl(lvl);
			resolve(true);
		});
		return () => {}
	}, []);

	const switchChannelHandler = (event, {tabId}) => {
		sendMessage("setSide", tabId)
			.then(() => {})
			.catch(e => error(e));
	}

	const handleVolumeChange = (event, lvl) => {
		sendMessage("setVolumes", lvl)
			.then(() => {})
			.catch(e => error(e));
	}

	const closeHandler = ()=>{
		sendMessage("disablePopup")
			.then(() => {})
			.catch(e => error(e));
	}
	
	const mouseEnterPopupHandler = event => {
		// clearTimeout(closeTimeOut);
	}

	const mouseLeavePopupHandler = event => {
		// closeTimeOut = setTimeout(()=>{
		// 	sendMessage("closePopup")
		// 	.then(() => { })
		// 	.catch(e => error(e));
		// }, 500);
	}

	const mouseMove = event => {
		sendMessage("setSize", event.y + 20 )
			.then(() => {})
			.catch(e => error(e));

	}
	const mouseDownHandler = event =>{
		document.querySelector("body").addEventListener("mousemove", mouseMove);
		document.querySelector("body").addEventListener("mouseup", mouseUpHandler);
	}
	const mouseUpHandler = ()=>{
		document.querySelector("body").removeEventListener("mouseup", mouseUpHandler);
		document.querySelector("body").removeEventListener("mousemove", mouseMove);
	}

	return (
		<div className="mixTube-popup">
			<div className="mixTube-title-bar">
				<span className="mixTube-texture-bar"></span>
				<span className="mixTube-title-bar-title noselect">
					mixTube
				</span>
				<button 
					className="mixTube-title-bar-close"
					onClick={closeHandler.bind(this)}
				>
					✖
				</button>
			</div>
			<RenderMixer 
				lvl={lvl}
				onVolumeChange={handleVolumeChange.bind(this)}
			/>
			<RenderChannels 
				onSwitchChannel={switchChannelHandler.bind(this)} 
				medias={medias} 
				left={side[0]} 
				right={side[1]}
			/>
		</div>
	);
}

	ReactDOM.render(<Popup/>, document.getElementById('app'))	