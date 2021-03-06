import React, { useEffect, useState } from 'react';
import { StyleSheet, Image, View, Text, TextInput, TouchableOpacity, Keyboard } from 'react-native';
import MapView, { Marker, Callout } from 'react-native-maps';
import { requestPermissionsAsync, getCurrentPositionAsync } from 'expo-location';
import { MaterialIcons } from '@expo/vector-icons';

import api from '../services/api';
import socket from '../services/socket';


function Main({ navigation }) {

	const [devs, setDevs]					= useState([]);
	const [currentRegion, setCurrentRegion] = useState(null);
	const [techs, setTechs]					= useState('');
	const [position, setPosition]			= useState('');

	useEffect(() => {
		async function loadInitialPosition() {

			let { granted } = await requestPermissionsAsync();

			// verifica se usuário deu permissão de localização
			if( granted ) {

				const { coords } = await getCurrentPositionAsync({
					enableHighAccuracy: true
				});

				const { latitude, longitude } = coords;

				setCurrentRegion({
					latitude,
					longitude,
					latitudeDelta: 0.04,
					longitudeDelta: 0.04,
				});

				setPosition( `${latitude}, ${longitude}`);

			// senão, pede novamente
			} else {

				let { granted } = await requestPermissionsAsync();

			}

		}

		loadInitialPosition();

	}, []);

	useEffect(() => {

		socket.subscribeToNewDevs(dev => 
			setDevs([...devs, dev])
		);

	}, [devs]);

	// função que envia dados para o websocket (back-end)
	function setupWebsocket() {

		socket.disconnect();

		const { latitude, longitude } 	= currentRegion;

		const data 						= {latitude, longitude, techs};

		socket.connect(data);

	}

	// carrega os devs e exibem do maps
	async function loadDevs() {

		const { latitude, longitude } = currentRegion;

		const response = await api.get('/search', {
			params: {
				latitude,
				longitude,
				techs: techs,
			}
		});

		//console.log(response.data.devs);
		
		setDevs(response.data.devs);

		setupWebsocket();

	}

	// sempre que o usuário mover o mapa, atualiza posição atual
	function handleRegionChanged( region ) {

		setCurrentRegion( region );

		setPosition( `${region.latitude}, ${region.longitude}`);

	}

	if( !currentRegion ) {
		return false;
	}

	return (
		<>
			<MapView onRegionChangeComplete={handleRegionChanged} style={styles.map} initialRegion={currentRegion}>
			
				{devs.map(dev => (
					<Marker key={dev._id} coordinate={{longitude: dev.location.coordinates[0], latitude: dev.location.coordinates[1]}} >
						<Image source={{ uri: dev.avatar_url }} style={styles.avatar} />
						<Callout onPress={() => {
							navigation.navigate('Profile', { github_username: dev.github_username });
						}}>
							<View style={styles.callout}>
								<Text style={styles.devName}>{dev.name}</Text>
								<Text style={styles.devBio}>{dev.bio}</Text>
								<Text style={styles.devTechs}>{dev.techs.join(', ')}</Text>
							</View>
						</Callout>
					</Marker>
				))}

			</MapView>

			<Text style={styles.textPosition}>
				Posição atual: {position}
			</Text>

			<View style={styles.searchForm}>

				<TextInput
					style={styles.searchInput}
					placeholder="Buscar devs por techs..."
					placeholderTextColor="#999"
					autoCapitalize="words"
					autoCorrect={false}
					onChangeText={setTechs} // = text => setTechs(text)
				/>
				<TouchableOpacity onPress={loadDevs} style={styles.loadButton}>
					<MaterialIcons name="my-location" size={20} color="#FFF" />
				</TouchableOpacity>

			</View>
		</>
	);

}

const styles = StyleSheet.create({
	map: {
		flex: 1
	},
	avatar: {
		width: 54,
		height: 54,
		borderRadius: 4,
		borderWidth: 4,
		borderColor: '#FFF'
	},

	callout: {
		width: 260,
	},
	callName: {
		fontWeight: 'bold',
		fontSize: 16
	},
	devBio: {
		color: '#666',
		marginTop: 5,
	},
	devTechs: {
		marginTop: 5,
	},

	textPosition: {
		position: 'absolute',
		borderRadius: 25,
		top: 20,
		left: 20,
		right: 20,
		zIndex: 5,
		padding: 5,
		flex: 1,
		backgroundColor: '#FFF',
		fontSize: 10,
		fontWeight: 'bold',
		justifyContent: 'center',
		alignItems: 'center',
		color: '#CCC',
		shadowColor: '#000',
		shadowOpacity: 0.2,
		shadowOffset: {
			width: 4,
			height: 4
		},

	},

	searchForm: {
		position: 'absolute',
		top: 50,
		left: 20,
		right: 20,
		zIndex: 5,
		flexDirection: 'row',  
	},
	searchInput: {
		flex: 1,
		height: 50,
		backgroundColor: '#FFF',
		borderRadius: 25,
		paddingHorizontal: 20,
		fontSize: 16,
		shadowColor: '#000',
		shadowOpacity: 0.2,
		shadowOffset: {
			width: 4,
			height: 4
		},
		elevation: 3
	},
	loadButton: {
		width: 50,
		height: 50,
		backgroundColor: '#8E4Dff',
		borderRadius: 25,
		justifyContent: 'center',
		alignItems: 'center',
		marginLeft: 15,
	}

});

export default Main;