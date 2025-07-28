import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { useThemeValue } from '../contexts/themeContext'

export const ThemeDisplay: React.FC = () => {
	const theme = useThemeValue()

	const getThemeColor = () => {
		switch (theme) {
			case 'light': return '#f8f9fa'
			case 'dark': return '#343a40'
			case 'blue': return '#007bff'
			case 'green': return '#28a745'
			default: return '#f8f9fa'
		}
	}

	const getTextColor = () => {
		return theme === 'light' ? '#333' : '#fff'
	}

	return (
		<View style={[styles.container, { backgroundColor: getThemeColor() }]}>
			<Text style={[styles.text, { color: getTextColor() }]}>
				🎨 Theme: {theme}
			</Text>
		</View>
	)
}

const styles = StyleSheet.create({
	container: {
		padding: 6,
		margin: 2,
		borderRadius: 4,
		alignItems: 'center',
		borderWidth: 1,
		borderColor: 'rgba(0,0,0,0.1)',
	},
	text: {
		fontSize: 10,
		fontWeight: 'bold',
	},
})