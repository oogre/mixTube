/*----------------------------------------*\
  runtime-examples - content.js
  @author Evrard Vincent (vincent@ogre.be)
  @Date:   2018-05-28 03:12:11
  @Last Modified time: 2022-01-06 19:39:44
\*----------------------------------------*/
import {onReady} from './../utilities/onReady.js';
import { on, sendMessage } from './../utilities/com.js';
import { runtimeGetURL } from './../utilities/browser.js';
import { log, info, warn, error } from './../utilities/log.js';
import { togglePopup, closePopup, openPopup, createIcon, setIcon, closeIcon, setHeight } from './popupManager.js';
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
	return { 
		title : getTitle(),
		duration : mixTube.media.duration,
		currentTime : mixTube.media.currentTime,
		volume : mixTube.media.volume,
		playing : mixTube.media.playing,
		playbackRate : mixTube.media.playbackRate,
		muted : mixTube.media.muted,
		alreadyPlayed : false,
		passFilter : (Math.min(mixTube.highPassFilter.gain.value, 0) - Math.min(mixTube.lowPassFilter.gain.value, 0))/25
	}
};

on("setSize", (data, resolve) =>{
	if(window != window.top)return;
	setHeight(data);
	resolve(true);
});

on("closePopup", (data, resolve) =>{
	if(window != window.top)return;
	closePopup();
	resolve(true);
});
on("disablePopup", (data, resolve) =>{
	if(window != window.top)return;
	mixTube.disable = true;
	closePopup();
	resolve(true);
});

on("openPopup", (data, resolve) =>{
	if(window != window.top)return;
	openPopup();
	resolve(true);
});

on("togglePopup", (data, resolve) =>{
	if(window != window.top)return;
	mixTube.disable = false;
	togglePopup();
	resolve(true);
});

on("play", (data, resolve) =>{
	mixTube.media.play();
	mixTube.media.play();
	resolve(true);
});

on("pause", (data, resolve) =>{
	mixTube.media.pause();
	resolve(true);
});

on("volume", (data, resolve) =>{
	mixTube.media.volume = data.volume;
	resolve(true);
});

on("progress", (data, resolve) =>{
	mixTube.media.currentTime = data.currentTime;
	resolve(true);
});

on("speed", (data, resolve) =>{
	mixTube.media.playbackRate = data.playbackRate;
	resolve(true);
});

on("muted", (data, resolve) =>{
	mixTube.media.muted = data.muted;
	resolve(true);
});

on("passFilter", ({passFilter}, resolve) =>{
	const [low, high] = [Math.max(0, passFilter) * -25, Math.min(passFilter, 0) * 25];
	mixTube.lowPassFilter.gain.setValueAtTime(low, mixTube.audioCtx.currentTime);
	mixTube.highPassFilter.gain.setValueAtTime(high, mixTube.audioCtx.currentTime);
	callBackground("updateMedia");
	resolve(true);
});

on("gain", (data, resolve) =>{
	mixTube.gainNode.gain.setValueAtTime(data, mixTube.audioCtx.currentTime);
	
	resolve(true);
});

on("unLoad", (data, resolve) =>{
	console.log("unLoad");
	mixTube.source.disconnect(mixTube.lowPassFilter);
	mixTube.lowPassFilter.disconnect(mixTube.highPassFilter);
	mixTube.highPassFilter.disconnect(mixTube.gainNode);
	mixTube.gainNode.disconnect(mixTube.audioCtx.destination);
	resolve(true);
});

sendMessage("getSettings")
.then(data => {
	console.log(data);
})
.catch(error => {});

const mixTube = {};

onReady( async ()=>{
	const location = window.location.toString();

	if((/youtube\.com\/watch/ig).test(location)){

		if(!document.querySelector("h1.ytd-video-primary-info-renderer")){
			await onDomChange("body", "h1.ytd-video-primary-info-renderer")
		}

		mixTube.media = document.querySelector("video");

		mixTube.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
		mixTube.source = mixTube.audioCtx.createMediaElementSource(mixTube.media);
		
		mixTube.gainNode = mixTube.audioCtx.createGain();
		mixTube.lowPassFilter = mixTube.audioCtx.createBiquadFilter();
		mixTube.lowPassFilter.type = "lowshelf";
		mixTube.lowPassFilter.frequency.value = 1500;
		mixTube.lowPassFilter.gain.value = 0;
		mixTube.highPassFilter = mixTube.audioCtx.createBiquadFilter();
		mixTube.highPassFilter.type = "highshelf";
		mixTube.highPassFilter.frequency.value = 1000;
		mixTube.highPassFilter.gain.value = 0;
		mixTube.source.connect(mixTube.lowPassFilter);
		mixTube.lowPassFilter.connect(mixTube.highPassFilter);
		mixTube.highPassFilter.connect(mixTube.gainNode);
		mixTube.gainNode.connect(mixTube.audioCtx.destination);

		if(mixTube.media){
			mixTube.media.addEventListener('play', () => callBackground("updateMedia"));
			mixTube.media.addEventListener('pause', () => callBackground("updateMedia"));
			mixTube.media.addEventListener('ended', () => callBackground("updateMedia"));
			mixTube.media.addEventListener('volumechange', () => callBackground("updateMedia"));
			mixTube.media.addEventListener('ratechange', () => callBackground("updateMedia"));
			mixTube.media.addEventListener('timeupdate', () => callBackground("updateMedia"));
			window.addEventListener("beforeunload", () => callBackground("deleteMedia"));
			callBackground("newMedia");	
		}

		document.querySelector("ytd-player")
			.addEventListener('mouseenter', () => {
				if(!mixTube.disable){
					openPopup();
				}
			});

		document.querySelector("ytd-player")
			.addEventListener('mouseleave', (event) => {
				closePopup();
			});

		const mixTubeBtn = document.createElement('button');
		mixTubeBtn.classList.add("ytp-mixTube-button"); 
		mixTubeBtn.classList.add("ytp-button");
		mixTubeBtn.title =  "MixTube is on/off";
		mixTubeBtn.addEventListener('click', () => {
			mixTube.disable = false;
			openPopup();
		});
		document.querySelector(".ytp-right-controls").append(mixTubeBtn);
		document.querySelector("#contentContainer").style.display = "none";
	}
});

