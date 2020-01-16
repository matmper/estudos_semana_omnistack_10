import React from 'react';

import './style.css';

function DevItem({dev}) {

	return(
		<li key={dev.id} className="dev-item">
			<header>
				<img src={dev.avatar_url}/>
				<div className="user-info">
					<strong>{dev.name}</strong>
					<span>{dev.techs.join(', ')}</span>
					<p>
						{dev.bio}
					</p>
					<a href={`https://github.com/${dev.github_username}`} target="_blank">
						Acessar GitHub - @{dev.github_username}
					</a>
				</div>
			</header>
		</li>
	);	
}

export default DevItem;