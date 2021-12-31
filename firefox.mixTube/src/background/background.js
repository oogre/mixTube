/*----------------------------------------*\
  runtime-examples - background.js
  @author Evrard Vincent (vincent@ogre.be)
  @Date:   2018-05-27 23:11:57
  @Last Modified time: 2021-12-31 00:53:49
\*----------------------------------------*/

import Data from "./../utilities/Data.js";
import { config } from './../shared/config.js';
import { log, info, warn, error } from './../utilities/log.js';
import { setIcon, setDefaultIcon } from './../utilities/icon.js';
import { on, sendMessage, sendMessageToTab } from './../utilities/com.js';

import { tabsRemove, tabsCreate, tabsHighlight, tabsSendMessage, tabsOnActivatedAddListener, runtimeOnInstalledAddListener, runtimeSetUninstallURL, browserActionOnClickAddListener } from './../utilities/browser.js';

// runtimeOnInstalledAddListener(data => {
// 	if(data.reason == "install"){
// 		// tabHandler()
// 		// .then(tab => tabsUpdate({ url : config.getHomeUrl() }))
// 		// .catch(() => tabsCreate({ url : config.getHomeUrl() }));
// 	}
// });

// runtimeSetUninstallURL(config.getLogoutUrl());

tabsOnActivatedAddListener(({tabId}) => {
	sendMessageToTab("closePopup")
		.then(()=>{})
		.catch(()=>{});
});

browserActionOnClickAddListener(tab => {
	sendMessageToTab("openPopup")
	.then(()=>{})
	.catch(()=>{});
});

const medias = {};
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


on("closePopup", ()=>{
	sendMessageToTab("closePopup")
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

on("getMedias", (data, resolve, reject, sender) => {
	resolve({medias, side});
});

on("getSide", (data, resolve, reject, sender) => {
	resolve(side);
});

on("setVolumes", (data, resolve, reject, sender) => {
	lvl = data;
	Object.values(medias)
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
	Object.values(medias)
	.map(media => {
		media.volume = side[0].includes(media.tabId) ? (1-lvl) : lvl;
		tabsSendMessage(media.tabId, { action : "volume", data : media })
	});
	sendMessageToTab("medias", {medias, side, lvl})
		.then(()=>{})
		.catch(()=>{});
	resolve(true);
});

on("play", (data, resolve, reject, sender) => {
	tabsSendMessage(data.tabId, { action : "play" })
	resolve(true);
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
