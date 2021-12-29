/*----------------------------------------*\
  mixTube - marquee.js
  @author Evrard Vincent (vincent@ogre.be)
  @Date:   2021-12-29 12:47:17
  @Last Modified time: 2021-12-29 13:28:14
\*----------------------------------------*/
import React from 'react';
import useAnimationFrame from './../utilities/useAnimationFrame.js'

const Marquee = ({text}) => {
	// console.log(tarcklist);
	const [step, setStep] = React.useState(0)
	const [offsetMax, setOffsetMax] = React.useState(100)
	const [running, setRunning] = React.useState(0);
	const margin = 20;
	const myRef = React.useRef();

	useAnimationFrame(time => {
		setStep(prevStep => prevStep + 1 );
		return time + 30;
 	});

	const getSize = ()=>{
		const selfWidth = myRef.current.clientWidth;
		const parentWidth = myRef.current.parentElement.clientWidth;
		setRunning(selfWidth > parentWidth ? 1 : 0);
		setOffsetMax(100 - (parentWidth / selfWidth) * 100);	
	}
	React.useEffect(() => {
		window.addEventListener("resize", getSize);
		getSize();
  	}, []);


	const offset = -1 * (Math.sin(step*0.01) * 0.5 + 0.5) * offsetMax * running;
	return (
		<span ref={myRef} style={{
			padding : `0 ${margin}px`,
			display: "inline-block",
			transform: `translate(${offset}%, 0)`
		}}>
		{
			text
		}
		</span>
	);
}

export default Marquee;