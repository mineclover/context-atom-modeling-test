import React from 'react'
import { View, Text, StyleSheet, Animated } from 'react-native'
import { CounterProvider } from '../contexts/counterContext'
import { CounterDisplay } from './CounterDisplay'
import { CounterController } from './CounterController'
import { ValueDisplay } from './ValueDisplay'
import { AnimationControls } from './AnimationControls'
import { useFloatingAnimation } from '../core/useFloatingAnimation'

const Widget = () => {
	// 표준화된 애니메이션 훅 사용
	const { animatedStyle, startAnimation, stopAnimation, resetAnimation } = useFloatingAnimation({
		duration: 2000, // 더 빠르게
		translateRange: [0, -20], // 더 크게 움직이도록
		rotateRange: ['0deg', '360deg'], // 한 바퀴 회전
		autoStart: true, // 자동 시작으로 변경하여 테스트
	})

	// 디버깅용 함수들
	const handlePlay = () => {
		console.log('Play button pressed')
		startAnimation()
	}

	const handleStop = () => {
		console.log('Stop button pressed')
		stopAnimation()
	}

	const handleReset = () => {
		console.log('Reset button pressed')
		resetAnimation()
	}

	return (
		<CounterProvider>
			<Animated.View style={[styles.container, animatedStyle]}>
				{/* 배경 장식 */}
				<Animated.View style={[styles.backgroundDecoration, animatedStyle]} />

				<View style={styles.content}>
					<Text style={styles.title}>
						✨ Jotai Test ✨
					</Text>

					<View style={styles.gridContainer}>
						{/* Atom 고유 값 표시 */}
						<View style={styles.valueDisplayContainer}>
							<ValueDisplay />
						</View>

						<CounterDisplay />
						<CounterController />

						{/* 애니메이션 컨트롤 버튼 */}
						<AnimationControls
							onPlay={handlePlay}
							onStop={handleStop}
							onReset={handleReset}
							size="small"
						/>

						<View style={styles.descriptionContainer}>
							<Text style={styles.descriptionTitle}>
								🔬 Description
							</Text>
							<Text style={styles.descriptionText}>
								Simplified Jotai context pattern with animation controls. Test counter sync and animations.
							</Text>
						</View>
					</View>
				</View>
			</Animated.View>
		</CounterProvider>
	);
}

const styles = StyleSheet.create({
	container: {
		width: 160, // 고정 너비로 변경
		marginHorizontal: 8,
		marginVertical: 8,
		padding: 12, // 패딩 축소
		backgroundColor: '#667eea',
		borderRadius: 12, // 라디우스 축소
		shadowColor: '#000',
		shadowOffset: {
			width: 0,
			height: 4, // 그림자 축소
		},
		shadowOpacity: 0.1,
		shadowRadius: 8,
		elevation: 4,
		position: 'relative',
		overflow: 'hidden',
	},
	backgroundDecoration: {
		position: 'absolute',
		top: -40,
		right: -40,
		width: 80,
		height: 80,
		backgroundColor: 'rgba(255,255,255,0.3)', // 더 선명하게
		borderRadius: 40,
	},
	content: {
		position: 'relative',
		zIndex: 1,
	},
	title: {
		textAlign: 'center',
		marginBottom: 12, // 마진 축소
		color: '#ffffff',
		fontSize: 14, // 폰트 크기 축소
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
		gap: 8, // 간격 축소
	},
	valueDisplayContainer: {
		padding: 6, // 패딩 축소
		backgroundColor: 'rgba(255,255,255,0.9)',
		borderRadius: 6,
		borderWidth: 1, // 보더 없애기
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
		padding: 4, // 패딩 더 축소
		backgroundColor: 'rgba(255,255,255,0.95)',
		borderRadius: 4,
		marginTop: 4, // 마진 더 축소
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
		marginBottom: 2, // 마진 더 축소
		color: '#4a5568',
		fontSize: 10, // 폰트 크기 축소
		fontWeight: '600',
	},
	descriptionText: {
		color: '#718096',
		lineHeight: 12, // 라인 하이트 더 축소
		fontSize: 8, // 폰트 크기 축소
	},
})

export default Widget