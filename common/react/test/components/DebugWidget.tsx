import React from 'react'
import { View, Text, StyleSheet, Animated, TouchableOpacity } from 'react-native'

const DebugWidget = () => {
	const animatedValue = React.useRef(new Animated.Value(0)).current
	const [isRunning, setIsRunning] = React.useState(false)

	// 간단한 애니메이션 함수
	const startAnimation = () => {
		console.log('🚀 Starting animation...')
		setIsRunning(true)
		
		const runAnimation = () => {
			Animated.sequence([
				Animated.timing(animatedValue, {
					toValue: 1,
					duration: 1000,
					useNativeDriver: true,
				}),
				Animated.timing(animatedValue, {
					toValue: 0,
					duration: 1000,
					useNativeDriver: true,
				}),
			]).start((finished) => {
				console.log('Animation finished:', finished)
				if (finished && isRunning) {
					runAnimation() // 반복
				}
			})
		}

		runAnimation()
	}

	const stopAnimation = () => {
		console.log('⏹️ Stopping animation...')
		setIsRunning(false)
		animatedValue.stopAnimation((value) => {
			console.log('Animation stopped at value:', value)
		})
	}

	const resetAnimation = () => {
		console.log('🔄 Resetting animation...')
		setIsRunning(false)
		animatedValue.stopAnimation()
		animatedValue.setValue(0)
	}

	// 애니메이션 스타일
	const animatedStyle = {
		transform: [
			{
				translateY: animatedValue.interpolate({
					inputRange: [0, 1],
					outputRange: [0, -30],
				}),
			},
			{
				rotate: animatedValue.interpolate({
					inputRange: [0, 1],
					outputRange: ['0deg', '180deg'],
				}),
			},
		],
	}

	return (
		<View style={styles.container}>
			<Text style={styles.title}>🐛 Debug Widget</Text>
			
			{/* 애니메이션 적용되는 요소 */}
			<Animated.View style={[styles.animatedBox, animatedStyle]}>
				<Text style={styles.boxText}>Move Me!</Text>
			</Animated.View>

			{/* 상태 표시 */}
			<Text style={styles.status}>
				Status: {isRunning ? '🔄 Running' : '⏸️ Stopped'}
			</Text>

			{/* 컨트롤 버튼 */}
			<View style={styles.controls}>
				<TouchableOpacity style={styles.button} onPress={startAnimation}>
					<Text style={styles.buttonText}>▶️ Play</Text>
				</TouchableOpacity>
				<TouchableOpacity style={styles.button} onPress={stopAnimation}>
					<Text style={styles.buttonText}>⏹️ Stop</Text>
				</TouchableOpacity>
				<TouchableOpacity style={styles.button} onPress={resetAnimation}>
					<Text style={styles.buttonText}>🔄 Reset</Text>
				</TouchableOpacity>
			</View>
		</View>
	)
}

const styles = StyleSheet.create({
	container: {
		width: 160,
		margin: 8,
		padding: 12,
		backgroundColor: '#f0f8ff',
		borderRadius: 12,
		borderWidth: 2,
		borderColor: '#87ceeb',
		alignItems: 'center',
	},
	title: {
		fontSize: 14,
		fontWeight: 'bold',
		color: '#333',
		marginBottom: 12,
	},
	animatedBox: {
		width: 60,
		height: 60,
		backgroundColor: '#ff6b6b',
		borderRadius: 8,
		alignItems: 'center',
		justifyContent: 'center',
		marginVertical: 20,
	},
	boxText: {
		color: '#fff',
		fontSize: 10,
		fontWeight: 'bold',
	},
	status: {
		fontSize: 10,
		color: '#666',
		marginBottom: 12,
	},
	controls: {
		flexDirection: 'row',
		gap: 4,
	},
	button: {
		paddingHorizontal: 8,
		paddingVertical: 4,
		backgroundColor: '#4ecdc4',
		borderRadius: 4,
	},
	buttonText: {
		color: '#fff',
		fontSize: 8,
		fontWeight: 'bold',
	},
})

export default DebugWidget