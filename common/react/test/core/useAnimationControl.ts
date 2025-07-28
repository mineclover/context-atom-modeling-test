import { useState, useCallback, useRef } from 'react'
import { Animated } from 'react-native'

export type AnimationState = 'idle' | 'running' | 'paused' | 'stopped'

interface AnimationControlReturn {
  state: AnimationState
  isRunning: boolean
  isPaused: boolean
  start: () => void
  pause: () => void
  resume: () => void
  stop: () => void
  reset: () => void
}

/**
 * 애니메이션 상태를 관리하는 커스텀 훅
 * 시작, 일시정지, 재개, 정지, 리셋 기능 제공
 */
export const useAnimationControl = (
  animatedValue: Animated.Value,
  animationFactory: () => Animated.CompositeAnimation
): AnimationControlReturn => {
  const [state, setState] = useState<AnimationState>('idle')
  const animationRef = useRef<Animated.CompositeAnimation | null>(null)
  const pausedValueRef = useRef<number>(0)

  const isRunning = state === 'running'
  const isPaused = state === 'paused'

  const start = useCallback(() => {
    if (state === 'running') return

    setState('running')
    animationRef.current = animationFactory()
    animationRef.current.start((finished) => {
      if (finished) {
        setState('idle')
      }
    })
  }, [state, animationFactory])

  const pause = useCallback(() => {
    if (state !== 'running') return

    setState('paused')
    if (animationRef.current) {
      animationRef.current.stop()
      // 현재 애니메이션 값을 저장
      animatedValue.addListener(({ value }) => {
        pausedValueRef.current = value
        animatedValue.removeAllListeners()
      })
    }
  }, [state, animatedValue])

  const resume = useCallback(() => {
    if (state !== 'paused') return

    setState('running')
    // 일시정지된 지점부터 재개
    animatedValue.setValue(pausedValueRef.current)
    animationRef.current = animationFactory()
    animationRef.current.start((finished) => {
      if (finished) {
        setState('idle')
      }
    })
  }, [state, animatedValue, animationFactory])

  const stop = useCallback(() => {
    if (state === 'idle' || state === 'stopped') return

    setState('stopped')
    if (animationRef.current) {
      animationRef.current.stop()
      animationRef.current = null
    }
    animatedValue.removeAllListeners()
  }, [state, animatedValue])

  const reset = useCallback(() => {
    stop()
    animatedValue.setValue(0)
    pausedValueRef.current = 0
    setState('idle')
  }, [stop, animatedValue])

  return {
    state,
    isRunning,
    isPaused,
    start,
    pause,
    resume,
    stop,
    reset,
  }
}