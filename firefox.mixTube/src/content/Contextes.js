/*----------------------------------------*\
  runtime-examples - MixTube.js
  @author Evrard Vincent (vincent@ogre.be)
  @Date:   2018-05-28 03:12:11
  @Last Modified time: 2022-01-06 00:50:49
\*----------------------------------------*/
import { onDomChange } from './../utilities/onDomChange.js';

const Contextes = [{
	name : "youtube",
	regexp : RegExp(/youtube\.com\/watch/ig),
	action : async () => {
		if(!document.querySelector("h1.ytd-video-primary-info-renderer")){
			await onDomChange("body", "h1.ytd-video-primary-info-renderer")
		}
		const media = document.querySelector("video");
		const title = document.querySelector("h1.ytd-video-primary-info-renderer").innerText;
		return [media, title];
	}
},{
	name : "nothing",
	regexp : RegExp(/(?!.*)/ig),
	action : async () => {
		if(!document.querySelector("content")){
			await onDomChange("body", "content")
		}
		const media = document.querySelector("video");
		const title = document.querySelector("h1.title").innerText;
		return [media, title];
	}
}];

export default Contextes;