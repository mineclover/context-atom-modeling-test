import { useEffect, useRef, useMemo } from 'react'
import { Animated, Easing } from 'react-native'

interface FloatingAnimationConfig {
  duration?: number
  translateRange?: [number, number]
  rotateRange?: [string, string]
  easing?: (value: number) => number
  autoStart?: boolean
}

interface FloatingAnimationReturn {
  animatedValue: Animated.Value
  animatedStyle: {
    transform: Array<
      | { translateY: Animated.AnimatedAddition<number> }
      | { rotate: Animated.AnimatedInterpolation<string> }
    >
  }
  startAnimation: () => void
  stopAnimation: () => void
  resetAnimation: () => void
}

/**
 * 부유하는 애니메이션을 위한 커스텀 훅
 * 메모리 안전성과 성능 최적화가 적용된 표준 패턴
 */
export const useFloatingAnimation = ({
  duration = 3000,
  translateRange = [0, -10],
  rotateRange = ['0deg', '180deg'],
  easing = Easing.inOut(Easing.sin),
  autoStart = true,
}: FloatingAnimationConfig = {}): FloatingAnimationReturn => {
  const animatedValue = useRef(new Animated.Value(0)).current
  const animationRef = useRef<Animated.CompositeAnimation | null>(null)
  const isRunningRef = useRef(false)

  // 애니메이션 시퀀스 생성 (메모이제이션)
  const createAnimationSequence = useMemo(() => {
    return () => {
      return Animated.sequence([
        Animated.timing(animatedValue, {
          toValue: 1,
          duration,
          easing,
          useNativeDriver: true,
        }),
        Animated.timing(animatedValue, {
          toValue: 0,
          duration,
          easing,
          useNativeDriver: true,
        }),
      ])
    }
  }, [animatedValue, duration, easing])

  // 애니메이션 정지 함수 (startAnimation에서 사용하기 위해 먼저 정의)
  const stopAnimation = useMemo(() => {
    return () => {
      isRunningRef.current = false
      if (animationRef.current) {
        animationRef.current.stop()
        animationRef.current = null
      }
    }
  }, [])

  // 애니메이션 시작
  const startAnimation = useMemo(() => {
    return () => {
      // 이미 실행 중이면 먼저 정지
      if (isRunningRef.current) {
        stopAnimation()
      }

      const runAnimation = () => {
        if (!isRunningRef.current) return

        animationRef.current = createAnimationSequence()
        animationRef.current.start((finished) => {
          if (finished && isRunningRef.current) {
            // 애니메이션이 완전히 끝났고 여전히 실행 중이어야 할 때만 다시 시작
            runAnimation()
          }
        })
      }

      isRunningRef.current = true
      runAnimation()
    }
  }, [createAnimationSequence, stopAnimation])

  // 애니메이션 리셋
  const resetAnimation = useMemo(() => {
    return () => {
      stopAnimation()
      animatedValue.setValue(0)
    }
  }, [animatedValue, stopAnimation])

  // 애니메이션 스타일 (메모이제이션)
  const animatedStyle = useMemo(() => {
    return {
      transform: [
        {
          translateY: animatedValue.interpolate({
            inputRange: [0, 1],
            outputRange: translateRange,
          }),
        },
        {
          rotate: animatedValue.interpolate({
            inputRange: [0, 1],
            outputRange: rotateRange,
          }),
        },
      ],
    }
  }, [animatedValue, translateRange, rotateRange])

  // 자동 시작 및 정리
  useEffect(() => {
    if (autoStart) {
      startAnimation()
    }

    // Cleanup 함수 - 메모리 누수 방지
    return () => {
      stopAnimation()
    }
  }, [autoStart, startAnimation, stopAnimation])

  return {
    animatedValue,
    animatedStyle,
    startAnimation,
    stopAnimation,
    resetAnimation,
  }
}