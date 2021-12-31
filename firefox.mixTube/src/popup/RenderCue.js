/*----------------------------------------*\
  mixTube - RenderController.js
  @author Evrard Vincent (vincent@ogre.be)
  @Date:   2021-12-28 18:30:42
  @Last Modified time: 2021-12-31 13:33:03
\*----------------------------------------*/
import React from 'react';
import useAnimationFrame from './../utilities/useAnimationFrame.js'

const RenderCue = ({isCuing, track, onMouseDown=()=>{}, onMouseUp=()=>{}}) => {
	const [step, setStep] = React.useState(0);

	const cueUpHandler = (track, event)=>{
		onMouseUp(track, event);
	}

	const cueDownHandler = (track, event)=>{
		onMouseDown(track, event);
	}

	useAnimationFrame(time => {
		setStep(prevStep => prevStep + 1 );	
		return time + 30;
 	});

	return (
		<button 
			onMouseUp={cueUpHandler.bind(this, track)} 
			onMouseDown={cueDownHandler.bind(this, track)}
		>
		{	 
			(!isCuing || (step>>1) % 2 == 0) && 
				<span>♯</span>
		}
		</button>
	);
}

export default RenderCue;