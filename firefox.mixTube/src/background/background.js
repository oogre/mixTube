/*----------------------------------------*\
  runtime-examples - background.js
  @author Evrard Vincent (vincent@ogre.be)
  @Date:   2018-05-27 23:11:57
  @Last Modified time: 2022-01-06 00:29:25
\*----------------------------------------*/

import Data from "./../utilities/Data.js";

import { log, info, warn, error } from './../utilities/log.js';
import { on, sendMessage, sendMessageToTab } from './../utilities/com.js';
import { tabsRemove, tabsCreate, tabsHighlight, tabsSendMessage, tabsOnActivatedAddListener, runtimeOnInstalledAddListener, runtimeSetUninstallURL, browserActionOnClickAddListener } from './../utilities/browser.js';

// runtimeOnInstalledAddListener(data => {
// 	if(data.reason == "install"){

// 	}
// });

// runtimeSetUninstallURL(config.getLogoutUrl());

tabsOnActivatedAddListener(({tabId}) => {
	sendMessageToTab("closePopup")
		.then(()=>{})
		.catch(()=>{});
});

browserActionOnClickAddListener(tab => {
	sendMessageToTab("togglePopup")
	.then(()=>{})
	.catch(()=>{});
});

const settings = {
	size : 200
};
const medias = [];
const side = [[], []];
let lvl = 0.5;

on("newMedia", (data, resolve, reject, sender) => {
	data.tabId = sender.tab.id;
	data.tabIndex = sender.tab.index;
	data.windowId = sender.tab.windowId;
	if(!side[0].includes(data.tabId) && !side[1].includes(data.tabId)){
		side[0].push(data.tabId);
	}
	medias[sender.tab.id] = data;

	console.log(medias);
	sendMessageToTab("medias", {medias, side, lvl})
	.then(()=>{})
	.catch(()=>{});
	resolve(true);
});

on("updateMedia", (data, resolve, reject, sender) => {
	data.tabId = sender.tab.id;
	data.tabIndex = sender.tab.index;
	data.windowId = sender.tab.windowId;
	if(!side[0].includes(data.tabId) && !side[1].includes(data.tabId)){
		side[0].push(data.tabId);
	}
	medias[sender.tab.id] = data;
	sendMessageToTab("medias", {medias, side, lvl})
		.then(()=>{})
		.catch(()=>{});
	resolve(true);
});

on("deleteMedia", (data, resolve, reject, sender) => {
	data.tabId = sender.tab.id;
	data.tabIndex = sender.tab.index;
	data.windowId = sender.tab.windowId;
	if(side[0].includes(data.tabId)){
		side[0].splice(side[0].indexOf(data.tabId), 1);
	}else if(side[1].includes(data.tabId)){
		side[1].splice(side[1].indexOf(data.tabId), 1);
	}
	delete medias[sender.tab.id];


	sendMessageToTab("medias", {medias, side, lvl})
		.then(()=>{})
		.catch(()=>{});
	resolve(true);
});


on("closePopup", (data, resolve, reject, sender)=>{
	sendMessageToTab("closePopup")
		.then(()=>{})
		.catch(()=>{});
	resolve(true);
});

on("getMedias", (data, resolve, reject, sender) => {
	resolve({medias, side, lvl});
});

on("getSide", (data, resolve, reject, sender) => {
	resolve(side);
});

on("setVolumes", (data, resolve, reject, sender) => {
	lvl = data;
	medias
	.map(media => {
		media.volume = side[0].includes(media.tabId) ? (1-lvl) : lvl;
		tabsSendMessage(media.tabId, { action : "volume", data : media })
	});
	resolve(true);
});

on("setCurrentTime", (track, resolve, reject, sender) => {
	tabsSendMessage(track.tabId, { action : "progress", data : track })
	resolve(true);
});

on("setSide", (tabId, resolve, reject, sender) => {
	if(side[0].includes(tabId)){
		side[0].splice(side[0].indexOf(tabId), 1);
		side[1].push(tabId);
	} else if (side[1].includes(tabId)){
		side[0].push(tabId)
		side[1].splice(side[1].indexOf(tabId), 1);
	}
	medias
	.map(media => {
		media.volume = side[0].includes(media.tabId) ? (1-lvl) : lvl;
		tabsSendMessage(media.tabId, { action : "volume", data : media })
	});
	sendMessageToTab("medias", {medias, side, lvl})
		.then(()=>{})
		.catch(()=>{});
	resolve(true);
});

on("play", async (data, resolve, reject, sender) => {
	try{
		await tabsHighlight({
			windowId : data.windowId, 
			tabs: data.tabIndex
		});
		await sendMessageToTab("openPopup");
		await sendMessageToTab("play")
		resolve(true);
	}catch(error){
		reject(error);
	}
});

on("openYoutube", (data, resolve, reject, sender) => {
	tabsCreate({ url : "https://www.youtube.com/" });
	resolve(true);
});

on("remove", (data, resolve, reject, sender) => {
	tabsRemove(data.tabId)
	.then(() => sendMessageToTab("openPopup") )
	.catch(()=>{});
	resolve(true);
});

on("getSettings", (data, resolve, reject, sender) => {
	resolve(settings);
});

on("setSize", (height, resolve, reject, sender) => {
	settings.size = height
	tabsSendMessage(sender.tab.id, { action : "setSize", data : height  })
	resolve(true);
});

on("show", (data, resolve, reject, sender) => {
	tabsHighlight({
		windowId : data.windowId, 
		tabs: data.tabIndex
	})
	.then(() => sendMessageToTab("openPopup") )
	.catch(()=>{});
	resolve(true);
});

on("pause", (data, resolve, reject, sender) => {
	tabsSendMessage(data.tabId, { action : "pause" })
	resolve(true);
});

on("passFilter", (data, resolve, reject, sender) => {
	tabsSendMessage(data.tabId, { action : "passFilter", data })
	.then(d => console.log(d))
	.catch(d => console.error(d))
	resolve(true);
});

on("progress", (data, resolve, reject, sender) => {
	tabsSendMessage(data.tabId, { action : "progress", data })
	resolve(true);
});

on("muted", (data, resolve, reject, sender) => {
	tabsSendMessage(data.tabId, { action : "muted", data })
	resolve(true);
});

on("speed", (data, resolve, reject, sender) => {
	tabsSendMessage(data.tabId, { action : "speed", data })
	resolve(true);
});
