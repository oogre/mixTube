/*----------------------------------------*\
  bcksp.es - popupManager.js
  @author Evrard Vincent (vincent@ogre.be)
  @Date:   2019-04-17 12:28:31
  @Last Modified time: 2022-01-06 16:07:34
\*----------------------------------------*/
import { runtimeGetURL } from './../utilities/browser.js';
import { sendMessage } from './../utilities/com.js';

export function openPopup(){
	if(document.querySelector("#bcksp-es-frame"))return;
	let popupIframe = document.createElement('iframe');
	// Must be declared at web_accessible_resources in manifest.json
	popupIframe.src = runtimeGetURL('popup.html');
	popupIframe.name = popupIframe.id = "bcksp-es-frame";
	popupIframe.className = "bcksp-es-frame";
	document.querySelector("#movie_player").append(popupIframe);
}

export function closePopup(popupIframe = document.querySelector("#bcksp-es-frame")){
	popupIframe.parentNode.removeChild(popupIframe);
	popupIframe = null;
}

export function setHeight(value) {
	let popupIframe = document.querySelector("#bcksp-es-frame");
	popupIframe.style.height = value + "px";
}

export function togglePopup(){
	let popupIframe = document.querySelector("#bcksp-es-frame");
	if(popupIframe){
		closePopup(popupIframe);
	}else{
		openPopup();
	}
}

