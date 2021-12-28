/*----------------------------------------*\
  runtime-examples - background.js
  @author Evrard Vincent (vincent@ogre.be)
  @Date:   2018-05-27 23:11:57
  @Last Modified time: 2021-03-08 17:28:22
\*----------------------------------------*/

import Data from "./../utilities/Data.js";
import { config } from './../shared/config.js';
import { log, info, warn, error } from './../utilities/log.js';
import { setIcon, setDefaultIcon } from './../utilities/icon.js';
import { on, sendMessage, sendMessageToTab } from './../utilities/com.js';

import { tabsSendMessage, tabsUpdate, tabsCreate, tabsOnActivatedAddListener, runtimeOnInstalledAddListener, runtimeSetUninstallURL, browserActionOnClickAddListener } from './../utilities/browser.js';

runtimeOnInstalledAddListener(data => {
	if(data.reason == "install"){
		// tabHandler()
		// .then(tab => tabsUpdate({ url : config.getHomeUrl() }))
		// .catch(() => tabsCreate({ url : config.getHomeUrl() }));
	}
});

runtimeSetUninstallURL(config.getLogoutUrl());

tabsOnActivatedAddListener(({tabId}) => {
});

browserActionOnClickAddListener(tab => {
	sendMessageToTab("openPopup")
	.then(()=>{})
	.catch(()=>{});
});

const medias = {};

on("newMedia", (data, resolve, reject, sender) => {
	data.tabId = sender.tab.id;
	medias[sender.tab.id] = data;
	sendMessageToTab("medias", medias)
	.then(()=>{})
	.catch(()=>{});
	resolve(true);
});

on("updateMedia", (data, resolve, reject, sender) => {
	data.tabId = sender.tab.id;
	medias[sender.tab.id] = data;
	sendMessageToTab("medias", medias)
	.then(()=>{})
	.catch(()=>{});
	resolve(true);
});

on("getMedias", (data, resolve, reject, sender) => {
	console.log(medias);
	resolve(medias);
});

on("play", (data, resolve, reject, sender) => {
	tabsSendMessage(data.tabId, { action : "play" })
	console.log(data);
	resolve(true);
});

on("pause", (data, resolve, reject, sender) => {
	tabsSendMessage(data.tabId, { action : "pause" })
	console.log(data);
	resolve(true);
});


on("progress", (data, resolve, reject, sender) => {
	tabsSendMessage(data.tabId, { action : "progress", data })
	console.log(data);
	resolve(true);
});

on("volume", (data, resolve, reject, sender) => {
	tabsSendMessage(data.tabId, { action : "volume", data })
	console.log(data);
	resolve(true);
});

on("speed", (data, resolve, reject, sender) => {
	tabsSendMessage(data.tabId, { action : "speed", data })
	console.log(data);
	resolve(true);
});


