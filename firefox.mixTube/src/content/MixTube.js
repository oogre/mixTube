/*----------------------------------------*\
  runtime-examples - MixTube.js
  @author Evrard Vincent (vincent@ogre.be)
  @Date:   2018-05-28 03:12:11
  @Last Modified time: 2022-01-06 00:50:49
\*----------------------------------------*/

Object.defineProperty(HTMLMediaElement.prototype, 'playing', {
    get: function(){
        return !!(this.currentTime > 0 && !this.paused && !this.ended && this.readyState > 2);
    }
});

class MixTube{
	constructor(mediaElement, title){
		this.mediaElement = mediaElement;
		this.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
		this.source = this.audioCtx.createMediaElementSource(this.mediaElement);

		this.gainNode = this.audioCtx.createGain();

		this.lowPassFilter = this.audioCtx.createBiquadFilter();
		this.lowPassFilter.type = "lowshelf";
		this.lowPassFilter.frequency.value = 1500;
		this.lowPassFilter.gain.value = 0;

		this.highPassFilter = this.audioCtx.createBiquadFilter();
		this.highPassFilter.type = "highshelf";
		this.highPassFilter.frequency.value = 1000;
		this.highPassFilter.gain.value = 0;

		this.source.connect(this.lowPassFilter);
		this.lowPassFilter.connect(this.highPassFilter);
		this.highPassFilter.connect(this.gainNode);
		this.gainNode.connect(this.audioCtx.destination);

		this._title = title;
		this._passFilterAmp = 25;

		this.mediaUpdateHandlers = [];
		this.killHandlers = [];

		this.mediaElement.addEventListener('play', evt => this.trigMediaUpdate());
		this.mediaElement.addEventListener('pause', evt => this.trigMediaUpdate());
		this.mediaElement.addEventListener('ended', evt => this.trigMediaUpdate());
		this.mediaElement.addEventListener('volumechange', evt => this.trigMediaUpdate());
		this.mediaElement.addEventListener('ratechange', evt => this.trigMediaUpdate());
		this.mediaElement.addEventListener('timeupdate', evt => this.trigMediaUpdate());
		window.addEventListener("beforeunload", evt => this.trigKill());
	}

	trigMediaUpdate(){
		this.mediaUpdateHandlers.map(handle => {
			handle(this.toObject())
		});
	}

	trigKill(){
		this.killHandlers.map(handle => handle(this.toObject()));
	}

	get title(){
		return this._title;
	}

	set title(newValue){
		this._title = newValue;
		this.trigMediaUpdate();
	}

	get duration(){
		return this.mediaElement.duration;
	}
	
	get currentTime(){
		return this.mediaElement.currentTime;
	}
	
	get currentTimeNormalized(){
		return this.mediaElement.currentTime / this.duration();	
	}
	
	set currentTime(newValue){
		this.mediaElement.currentTime = newValue;
		this.trigMediaUpdate();
	}
	
	set currentTimeNormalized(newValue){
		this.mediaElement.currentTime = newValue * this.duration();
		this.trigMediaUpdate();
	}
	
	get volume(){
		return this.mediaElement.volume;
	}
	
	set volume(newValue){
		this.mediaElement.volume = newValue;
		this.trigMediaUpdate();
	}
	
	get playing(){
		return this.mediaElement.playing;
	}

	play(){
		this.mediaElement.play();
		this.trigMediaUpdate();
	}

	pause(){
		this.mediaElement.pause();
		this.trigMediaUpdate();
	}
	
	get playbackRate(){
		return this.mediaElement.playbackRate;
	}
	
	set playbackRate(newValue){
		this.mediaElement.playbackRate = newValue;
		this.trigMediaUpdate();
	}
	
	get playbackRateNormalized(){
		const value = this.mediaElement.playbackRate;
		if(value <= 1.25){
			return (value - 1) * 4 * 3
		}else{
			return Math.pow((value-1.15) * 9.52, 0.333) * 3;
		}
	}
	
	set playbackRateNormalized(newValue){
		if(newValue <= 1){
			newValue = newValue * 0.25 + 1;
		}else{
			newValue = Math.min(newValue * newValue * newValue * 0.105 + 1.15, 4);
		}
		this.mediaElement.playbackRate = newValue;
		this.trigMediaUpdate();
	}
	
	get isMuted(){
		return this.mediaElement.muted;
	}
	
	set mute(newValue=true){
		this.mediaElement.muted = newValue;
		this.trigMediaUpdate();
	}
	
	get passFilter(){
		return  (Math.min(this.highPassFilter.gain.value, 0) - Math.min(this.lowPassFilter.gain.value, 0)) / this._passFilterAmp;
	}
	
	set passFilter(newValue){
		this.lowPassFilter.gain.setValueAtTime(Math.max(0, newValue)  * -this._passFilterAmp, this.audioCtx.currentTime);
		this.highPassFilter.gain.setValueAtTime(Math.min(newValue, 0) * this._passFilterAmp, this.audioCtx.currentTime);
		this.trigMediaUpdate();
	}
	
	get gain(){
		return 1;
	}
	
	set gain(newValue){
		this.trigMediaUpdate();
	}

	onMediaUpdate(cb){
		this.mediaUpdateHandlers.push(cb);
	}

	onKill(cb){
		this.killHandlers.push(cb);
	}

	toObject(){
		return {
			title : this.title,
			duration : this.duration,
			currentTime : this.currentTime,
			volume : this.volume,
			playing : this.playing,
			playbackRate : this.playbackRate,
			muted : this.isMuted,
			passFilter :this.passFilter
		}
	}
}

export default MixTube;