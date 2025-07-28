import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { useUserValue } from '../contexts/userContext'

export const UserDisplay: React.FC = () => {
	const user = useUserValue()

	return (
		<View style={styles.container}>
			<Text style={styles.title}>👤 User Info</Text>
			<Text style={styles.text}>Name: {user.name}</Text>
			<Text style={styles.text}>Age: {user.age}</Text>
			<Text style={styles.text}>Email: {user.email}</Text>
		</View>
	)
}

const styles = StyleSheet.create({
	container: {
		padding: 4,
		margin: 2,
		borderWidth: 1,
		borderColor: '#e74c3c',
		borderRadius: 4,
		backgroundColor: '#fadbd8',
		alignItems: 'center',
	},
	title: {
		fontSize: 10,
		fontWeight: 'bold',
		color: '#e74c3c',
		marginBottom: 2,
	},
	text: {
		fontSize: 8,
		color: '#c0392b',
		textAlign: 'center',
	},
})