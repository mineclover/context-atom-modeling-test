import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { createActionContext } from '../common/react/actionRegister/react/ActionContext';
import { AppActionPayloadMap } from '../common/react/actionRegister';

// 타입 안전한 ActionContext 생성
const { Provider: ActionProvider, useAction, useActionHandler } = createActionContext<AppActionPayloadMap>();

// 로그인 컴포넌트
const LoginComponent: React.FC = () => {
  const action = useAction();
  const [isLoading, setIsLoading] = useState(false);

  // 로그인 핸들러 등록
  useActionHandler('user/login', async (payload, controller) => {
    console.log('자격 증명 검증 중...');
    
    if (!payload.email) {
      controller.abort('이메일이 필요합니다');
      return;
    }
    
    setIsLoading(true);
    
    try {
      // 비동기 작업 시뮬레이션
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // 성공 토스트 표시
      await action.dispatch('ui/show-toast', {
        type: 'success',
        message: '로그인 성공!',
        duration: 3000
      });
      
      console.log(`로그인 성공: ${payload.email}`);
    } catch (error) {
      controller.abort('로그인 실패');
    } finally {
      setIsLoading(false);
    }
  }, { priority: 10, blocking: true });

  const handleLogin = () => {
    action.dispatch('user/login', {
      email: 'user@example.com',
      password: 'password123',
      rememberMe: true
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>createActionContext Example</Text>
      
      <TouchableOpacity 
        style={[styles.button, isLoading && styles.buttonDisabled]} 
        onPress={handleLogin}
        disabled={isLoading}
      >
        <Text style={styles.buttonText}>
          {isLoading ? '로그인 중...' : '로그인'}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

// Toast 컴포넌트
const ToastComponent: React.FC = () => {
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState<'success' | 'error' | 'warning' | 'info'>('info');

  // 토스트 표시 핸들러
  useActionHandler('ui/show-toast', (payload) => {
    setToastMessage(payload.message);
    setToastType(payload.type);
    setToastVisible(true);
    
    // 지정된 시간 후 숨기기
    setTimeout(() => {
      setToastVisible(false);
    }, payload.duration || 3000);
  });

  if (!toastVisible) return null;

  const getToastStyle = () => {
    switch (toastType) {
      case 'success':
        return { backgroundColor: '#4CAF50' };
      case 'error':
        return { backgroundColor: '#F44336' };
      case 'warning':
        return { backgroundColor: '#FF9800' };
      case 'info':
      default:
        return { backgroundColor: '#2196F3' };
    }
  };

  return (
    <View style={[styles.toast, getToastStyle()]}>
      <Text style={styles.toastText}>{toastMessage}</Text>
    </View>
  );
};

// 메인 애플리케이션
const CreateActionContextExample: React.FC = () => {
  return (
    <ActionProvider>
      <View style={styles.app}>
        <LoginComponent />
        <ToastComponent />
      </View>
    </ActionProvider>
  );
};

const styles = StyleSheet.create({
  app: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  container: {
    padding: 20,
    backgroundColor: 'white',
    margin: 10,
    borderRadius: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#333',
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 12,
    borderRadius: 6,
    marginVertical: 8,
    alignItems: 'center',
  },
  buttonDisabled: {
    backgroundColor: '#ccc',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  toast: {
    position: 'absolute',
    top: 50,
    left: 20,
    right: 20,
    padding: 16,
    borderRadius: 8,
    zIndex: 1000,
  },
  toastText: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
    fontWeight: '500',
  },
});

export default CreateActionContextExample;