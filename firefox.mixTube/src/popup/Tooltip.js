/*----------------------------------------*\
  mixTube - Tooltip.js
  @author Evrard Vincent (vincent@ogre.be)
  @Date:   2022-01-04 13:33:08
  @Last Modified time: 2022-01-06 15:26:27
\*----------------------------------------*/
import React from 'react';

const Tooltip = ({ title, children, position = Tooltip.topLeft }) => {
	const [display, setDisplay] = React.useState(false);
	const [mouse, setMouse] = React.useState({
		x:0,
		y:0
	});
	const myRef = React.useRef();
	const toolTypRef = React.useRef();
	const timer = React.useRef();

	const mouseEnterHandler = event => {
		timer.current = setTimeout(()=>{
			setDisplay(true);	
		}, 500);
	}
	const mouseLeaveHandler = ()=>{
		clearTimeout(timer.current);
		setDisplay(false);	
	}
	const mouseMoveHandler = event => {
		let wrapperRect = event.target.getBoundingClientRect();
		let toolTipRect = toolTypRef.current.getBoundingClientRect();
		let [x, y] =[(event.clientX - wrapperRect.left), (event.clientY - wrapperRect.top)]
		const offset = [toolTipRect.width/2, toolTipRect.height/2];
		x = Math.min(Math.max(x, offset[0]), wrapperRect.width-offset[0]);
		y = Math.min(Math.max(y, offset[1]), wrapperRect.width-offset[1]);
		setMouse({
			x : x,
			y : y
		});
	}

	React.useEffect(() => {
		myRef.current.parentElement.style.position = "relative";
		myRef.current.parentElement.style.overflow = "visible";
		return () => {}
	}, []);

	let style = {
		position: "absolute",
		zIndex: "100",
		background: "gray",
		padding: "5px",
		borderRadius: "5px",
		textTransform: 'capitalize',
		fontFamily : 'monospace'
	};
	if(position == Tooltip.topLeft){
		style.top = "100%";
		style.left = "0";
	}
	else if(position == Tooltip.topMiddle){
		style.top = "100%";
		style.left= "50%";
		style.transform = "translate(-50%, 0)";
	}
	else if(position == Tooltip.topRight){
		style.top = "100%";
		style.right = "0";
	}
	else if(position == Tooltip.bottomCursor){
		style.bottom = "100%";
		style.left = mouse.x+"px";
		// style.transform = "translate(-50%, 0)";
	}
	else if(position == Tooltip.topCursor){
		style.top = "100%";
		style.left = mouse.x+"px";
		style.transform = "translate(-50%, 0)";
	}
	else if(position == Tooltip.bottomMiddle){
		style.bottom = "100%";
		style.transform = "translate(-50%, 0)";
		style.left= "50%";
	}

	return (
		<span ref={myRef}
			onMouseEnter={mouseEnterHandler.bind(this)} 
			onMouseLeave={mouseLeaveHandler.bind(this)}
			onMouseMove={mouseMoveHandler.bind(this)}
			style={{width:"100%"}}
		>
			<span ref={toolTypRef}
				onMouseEnter={mouseLeaveHandler.bind(this)} 
				className={`noselect mixTube-tooltip ${display ? ``: `hide`}`}
				style={style}
			>
				{title}
			</span>
			{
				React.Children.map(children, child => child)
			}
		</span>
	);
}
Tooltip.topLeft = 1;
Tooltip.topMiddle = 2;
Tooltip.topRight = 3;
Tooltip.MiddleLeft = 4;
Tooltip.MiddleMiddle = 5;
Tooltip.MiddleRight = 6;
Tooltip.bottomLeft = 7;
Tooltip.bottomMiddle = 8;
Tooltip.bottomRight = 9;
Tooltip.topCursor = 10;
Tooltip.middleCursor = 11;
Tooltip.bottomCursor = 12;
Tooltip.cursorLeft = 13;
Tooltip.cursorMiddle = 14;
Tooltip.cursorRight = 15;
Tooltip.cursorCursor = 16;


export default Tooltip;