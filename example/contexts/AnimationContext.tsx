import { useRef } from 'react';
import { Animated } from 'react-native';
import { createActionContext } from '@context-action/react';

// 애니메이션 액션 페이로드 맵
export interface AnimationActionPayloadMap {
  'animation/fade': {
    id: string;
    toValue: number;
    duration?: number;
    useNativeDriver?: boolean;
  };
  'animation/scale': {
    id: string;
    toValue: number;
    duration?: number;
    useNativeDriver?: boolean;
  };
  'animation/slide': {
    id: string;
    toValue: number;
    duration?: number;
    useNativeDriver?: boolean;
  };
  'animation/loop': {
    id: string;
    sequence: Array<{
      type: 'fade' | 'scale' | 'slide';
      toValue: number;
      duration: number;
    }>;
  };
  'animation/pulse': {
    id: string;
    scale?: number;
    duration?: number;
  };
  'animation/stop': {
    id: string;
  };
  'animation/stop-all': void;
}

// createActionContext를 사용한 애니메이션 액션 시스템
const { useAction, useActionHandler } = createActionContext<AnimationActionPayloadMap>();

// 애니메이션 상태 관리 hook
export const useAnimationState = () => {
  const fadeAnims = useRef<Map<string, Animated.Value>>(new Map());
  const scaleAnims = useRef<Map<string, Animated.Value>>(new Map());
  const slideAnims = useRef<Map<string, Animated.Value>>(new Map());
  const loopAnimations = useRef<Map<string, Animated.CompositeAnimation>>(new Map());
  const pulseAnimations = useRef<Map<string, Animated.CompositeAnimation>>(new Map());

  const actions = {
    createFadeAnim: (id: string, initialValue = 0) => {
      let anim = fadeAnims.current.get(id);
      if (!anim) {
        anim = new Animated.Value(initialValue);
        fadeAnims.current.set(id, anim);
      }
      return anim;
    },

    createScaleAnim: (id: string, initialValue = 1) => {
      let anim = scaleAnims.current.get(id);
      if (!anim) {
        anim = new Animated.Value(initialValue);
        scaleAnims.current.set(id, anim);
      }
      return anim;
    },

    createSlideAnim: (id: string, initialValue = 0) => {
      let anim = slideAnims.current.get(id);
      if (!anim) {
        anim = new Animated.Value(initialValue);
        slideAnims.current.set(id, anim);
      }
      return anim;
    },

    startLoopAnimation: (id: string, animation: Animated.CompositeAnimation) => {
      // 기존 애니메이션 중단
      const existingAnim = loopAnimations.current.get(id);
      if (existingAnim) {
        existingAnim.stop();
      }
      
      loopAnimations.current.set(id, animation);
      animation.start();
    },

    startPulseAnimation: (id: string, animation: Animated.CompositeAnimation) => {
      // 기존 애니메이션 중단
      const existingAnim = pulseAnimations.current.get(id);
      if (existingAnim) {
        existingAnim.stop();
      }
      
      pulseAnimations.current.set(id, animation);
      animation.start((finished) => {
        if (finished) {
          pulseAnimations.current.delete(id);
        }
      });
    },

    stopAnimation: (id: string) => {
      const loopAnim = loopAnimations.current.get(id);
      const pulseAnim = pulseAnimations.current.get(id);
      
      if (loopAnim) {
        loopAnim.stop();
        loopAnimations.current.delete(id);
      }
      
      if (pulseAnim) {
        pulseAnim.stop();
        pulseAnimations.current.delete(id);
      }
    },

    stopAllAnimations: () => {
      loopAnimations.current.forEach(anim => anim.stop());
      pulseAnimations.current.forEach(anim => anim.stop());
      loopAnimations.current.clear();
      pulseAnimations.current.clear();
    },

    cleanup: () => {
      actions.stopAllAnimations();
      fadeAnims.current.clear();
      scaleAnims.current.clear();
      slideAnims.current.clear();
    }
  };

  return { actions };
};

// 애니메이션 액션 핸들러 설정 hook
export const useAnimationHandlers = () => {
  const { actions } = useAnimationState();

  // 페이드 애니메이션 핸들러
  useActionHandler('animation/fade', (payload) => {
    const anim = actions.createFadeAnim(payload.id);
    Animated.timing(anim, {
      toValue: payload.toValue,
      duration: payload.duration || 300,
      useNativeDriver: payload.useNativeDriver ?? true,
    }).start();
  });

  // 스케일 애니메이션 핸들러
  useActionHandler('animation/scale', (payload) => {
    const anim = actions.createScaleAnim(payload.id);
    Animated.timing(anim, {
      toValue: payload.toValue,
      duration: payload.duration || 300,
      useNativeDriver: payload.useNativeDriver ?? true,
    }).start();
  });

  // 슬라이드 애니메이션 핸들러
  useActionHandler('animation/slide', (payload) => {
    const anim = actions.createSlideAnim(payload.id);
    Animated.timing(anim, {
      toValue: payload.toValue,
      duration: payload.duration || 300,
      useNativeDriver: payload.useNativeDriver ?? true,
    }).start();
  });

  // 루프 애니메이션 핸들러
  useActionHandler('animation/loop', (payload) => {
    const animations = payload.sequence.map(step => {
      let anim: Animated.Value;
      
      switch (step.type) {
        case 'fade':
          anim = actions.createFadeAnim(payload.id);
          break;
        case 'scale':
          anim = actions.createScaleAnim(payload.id);
          break;
        case 'slide':
          anim = actions.createSlideAnim(payload.id);
          break;
        default:
          throw new Error(`Unknown animation type: ${step.type}`);
      }

      return Animated.timing(anim, {
        toValue: step.toValue,
        duration: step.duration,
        useNativeDriver: true,
      });
    });

    const loopAnimation = Animated.loop(Animated.sequence(animations));
    actions.startLoopAnimation(payload.id, loopAnimation);
  });

  // 펄스 애니메이션 핸들러
  useActionHandler('animation/pulse', (payload) => {
    const anim = actions.createScaleAnim(payload.id);
    const pulseAnimation = Animated.sequence([
      Animated.timing(anim, {
        toValue: payload.scale || 1.2,
        duration: payload.duration || 150,
        useNativeDriver: true,
      }),
      Animated.timing(anim, {
        toValue: 1,
        duration: payload.duration || 150,
        useNativeDriver: true,
      }),
    ]);

    actions.startPulseAnimation(payload.id, pulseAnimation);
  });

  // 애니메이션 중단 핸들러
  useActionHandler('animation/stop', (payload) => {
    actions.stopAnimation(payload.id);
  });

  // 모든 애니메이션 중단 핸들러
  useActionHandler('animation/stop-all', () => {
    actions.stopAllAnimations();
  });

  return { actions };
};

// 애니메이션 액션 훅 재export
export const useAnimationAction = useAction;