import React, { useEffect } from 'react';
import { Animated, Text, StyleSheet } from 'react-native';
import { useAnimationState, useAnimationAction } from '../../contexts/AnimationContext';

// 순수 StatusIndicator 컴포넌트 props 타입
interface StatusIndicatorProps {
  id: string; // 애니메이션 식별자
  status: 'idle' | 'loading' | 'success' | 'error';
  label: string;
}

// 순수 뷰 컴포넌트 - 애니메이션 로직 분리
export const StatusIndicator: React.FC<StatusIndicatorProps> = ({ 
  id, 
  status, 
  label 
}) => {
  const { actions } = useAnimationState();
  const animationAction = useAnimationAction();

  // 애니메이션 값들 가져오기
  const fadeAnim = actions.createFadeAnim(`${id}-fade`);
  const scaleAnim = actions.createScaleAnim(`${id}-scale`);

  useEffect(() => {
    // 기존 애니메이션 중단
    animationAction.dispatch('animation/stop', { id: `${id}-loop` });
    animationAction.dispatch('animation/stop', { id: `${id}-pulse` });

    requestAnimationFrame(() => {
      if (status === 'loading') {
        // 로딩 애니메이션 (무한 루프)
        animationAction.dispatch('animation/loop', {
          id: `${id}-loop`,
          sequence: [
            { type: 'fade', toValue: 1, duration: 500 },
            { type: 'fade', toValue: 0.3, duration: 500 },
          ]
        });
      } else {
        // 페이드 애니메이션
        animationAction.dispatch('animation/fade', {
          id: `${id}-fade`,
          toValue: status === 'idle' ? 0.3 : 1,
          duration: 300,
        });
        
        // 성공/에러 시 펄스 애니메이션
        if (status === 'success' || status === 'error') {
          animationAction.dispatch('animation/pulse', {
            id: `${id}-pulse`,
            scale: 1.2,
            duration: 150,
          });
        }
      }
    });
  }, [status, id, animationAction]);

  // 컴포넌트 언마운트 시 애니메이션 정리
  useEffect(() => {
    return () => {
      animationAction.dispatch('animation/stop', { id: `${id}-loop` });
      animationAction.dispatch('animation/stop', { id: `${id}-pulse` });
    };
  }, [id, animationAction]);

  const getStatusColor = (): string => {
    switch (status) {
      case 'loading': return '#FF9800';
      case 'success': return '#4CAF50';
      case 'error': return '#F44336';
      default: return '#9E9E9E';
    }
  };

  const getStatusIcon = (): string => {
    switch (status) {
      case 'loading': return '⏳';
      case 'success': return '✅';
      case 'error': return '❌';
      default: return '⚪';
    }
  };

  return (
    <Animated.View 
      style={[
        styles.container, 
        { 
          backgroundColor: getStatusColor(),
          opacity: fadeAnim,
          transform: [{ scale: scaleAnim }]
        }
      ]}
    >
      <Text style={styles.icon}>{getStatusIcon()}</Text>
      <Text style={styles.label}>{label}</Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    margin: 4,
  },
  icon: {
    fontSize: 16,
    marginRight: 6,
  },
  label: {
    color: 'white',
    fontWeight: '600',
    fontSize: 12,
  },
});