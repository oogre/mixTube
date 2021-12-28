/*----------------------------------------*\
  runtime-examples - content.js
  @author Evrard Vincent (vincent@ogre.be)
  @Date:   2018-05-28 03:12:11
  @Last Modified time: 2020-02-20 20:04:29
\*----------------------------------------*/
import {onReady} from './../utilities/onReady.js';
import { on, sendMessage } from './../utilities/com.js';
import { runtimeGetURL } from './../utilities/browser.js';
import { log, info, warn, error } from './../utilities/log.js';
import { togglePopup, closePopup, createIcon, setIcon, closeIcon } from './popupManager.js';


Object.defineProperty(HTMLMediaElement.prototype, 'playing', {
    get: function(){
        return !!(this.currentTime > 0 && !this.paused && !this.ended && this.readyState > 2);
    }
});
const callBackground = (action, event) => {
	//console.log(event);
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
		playbackRate : media.playbackRate
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
	console.log(data);
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
const EventHandler = event => callBackground("updateMedia", event);
onReady(()=>{
	const media = document.querySelector("video");
	
	if(media){
		media.addEventListener('play', EventHandler);
		media.addEventListener('pause', EventHandler);
		media.addEventListener('ended', EventHandler);
		media.addEventListener('volumechange', EventHandler);
		media.addEventListener('ratechange', EventHandler);
		media.addEventListener('timeupdate', EventHandler);
		callBackground("newMedia");	
	}
});