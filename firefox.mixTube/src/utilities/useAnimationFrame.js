/*----------------------------------------*\
  firefox.mixTube - useAnimationFrame.js
  @author Evrard Vincent (vincent@ogre.be)
  @Date:   2021-12-29 12:40:35
  @Last Modified time: 2021-12-29 12:46:05
\*----------------------------------------*/
import React from 'react';
import { isNumber } from 'underscore';

const useAnimationFrame = callback => {
	// Use useRef for mutable variables that we want to persist
	// without triggering a re-render on their change
	const requestRef = React.useRef();
	const nextRef = React.useRef();
	nextRef.current = 0;
	
	const animate = time => {
		if (time > nextRef.current) {
			let wait = callback(time);
			nextRef.current = isNumber(wait) ? wait : 0; 
		}
		requestRef.current = requestAnimationFrame(animate);	
	}

	React.useEffect(() => {
		requestRef.current = requestAnimationFrame(animate);
		return () => cancelAnimationFrame(requestRef.current);
	}, []); // Make sure the effect runs only once
}

export default useAnimationFrame;