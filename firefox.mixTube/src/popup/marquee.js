/*----------------------------------------*\
  mixTube - marquee.js
  @author Evrard Vincent (vincent@ogre.be)
  @Date:   2021-12-29 12:47:17
  @Last Modified time: 2022-01-06 15:32:42
\*----------------------------------------*/
import React from 'react';
import useAnimationFrame from './../utilities/useAnimationFrame.js'

const Marquee = ({text}) => {
	// console.log(tarcklist);
	const [step, setStep] = React.useState(0)
	const [offsetMax, setOffsetMax] = React.useState(100)
	const myRef = React.useRef();

	useAnimationFrame(time => {
		setStep(prevStep => prevStep + 1 );
		return time + 30;
 	});

	const getSize = ()=>{
		const selfWidth = myRef.current.clientWidth;
		const parentWidth = myRef.current.parentElement.clientWidth;
		setOffsetMax(100 - (parentWidth / selfWidth) * 100);	
	}
	React.useEffect(() => {
		window.addEventListener("resize", getSize);
		getSize();
		return () => {
			window.removeEventListener("resize", getSize);
		}
	}, []);



	const offset = -1 * (Math.sin(-1*Math.PI/2 + step*0.01) * 0.5 + 0.5) * offsetMax;
	return (
		<span ref={myRef} style={{
			transform: `translate(${offset}%, 0)`
		}}>
		{
			text
		}
		</span>
	);
}

export default Marquee;