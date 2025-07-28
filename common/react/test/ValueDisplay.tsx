import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { useAtomValue } from 'jotai'
import { useJotaiContext } from './JotaiContext'

export const ValueDisplay: React.FC = () => {
	const { counterAtomRef } = useJotaiContext()
	const currentValue = useAtomValue(counterAtomRef.current)

	return (
		<View style={styles.container}>
			<Text style={styles.text}>
				현재 값: {currentValue}
			</Text>
		</View>
	)
}

const styles = StyleSheet.create({
	container: {
		padding: 4, // 패딩 축소
		margin: 2, // 마진 축소
		borderWidth: 1, // 보더 축소
		borderColor: '#3498db',
		borderRadius: 4,
		backgroundColor: '#ecf0f1',
		alignItems: 'center',
	},
	text: {
		fontSize: 12, // 폰트 크기 축소
		fontWeight: 'bold',
		textAlign: 'center',
		color: '#2c3e50',
	},
})