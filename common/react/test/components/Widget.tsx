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
		duration: 3000,
		translateRange: [0, -10],
		rotateRange: ['0deg', '180deg'],
		autoStart: false, // 수동으로 제어
	})

	return (
		<CounterProvider>
			<View style={styles.container}>
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
							onPlay={startAnimation}
							onStop={stopAnimation}
							onReset={resetAnimation}
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
			</View>
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