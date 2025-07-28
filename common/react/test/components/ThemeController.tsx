import React from 'react'
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import { useTheme } from '../contexts/themeContext'

export const ThemeController: React.FC = () => {
	const [theme, setTheme] = useTheme()

	const themes = ['light', 'dark', 'blue', 'green'] as const

	const nextTheme = () => {
		const currentIndex = themes.indexOf(theme)
		const nextIndex = (currentIndex + 1) % themes.length
		setTheme(themes[nextIndex])
	}

	return (
		<View style={styles.container}>
			<TouchableOpacity onPress={nextTheme} style={styles.button}>
				<Text style={styles.buttonText}>Switch Theme</Text>
			</TouchableOpacity>
		</View>
	)
}

const styles = StyleSheet.create({
	container: {
		padding: 4,
		margin: 2,
		alignItems: 'center',
	},
	button: {
		backgroundColor: '#6f42c1',
		paddingVertical: 4,
		paddingHorizontal: 8,
		borderRadius: 4,
	},
	buttonText: {
		color: 'white',
		fontSize: 8,
		fontWeight: '600',
	},
})