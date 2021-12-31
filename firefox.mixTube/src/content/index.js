/*----------------------------------------*\
  runtime-examples - content.js
  @author Evrard Vincent (vincent@ogre.be)
  @Date:   2018-05-28 03:12:11
  @Last Modified time: 2021-12-30 23:12:32
\*----------------------------------------*/
import {onReady} from './../utilities/onReady.js';
import { on, sendMessage } from './../utilities/com.js';
import { runtimeGetURL } from './../utilities/browser.js';
import { log, info, warn, error } from './../utilities/log.js';
import { togglePopup, closePopup, createIcon, setIcon, closeIcon } from './popupManager.js';
import { onDomChange } from './../utilities/onDomChange.js';

Object.defineProperty(HTMLMediaElement.prototype, 'playing', {
    get: function(){
        return !!(this.currentTime > 0 && !this.paused && !this.ended && this.readyState > 2);
    }
});
const callBackground = (action, event) => {
	sendMessage(action, buildInfo())
		.then(()=>{})
		.catch(()=>{});
}
const getMedia = () => document.querySelector("video");
const getTitle = () => document.querySelector("h1.ytd-video-primary-info-renderer").innerText;
const buildInfo = () => {
	
	const media = getMedia();
	return { 
		title : getTitle(),
		duration : media.duration,
		currentTime : media.currentTime,
		volume : media.volume,
		playing : media.playing,
		playbackRate : media.playbackRate,
		muted : media.muted
	}
};


on("closePopup", (data, resolve) =>{
	if(window != window.top)return;
	closePopup();
	resolve(true);
});

on("openPopup", (data, resolve) =>{
	if(window != window.top)return;
	togglePopup();
	resolve(true);
});

on("play", (data, resolve) =>{
	getMedia().play();
	resolve(true);
});

on("pause", (data, resolve) =>{
	getMedia().pause();
	resolve(true);
});

on("volume", (data, resolve) =>{
	getMedia().volume = data.volume;
	resolve(true);
});

on("progress", (data, resolve) =>{
	getMedia().currentTime = data.currentTime;
	resolve(true);
});

on("speed", (data, resolve) =>{
	getMedia().playbackRate = data.playbackRate;
	resolve(true);
});

on("muted", (data, resolve) =>{
	getMedia().muted = data.muted;
	resolve(true);
});

onReady( async ()=>{
	const location = window.location.toString();


	if((/youtube\.com\/watch/ig).test(location)){

		if(!document.querySelector("h1.ytd-video-primary-info-renderer")){
			await onDomChange("body", "h1.ytd-video-primary-info-renderer")
		}

		const media = document.querySelector("video");
		if(media){
			media.addEventListener('play', () => callBackground("updateMedia"));
			media.addEventListener('pause', () => callBackground("updateMedia"));
			media.addEventListener('ended', () => callBackground("updateMedia"));
			media.addEventListener('volumechange', () => callBackground("updateMedia"));
			media.addEventListener('ratechange', () => callBackground("updateMedia"));
			media.addEventListener('timeupdate', () => callBackground("updateMedia"));
			window.addEventListener("beforeunload", () => callBackground("deleteMedia"));
			callBackground("newMedia");	
		}
	}
});

