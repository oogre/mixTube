/*----------------------------------------*\
  mixTube - onDomChange.js
  @author Evrard Vincent (vincent@ogre.be)
  @Date:   2021-12-29 00:59:09
  @Last Modified time: 2021-12-29 01:06:24
\*----------------------------------------*/


export function onDomChange(targetSelector="body", selector="*"){
	return new Promise((resolve, reject)=>{
		const targetNode = document.querySelector(targetSelector);
		const config = { attributes: false, childList: true };
		// Callback function to execute when mutations are observed
		const callback = function(mutationsList) {
			for(var mutation of mutationsList) {
				if (mutation.type == 'childList') {
					const element = document.querySelector(selector);
					if(element){
						resolve(element);
						// Later, you can stop observing
						observer.disconnect();
					}
				}
			}
		};
		// Create an observer instance linked to the callback function
		const observer = new MutationObserver(callback);
		// Start observing the target node for configured mutations
		observer.observe(targetNode, config);
	})
}

