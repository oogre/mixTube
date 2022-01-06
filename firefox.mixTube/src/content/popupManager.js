/*----------------------------------------*\
  bcksp.es - popupManager.js
  @author Evrard Vincent (vincent@ogre.be)
  @Date:   2019-04-17 12:28:31
  @Last Modified time: 2022-01-03 23:12:46
\*----------------------------------------*/
import { runtimeGetURL } from './../utilities/browser.js';
import { sendMessage } from './../utilities/com.js';

export function openPopup(){
	let popupIframe = document.createElement('iframe');
	// Must be declared at web_accessible_resources in manifest.json
	popupIframe.src = runtimeGetURL('popup.html');
	popupIframe.name = popupIframe.id = "bcksp-es-frame";
	popupIframe.className = "bcksp-es-frame";
	document.body.prepend(popupIframe);
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

