import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { ActionProvider, useAction, useActionHandler, AppActionPayloadMap } from '../common/react/actionRegister';

// 로그인 컴포넌트
const LoginComponent: React.FC = () => {
  const action = useAction<AppActionPayloadMap>();
  const [isLoading, setIsLoading] = useState(false);

  // 로그인 핸들러 등록
  useActionHandler('user/login', async (payload, controller) => {
    console.log('자격 증명 검증 중...');
    
    if (!payload.email) {
      controller.abort('이메일이 필요합니다');
      return;
    }
    
    // payload 수정 예시
    controller.modifyPayload((p) => ({
      ...p,
      email: p.email.toLowerCase()
    }));
    
    setIsLoading(true);
    
    try {
      // 비동기 작업 시뮤레이션
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
      
      await action.dispatch('ui/show-toast', {
        type: 'error',
        message: '로그인에 실패했습니다',
        duration: 3000
      });
    } finally {
      setIsLoading(false);
    }
  }, { priority: 10, blocking: true });

  // 로그아웃 핸들러
  useActionHandler('user/logout', async (payload, controller) => {
    console.log('로그아웃 중...');
    
    await action.dispatch('ui/show-toast', {
      type: 'info',
      message: '로그아웃 되었습니다',
      duration: 2000
    });
  });

  const handleLogin = () => {
    action.dispatch('user/login', {
      email: 'user@example.com',
      password: 'password123',
      rememberMe: true
    });
  };

  const handleLogout = () => {
    action.dispatch('user/logout');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Action Register Example</Text>
      
      <TouchableOpacity 
        style={[styles.button, isLoading && styles.buttonDisabled]} 
        onPress={handleLogin}
        disabled={isLoading}
      >
        <Text style={styles.buttonText}>
          {isLoading ? '로그인 중...' : '로그인'}
        </Text>
      </TouchableOpacity>
      
      <TouchableOpacity style={styles.button} onPress={handleLogout}>
        <Text style={styles.buttonText}>로그아웃</Text>
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

// Data Fetch 컴포넌트
const DataFetchComponent: React.FC = () => {
  const action = useAction<AppActionPayloadMap>();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  // 데이터 페치 핸들러
  useActionHandler('data/fetch', async (payload, controller) => {
    console.log(`Fetching data from: ${payload.endpoint}`);
    setLoading(true);
    
    try {
      // API 호출 시뮤레이션
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const mockData = {
        endpoint: payload.endpoint,
        method: payload.method || 'GET',
        timestamp: new Date().toISOString(),
        result: 'Mock data received successfully'
      };
      
      setData(mockData);
      
      await action.dispatch('ui/show-toast', {
        type: 'success',
        message: '데이터를 성공적으로 가져왔습니다',
        duration: 2000
      });
    } catch (error) {
      controller.abort('데이터 페치 실패');
      
      await action.dispatch('ui/show-toast', {
        type: 'error',
        message: '데이터 가져오기에 실패했습니다',
        duration: 3000
      });
    } finally {
      setLoading(false);
    }
  }, { priority: 5, blocking: true });

  const handleFetchData = () => {
    action.dispatch('data/fetch', {
      endpoint: '/api/user-data',
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });
  };

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Data Fetch Example</Text>
      
      <TouchableOpacity 
        style={[styles.button, loading && styles.buttonDisabled]} 
        onPress={handleFetchData}
        disabled={loading}
      >
        <Text style={styles.buttonText}>
          {loading ? '데이터 로딩 중...' : '데이터 가져오기'}
        </Text>
      </TouchableOpacity>
      
      {data && (
        <View style={styles.dataContainer}>
          <Text style={styles.dataText}>
            Endpoint: {data.endpoint}{"\n"}
            Method: {data.method}{"\n"}
            Timestamp: {data.timestamp}{"\n"}
            Result: {data.result}
          </Text>
        </View>
      )}
    </View>
  );
};

// 메인 애플리케이션
const ActionRegisterExample: React.FC = () => {
  return (
    <ActionProvider>
      <View style={styles.app}>
        <LoginComponent />
        <DataFetchComponent />
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
  section: {
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
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
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
  dataContainer: {
    backgroundColor: '#f8f8f8',
    padding: 16,
    borderRadius: 6,
    marginTop: 16,
  },
  dataText: {
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
  },
});

export default ActionRegisterExample;