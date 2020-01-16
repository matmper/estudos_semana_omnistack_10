import React, { useState, useEffect } from 'react';
import api from './services/api';

import './global.css';
import './App.css';
import './Sidebar.css';
import './Main.css';

import DevItem from './components/DevItem';
import DevForm from './components/DevForm';

function App() {

	// variávels de estado
	const [devs, setDevs]						= useState([]);

	// lista os devs cadastrados, get api
	useEffect(() => {

		async function loadDevs() {

			const response = await api.get('');

			setDevs(response.data);

		}

		loadDevs();

	}, []);

	// envia os dados do formulário para a api
	async function handleAddDev(data) {

		const response = await api.post('/devs', data);

		setDevs([...devs, response.data]);

	}

  	return (
  		<div id="app">

  			<aside>
  				<strong>Register</strong>
  				<DevForm onSubmit={handleAddDev} />
  			</aside>

  			<main>
  				<ul>
  					{
  						devs.map(dev => (
  							<DevItem key={dev._id} dev={dev} />
  						))
  					}
  				</ul>
  			</main>

  		</div>
  	);
}

export default App;

// Componente     	Bloco HTML isolado
// Propriedade    	Informações que um componente pai passa para o componente filho
// Estado  			Informações mantidas pelo componente (imutabilidade)