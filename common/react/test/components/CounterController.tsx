import React from 'react'
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import { useCounterViewModel } from '../core/useCounterViewModel'

export const CounterController: React.FC = () => {
	const { increment, decrement, reset } = useCounterViewModel()

	return (
		<View style={styles.container}>
			<Text style={styles.title}>카운터 컨트롤러</Text>
			<View style={styles.buttonContainer}>
				<TouchableOpacity
					onPress={increment}
					style={[styles.button, styles.incrementButton]}
				>
					<Text style={styles.buttonText}>증가 (+1)</Text>
				</TouchableOpacity>
				<TouchableOpacity
					onPress={decrement}
					style={[styles.button, styles.decrementButton]}
				>
					<Text style={styles.buttonText}>감소 (-1)</Text>
				</TouchableOpacity>
				<TouchableOpacity
					onPress={reset}
					style={[styles.button, styles.resetButton]}
				>
					<Text style={styles.buttonText}>리셋 (0)</Text>
				</TouchableOpacity>
			</View>
		</View>
	)
}

const styles = StyleSheet.create({
	container: {
		padding: 8, // 패딩 축소
		margin: 4, // 마진 축소
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
		marginBottom: 6, // 마진 축소
		fontSize: 10, // 폰트 크기 축소
		fontWeight: '600',
		color: '#333',
	},
	buttonContainer: {
		flexDirection: 'column', // 세로 배치로 변경
		flexWrap: 'wrap',
		justifyContent: 'center',
		gap: 4, // 간격 축소
	},
	button: {
		paddingVertical: 4, // 패딩 축소
		paddingHorizontal: 8,
		borderRadius: 4,
		minWidth: 60, // 최소 너비 축소
		alignItems: 'center',
	},
	incrementButton: {
		backgroundColor: '#4CAF50',
	},
	decrementButton: {
		backgroundColor: '#f44336',
	},
	resetButton: {
		backgroundColor: '#008CBA',
	},
	buttonText: {
		color: 'white',
		fontSize: 8, // 폰트 크기 축소
		fontWeight: '600',
	},
})