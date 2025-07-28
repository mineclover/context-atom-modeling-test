import React from 'react'
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native'
import { useText } from '../contexts/textContext'

export const TextController: React.FC = () => {
	const [text, setText] = useText()

	const texts = [
		'Hello Jotai!',
		'React Native!',
		'TypeScript!',
		'Context API!',
		'Atom Pattern!',
	]

	const changeText = () => {
		const randomText = texts[Math.floor(Math.random() * texts.length)]
		setText(randomText)
	}

	const addEmoji = () => {
		const emojis = ['😀', '🚀', '⭐', '🎉', '💡']
		const randomEmoji = emojis[Math.floor(Math.random() * emojis.length)]
		setText(prev => prev + ' ' + randomEmoji)
	}

	return (
		<View style={styles.container}>
			<View style={styles.buttonContainer}>
				<TouchableOpacity
					onPress={changeText}
					style={[styles.button, styles.changeButton]}
				>
					<Text style={styles.buttonText}>Change</Text>
				</TouchableOpacity>
				<TouchableOpacity
					onPress={addEmoji}
					style={[styles.button, styles.emojiButton]}
				>
					<Text style={styles.buttonText}>+ 😀</Text>
				</TouchableOpacity>
			</View>
		</View>
	)
}

const styles = StyleSheet.create({
	container: {
		padding: 4,
		margin: 2,
		alignItems: 'center',
	},
	buttonContainer: {
		flexDirection: 'row',
		gap: 4,
	},
	button: {
		paddingVertical: 3,
		paddingHorizontal: 6,
		borderRadius: 3,
		minWidth: 35,
		alignItems: 'center',
	},
	changeButton: {
		backgroundColor: '#17a2b8',
	},
	emojiButton: {
		backgroundColor: '#fd7e14',
	},
	buttonText: {
		color: 'white',
		fontSize: 7,
		fontWeight: '600',
	},
})