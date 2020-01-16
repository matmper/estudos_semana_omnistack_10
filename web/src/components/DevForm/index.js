import React, { useState, useEffect } from 'react';

import './style.css';

function DevForm({ onSubmit }) {

	const [github_username, setGithubUsername] 	= useState('');
	const [techs, setTechs] 					= useState('');
	const [latitude, setLatitude] 				= useState('');
	const [longitude, setLongitude] 			= useState('');

	useEffect(() => {

		// captura localização do usuário
		navigator.geolocation.getCurrentPosition(
			(position) => {

				const { latitude, longitude } = position.coords;

				setLatitude(latitude);
				setLongitude(longitude);

			},
			(err) => {
				console.log(err);
			},
			{
				//timeout: 10000,
			}
		);

	}, []);

	async function handleSubmit(e) {

		e.preventDefault();

		await onSubmit({
			github_username,
			techs,
			latitude,
			longitude,
		});

		// limpa os campos (forms inputs)
		setGithubUsername('');
		setTechs('');

	}

	return (
		<form onSubmit={handleSubmit}>

			<div className="input-block">
				<label htmlFor="github_username">Github Username</label>
				<input name="github_username" id="github_username" value={github_username} required onChange={e => setGithubUsername(e.target.value)}/>
			</div>

			<div className="input-block">
				<label htmlFor="techs">Development Techs</label>
				<input name="techs" id="techs" required value={techs} onChange={e => setTechs(e.target.value)}/>
			</div>

			<div className="input-group">
				<div className="input-block">
					<label htmlFor="latitude">Latitude</label>
					<input name="latitude" id="latitude" value={latitude} required onChange={e => setLatitude(e.target.value)}/>
				</div>
				<div className="input-block">
					<label htmlFor="longitude">Longitude</label>
					<input name="longitude" id="longitude" value={longitude} required onChange={e => setLongitude(e.target.value)}/>
				</div>
			</div>

			<button type="submit">
				Salvar
			</button>

		</form>
	);
}

export default DevForm;