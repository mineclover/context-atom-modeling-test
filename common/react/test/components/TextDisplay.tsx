import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { useTextValue } from '../contexts/textContext'

export const TextDisplay: React.FC = () => {
	const text = useTextValue()

	return (
		<View style={styles.container}>
			<Text style={styles.label}>📝 Text:</Text>
			<Text style={styles.text}>{text}</Text>
		</View>
	)
}

const styles = StyleSheet.create({
	container: {
		padding: 4,
		margin: 2,
		borderWidth: 1,
		borderColor: '#17a2b8',
		borderRadius: 4,
		backgroundColor: '#d1ecf1',
		alignItems: 'center',
	},
	label: {
		fontSize: 8,
		fontWeight: 'bold',
		color: '#0c5460',
		marginBottom: 2,
	},
	text: {
		fontSize: 8,
		color: '#0c5460',
		textAlign: 'center',
	},
})