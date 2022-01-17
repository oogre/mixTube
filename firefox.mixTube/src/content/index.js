/*----------------------------------------*\
  runtime-examples - content.js
  @author Evrard Vincent (vincent@ogre.be)
  @Date:   2018-05-28 03:12:11
  @Last Modified time: 2022-01-06 19:39:44
\*----------------------------------------*/
import { onReady } from './../utilities/onReady.js';
import { on, sendMessage } from './../utilities/com.js';
import { log, info, warn, error } from './../utilities/log.js';
import { togglePopup, closePopup, openPopup, setHeight } from './popupManager.js';
import MixTube from './MixTube.js';
import { Timeout } from './../utilities/tools.js';
import Contextes from './Contextes.js';

const handlePlateform = async () => {
	const location = window.location.toString();
	const context = Contextes.find(({regexp}) => regexp.test(location));
	if(!context) throw new Error("Unknow context");
	return await Promise.race([Timeout(3000), context.action()]);
}

onReady( async () => {
	try{
		const enabled = true;
		const settings = await sendMessage("getSettings");
		const [media, title, btn, area] = await handlePlateform();
		const mt = new MixTube(media, title);
		mt.onMediaUpdate(evt => sendMessage("updateMedia", evt));
		mt.onKill(evt => sendMessage("deleteMedia", evt));
		sendMessage("newMedia", mt.toObject());

		area.addEventListener('mouseenter', evt => enabled && openPopup() );
		area.addEventListener('mouseleave', evt => closePopup() );
		btn.addEventListener('click', evt => {
			enabled = true;
			openPopup();
		});

		on("setSize", (data, resolve) =>{
			setHeight(data);
			resolve(true);
		});

		on("closePopup", (data, resolve) =>{
			closePopup();
			resolve(true);
		});

		on("disablePopup", (data, resolve) =>{
			closePopup();
			enabled = false;
			resolve(true);
		});

		on("openPopup", (data, resolve) =>{
			openPopup();
			resolve(true);
		});

		on("togglePopup", (data, resolve) =>{
			togglePopup();
			resolve(true);
		});

		on("play", (data, resolve) =>{
			mt.play();
			resolve(true);
		});

		on("pause", (data, resolve) =>{
			mt.pause();
			resolve(true);
		});

		on("volume", ({volume}, resolve) =>{
			mt.volume = volume;
			resolve(true);
		});

		on("progress", ({currentTime}, resolve) =>{
			mt.currentTime = currentTime;
			resolve(true);
		});

		on("speed", ({playbackRate}, resolve) =>{
			mt.playbackRate = playbackRate;
			resolve(true);
		});

		on("muted", ({muted}, resolve) =>{
			mt.mute = muted;
			resolve(true);
		});

		on("passFilter", ({passFilter}, resolve) =>{
			mt.passFilter = passFilter;
			resolve(true);
		});

		on("gain", ({gain}, resolve) =>{
			mt.gain = gain;
			resolve(true);
		}); 
	}catch(error){
		console.error(error);
	}
});

