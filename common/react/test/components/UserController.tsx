import React from 'react'
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import { useUser } from '../contexts/userContext'

export const UserController: React.FC = () => {
	const [user, setUser] = useUser()

	const changeUser = () => {
		const users = [
			{ name: 'Alice', age: 28, email: 'alice@example.com' },
			{ name: 'Bob', age: 32, email: 'bob@example.com' },
			{ name: 'Charlie', age: 24, email: 'charlie@example.com' },
		]
		const randomUser = users[Math.floor(Math.random() * users.length)]
		setUser(randomUser)
	}

	const increaseAge = () => {
		setUser(prev => ({ ...prev, age: prev.age + 1 }))
	}

	return (
		<View style={styles.container}>
			<Text style={styles.title}>User Control</Text>
			<View style={styles.buttonContainer}>
				<TouchableOpacity
					onPress={changeUser}
					style={[styles.button, styles.changeButton]}
				>
					<Text style={styles.buttonText}>Change</Text>
				</TouchableOpacity>
				<TouchableOpacity
					onPress={increaseAge}
					style={[styles.button, styles.ageButton]}
				>
					<Text style={styles.buttonText}>Age+</Text>
				</TouchableOpacity>
			</View>
		</View>
	)
}

const styles = StyleSheet.create({
	container: {
		padding: 6,
		margin: 4,
		backgroundColor: '#fff',
		borderRadius: 6,
		shadowColor: '#000',
		shadowOffset: {
			width: 0,
			height: 1,
		},
		shadowOpacity: 0.05,
		shadowRadius: 2,
		elevation: 2,
		alignItems: 'center',
	},
	title: {
		marginBottom: 4,
		fontSize: 10,
		fontWeight: '600',
		color: '#333',
	},
	buttonContainer: {
		flexDirection: 'row',
		gap: 4,
	},
	button: {
		paddingVertical: 3,
		paddingHorizontal: 6,
		borderRadius: 3,
		minWidth: 40,
		alignItems: 'center',
	},
	changeButton: {
		backgroundColor: '#e74c3c',
	},
	ageButton: {
		backgroundColor: '#f39c12',
	},
	buttonText: {
		color: 'white',
		fontSize: 8,
		fontWeight: '600',
	},
})