/*----------------------------------------*\
  mixTube - RenderController.js
  @author Evrard Vincent (vincent@ogre.be)
  @Date:   2021-12-28 18:30:42
  @Last Modified time: 2021-12-28 21:26:05
\*----------------------------------------*/
import React from 'react';

const RenderController = ({currentTrack}) => {
	return (
		<div className="mixTube-element mixTube-controller">
			<ul>
				<li>
					{
						false ? 
							<button>pause</button>
						: 
							<button>play</button>
					}
				</li>
			</ul>

		</div>
	);
}

export default RenderController;