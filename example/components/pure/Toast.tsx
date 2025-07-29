import React, { useEffect, useRef, useState } from 'react';
import { Animated, Text, StyleSheet } from 'react-native';
import { useAnimationAction } from '../../contexts/AnimationContext';

// Toast 타입 정의
interface ToastData {
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
  duration?: number;
}

// 순수 Toast 컴포넌트 props 타입
interface ToastProps {
  id: string;
  toastData: ToastData | null;
  visible: boolean;
}

// 순수 뷰 컴포넌트 - 애니메이션 로직 분리
export const Toast: React.FC<ToastProps> = ({ 
  id, 
  toastData, 
  visible 
}) => {
  const animationAction = useAnimationAction();
  const slideAnim = useRef(new Animated.Value(-100)).current;
  const animationRef = useRef<Animated.CompositeAnimation | null>(null);

  useEffect(() => {
    if (visible && toastData) {
      // 기존 애니메이션이 있다면 중단
      if (animationRef.current) {
        animationRef.current.stop();
      }

      // 상태 업데이트를 다음 프레임으로 지연
      requestAnimationFrame(() => {
        // 애니메이션 시작 전 초기값 설정
        slideAnim.setValue(-100);
        
        // 슬라이드 인 애니메이션만 실행
        const slideInAnimation = Animated.timing(slideAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        });

        // 애니메이션 참조 저장 및 시작
        animationRef.current = slideInAnimation;
        slideInAnimation.start((finished) => {
          if (finished) {
            animationRef.current = null;
          }
        });
      });
    } else if (!visible) {
      // visible이 false가 되면 슬라이드 아웃 애니메이션 실행
      if (animationRef.current) {
        animationRef.current.stop();
      }
      
      const slideOutAnimation = Animated.timing(slideAnim, {
        toValue: -100,
        duration: 300,
        useNativeDriver: true,
      });
      
      animationRef.current = slideOutAnimation;
      slideOutAnimation.start((finished) => {
        if (finished) {
          animationRef.current = null;
        }
      });
    }
  }, [visible, toastData, slideAnim, animationAction]);

  // 컴포넌트 언마운트 시 애니메이션 정리
  useEffect(() => {
    return () => {
      if (animationRef.current) {
        animationRef.current.stop();
        animationRef.current = null;
      }
    };
  }, []);

  if (!visible || !toastData) return null;

  const getToastStyle = () => {
    switch (toastData.type) {
      case 'success': return { backgroundColor: '#4CAF50' };
      case 'error': return { backgroundColor: '#F44336' };
      case 'warning': return { backgroundColor: '#FF9800' };
      default: return { backgroundColor: '#2196F3' };
    }
  };

  return (
    <Animated.View 
      style={[
        styles.container, 
        getToastStyle(),
        { transform: [{ translateY: slideAnim }] }
      ]}
    >
      <Text style={styles.text}>{toastData.message}</Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 90,
    left: 20,
    right: 20,
    padding: 16,
    borderRadius: 12,
    zIndex: 1001,
    elevation: 10,
  },
  text: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
    fontWeight: '600',
  },
});