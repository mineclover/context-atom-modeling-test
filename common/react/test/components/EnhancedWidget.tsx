import React from 'react'
import { View, Text, StyleSheet, Animated, TouchableOpacity, Easing } from 'react-native'
import { CounterProvider } from '../contexts/counterContext'
import { CounterDisplay } from './CounterDisplay'
import { CounterController } from './CounterController'
import { ValueDisplay } from './ValueDisplay'
import { useFloatingAnimation } from '../core/useFloatingAnimation'
import { useAnimationControl } from '../core/useAnimationControl'

const EnhancedWidget = () => {
	// 애니메이션 훅
	const { animatedValue, animatedStyle } = useFloatingAnimation({
		duration: 2500,
		translateRange: [0, -15],
		rotateRange: ['0deg', '360deg'],
		easing: Easing.bezier(0.25, 0.1, 0.25, 1),
		autoStart: false, // 수동 제어를 위해 자동 시작 비활성화
	})

	// 애니메이션 제어 훅
	const animationControl = useAnimationControl(
		animatedValue,
		React.useCallback(() => {
			return Animated.loop(
				Animated.sequence([
					Animated.timing(animatedValue, {
						toValue: 1,
						duration: 2500,
						easing: Easing.bezier(0.25, 0.1, 0.25, 1),
						useNativeDriver: true,
					}),
					Animated.timing(animatedValue, {
						toValue: 0,
						duration: 2500,
						easing: Easing.bezier(0.25, 0.1, 0.25, 1),
						useNativeDriver: true,
					}),
				])
			)
		}, [animatedValue])
	)

	// 상태별 색상 변경
	const getContainerStyle = () => {
		switch (animationControl.state) {
			case 'running':
				return [styles.container, styles.containerRunning]
			case 'paused':
				return [styles.container, styles.containerPaused]
			case 'stopped':
				return [styles.container, styles.containerStopped]
			default:
				return styles.container
		}
	}

	return (
		<CounterProvider>
			<View style={getContainerStyle()}>
				{/* 애니메이션 제어 버튼들 */}
				<View style={styles.controlPanel}>
					<TouchableOpacity
						style={[styles.controlButton, styles.playButton]}
						onPress={animationControl.start}
						disabled={animationControl.isRunning}
					>
						<Text style={styles.controlButtonText}>▶️</Text>
					</TouchableOpacity>
					
					<TouchableOpacity
						style={[styles.controlButton, styles.pauseButton]}
						onPress={animationControl.pause}
						disabled={!animationControl.isRunning}
					>
						<Text style={styles.controlButtonText}>⏸️</Text>
					</TouchableOpacity>
					
					<TouchableOpacity
						style={[styles.controlButton, styles.resumeButton]}
						onPress={animationControl.resume}
						disabled={!animationControl.isPaused}
					>
						<Text style={styles.controlButtonText}>⏯️</Text>
					</TouchableOpacity>
					
					<TouchableOpacity
						style={[styles.controlButton, styles.stopButton]}
						onPress={animationControl.stop}
						disabled={animationControl.state === 'idle'}
					>
						<Text style={styles.controlButtonText}>⏹️</Text>
					</TouchableOpacity>
					
					<TouchableOpacity
						style={[styles.controlButton, styles.resetButton]}
						onPress={animationControl.reset}
					>
						<Text style={styles.controlButtonText}>🔄</Text>
					</TouchableOpacity>
				</View>

				{/* 상태 표시 */}
				<View style={styles.statusContainer}>
					<Text style={styles.statusText}>
						Status: {animationControl.state.toUpperCase()}
					</Text>
				</View>

				{/* 배경 장식 - 애니메이션 적용 */}
				<Animated.View style={[styles.backgroundDecoration, animatedStyle]} />

				<View style={styles.content}>
					<Text style={styles.title}>
						🎛️ Enhanced Widget
					</Text>

					<View style={styles.gridContainer}>
						{/* Atom 고유 값 표시 */}
						<View style={styles.valueDisplayContainer}>
							<ValueDisplay />
						</View>

						<CounterDisplay />
						<CounterController />

						<View style={styles.descriptionContainer}>
							<Text style={styles.descriptionTitle}>
								🎮 Animation Control
							</Text>
							<Text style={styles.descriptionText}>
								Control animation with play, pause, resume, stop, and reset buttons.
							</Text>
						</View>
					</View>
				</View>
			</View>
		</CounterProvider>
	)
}

const styles = StyleSheet.create({
	container: {
		width: 200, // Enhanced widget is slightly larger
		marginHorizontal: 8,
		marginVertical: 8,
		padding: 12,
		backgroundColor: '#667eea',
		borderRadius: 12,
		shadowColor: '#000',
		shadowOffset: {
			width: 0,
			height: 4,
		},
		shadowOpacity: 0.1,
		shadowRadius: 8,
		elevation: 4,
		position: 'relative',
		overflow: 'hidden',
	},
	containerRunning: {
		backgroundColor: '#48bb78', // Green when running
	},
	containerPaused: {
		backgroundColor: '#ed8936', // Orange when paused
	},
	containerStopped: {
		backgroundColor: '#e53e3e', // Red when stopped
	},
	controlPanel: {
		flexDirection: 'row',
		justifyContent: 'center',
		marginBottom: 8,
		gap: 4,
	},
	controlButton: {
		width: 28,
		height: 24,
		borderRadius: 4,
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: 'rgba(255, 255, 255, 0.9)',
	},
	controlButtonText: {
		fontSize: 8,
	},
	playButton: {
		backgroundColor: 'rgba(72, 187, 120, 0.9)',
	},
	pauseButton: {
		backgroundColor: 'rgba(237, 137, 54, 0.9)',
	},
	resumeButton: {
		backgroundColor: 'rgba(66, 153, 225, 0.9)',
	},
	stopButton: {
		backgroundColor: 'rgba(229, 62, 62, 0.9)',
	},
	resetButton: {
		backgroundColor: 'rgba(128, 90, 213, 0.9)',
	},
	statusContainer: {
		alignItems: 'center',
		marginBottom: 8,
	},
	statusText: {
		fontSize: 8,
		fontWeight: 'bold',
		color: 'rgba(255, 255, 255, 0.9)',
		backgroundColor: 'rgba(0, 0, 0, 0.3)',
		paddingHorizontal: 6,
		paddingVertical: 2,
		borderRadius: 8,
	},
	backgroundDecoration: {
		position: 'absolute',
		top: -80,
		right: -80,
		width: 160,
		height: 160,
		backgroundColor: 'rgba(255,255,255,0.1)',
		borderRadius: 80,
	},
	content: {
		position: 'relative',
		zIndex: 1,
	},
	title: {
		textAlign: 'center',
		marginBottom: 12,
		color: '#ffffff',
		fontSize: 12,
		fontWeight: '600',
		letterSpacing: -0.2,
		shadowColor: '#000',
		shadowOffset: {
			width: 0,
			height: 1,
		},
		shadowOpacity: 0.1,
		shadowRadius: 2,
		elevation: 1,
	},
	gridContainer: {
		gap: 8,
	},
	valueDisplayContainer: {
		padding: 6,
		backgroundColor: 'rgba(255,255,255,0.9)',
		borderRadius: 6,
		borderWidth: 1,
		borderColor: 'rgba(52, 152, 219, 0.3)',
		alignItems: 'center',
		shadowColor: '#000',
		shadowOffset: {
			width: 0,
			height: 1,
		},
		shadowOpacity: 0.05,
		shadowRadius: 4,
		elevation: 2,
	},
	descriptionContainer: {
		padding: 4,
		backgroundColor: 'rgba(255,255,255,0.95)',
		borderRadius: 4,
		marginTop: 4,
		shadowColor: '#000',
		shadowOffset: {
			width: 0,
			height: 1,
		},
		shadowOpacity: 0.03,
		shadowRadius: 4,
		elevation: 2,
		borderWidth: 1,
		borderColor: 'rgba(255,255,255,0.2)',
	},
	descriptionTitle: {
		marginBottom: 2,
		color: '#4a5568',
		fontSize: 9,
		fontWeight: '600',
	},
	descriptionText: {
		color: '#718096',
		lineHeight: 11,
		fontSize: 7,
	},
})

export default EnhancedWidget