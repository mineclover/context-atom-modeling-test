import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { AppActionPayloadMap } from '../common/react/actionRegister';
import { createActionContext } from '../common/react/actionRegister/react/ActionContext';

// 타입 안전한 ActionContext 생성
const { Provider: ActionProvider, useAction, useActionHandler } = createActionContext<AppActionPayloadMap>();

// 사용자 관련 컴포넌트
const UserActionsComponent: React.FC = () => {
  const action = useAction();
  const [isLoading, setIsLoading] = useState<Record<string, boolean>>({});
  const [userProfile, setUserProfile] = useState({ name: 'John Doe', email: 'john@example.com' });

  // 로그인 핸들러
  useActionHandler('user/login', async (payload, controller) => {
    console.log('로그인 시도:', payload);
    
    if (!payload.email || !payload.password) {
      controller.abort('이메일과 비밀번호가 필요합니다');
      return;
    }
    
    setIsLoading(prev => ({ ...prev, login: true }));
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      await action.dispatch('ui/show-toast', {
        type: 'success',
        message: `로그인 성공: ${payload.email}`,
        duration: 3000
      });
      
      console.log(`로그인 성공: ${payload.email}`);
    } catch (error) {
      controller.abort('로그인 실패');
    } finally {
      setIsLoading(prev => ({ ...prev, login: false }));
    }
  }, { priority: 10, blocking: true });

  // 로그아웃 핸들러
  useActionHandler('user/logout', async (_, controller) => {
    console.log('로그아웃 처리');
    setIsLoading(prev => ({ ...prev, logout: true }));
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      await action.dispatch('ui/show-toast', {
        type: 'info',
        message: '로그아웃 되었습니다',
        duration: 2000
      });
    } finally {
      setIsLoading(prev => ({ ...prev, logout: false }));
    }
  });

  // 세션 새로고침 핸들러
  useActionHandler('user/refresh-session', async () => {
    console.log('세션 새로고침');
    setIsLoading(prev => ({ ...prev, refreshSession: true }));
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      await action.dispatch('ui/show-toast', {
        type: 'success',
        message: '세션이 새로고침되었습니다',
        duration: 2000
      });
    } finally {
      setIsLoading(prev => ({ ...prev, refreshSession: false }));
    }
  });

  // 캐시 클리어 핸들러
  useActionHandler('user/clear-cache', async () => {
    console.log('사용자 캐시 클리어');
    setIsLoading(prev => ({ ...prev, clearCache: true }));
    
    try {
      await new Promise(resolve => setTimeout(resolve, 800));
      
      await action.dispatch('ui/show-toast', {
        type: 'info',
        message: '사용자 캐시가 클리어되었습니다',
        duration: 2000
      });
    } finally {
      setIsLoading(prev => ({ ...prev, clearCache: false }));
    }
  });

  // 프로필 업데이트 핸들러
  useActionHandler('user/update-profile', async (payload, controller) => {
    console.log('프로필 업데이트:', payload);
    setIsLoading(prev => ({ ...prev, updateProfile: true }));
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1200));
      setUserProfile(prev => ({ ...prev, ...payload.data }));
      
      await action.dispatch('ui/show-toast', {
        type: 'success',
        message: '프로필이 업데이트되었습니다',
        duration: 2500
      });
    } catch {
      controller.abort('프로필 업데이트 실패');
    } finally {
      setIsLoading(prev => ({ ...prev, updateProfile: false }));
    }
  });

  // 비밀번호 변경 핸들러
  useActionHandler('user/change-password', async (payload, controller) => {
    console.log('비밀번호 변경 요청');
    setIsLoading(prev => ({ ...prev, changePassword: true }));
    
    try {
      if (payload.currentPassword === payload.newPassword) {
        controller.abort('새 비밀번호가 현재 비밀번호와 같습니다');
        return;
      }
      
      await new Promise(resolve => setTimeout(resolve, 1800));
      
      await action.dispatch('ui/show-toast', {
        type: 'success',
        message: '비밀번호가 변경되었습니다',
        duration: 3000
      });
    } catch {
      controller.abort('비밀번호 변경 실패');
    } finally {
      setIsLoading(prev => ({ ...prev, changePassword: false }));
    }
  });

  // 이메일 인증 핸들러
  useActionHandler('user/verify-email', async (payload, controller) => {
    console.log('이메일 인증:', payload.token);
    setIsLoading(prev => ({ ...prev, verifyEmail: true }));
    
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      await action.dispatch('ui/show-toast', {
        type: 'success',
        message: '이메일 인증이 완료되었습니다',
        duration: 3000
      });
    } catch {
      controller.abort('이메일 인증 실패');
    } finally {
      setIsLoading(prev => ({ ...prev, verifyEmail: false }));
    }
  });

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>사용자 액션 테스트</Text>
      <Text style={styles.profileInfo}>현재 프로필: {userProfile.name} ({userProfile.email})</Text>
      
      <TouchableOpacity 
        style={[styles.button, isLoading.login && styles.buttonDisabled]} 
        onPress={() => action.dispatch('user/login', {
          email: 'user@example.com',
          password: 'password123',
          rememberMe: true
        })}
        disabled={isLoading.login}
      >
        <Text style={styles.buttonText}>
          {isLoading.login ? '로그인 중...' : '로그인 테스트'}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={[styles.button, isLoading.logout && styles.buttonDisabled]} 
        onPress={() => action.dispatch('user/logout')}
        disabled={isLoading.logout}
      >
        <Text style={styles.buttonText}>
          {isLoading.logout ? '로그아웃 중...' : '로그아웃 테스트'}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={[styles.button, isLoading.refreshSession && styles.buttonDisabled]} 
        onPress={() => action.dispatch('user/refresh-session')}
        disabled={isLoading.refreshSession}
      >
        <Text style={styles.buttonText}>
          {isLoading.refreshSession ? '새로고침 중...' : '세션 새로고침'}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={[styles.button, isLoading.clearCache && styles.buttonDisabled]} 
        onPress={() => action.dispatch('user/clear-cache')}
        disabled={isLoading.clearCache}
      >
        <Text style={styles.buttonText}>
          {isLoading.clearCache ? '클리어 중...' : '캐시 클리어'}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={[styles.button, isLoading.updateProfile && styles.buttonDisabled]} 
        onPress={() => action.dispatch('user/update-profile', {
          userId: '123',
          data: { name: 'Jane Smith', bio: '업데이트된 프로필입니다' }
        })}
        disabled={isLoading.updateProfile}
      >
        <Text style={styles.buttonText}>
          {isLoading.updateProfile ? '업데이트 중...' : '프로필 업데이트'}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={[styles.button, isLoading.changePassword && styles.buttonDisabled]} 
        onPress={() => action.dispatch('user/change-password', {
          currentPassword: 'oldpass123',
          newPassword: 'newpass456'
        })}
        disabled={isLoading.changePassword}
      >
        <Text style={styles.buttonText}>
          {isLoading.changePassword ? '변경 중...' : '비밀번호 변경'}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={[styles.button, isLoading.verifyEmail && styles.buttonDisabled]} 
        onPress={() => action.dispatch('user/verify-email', {
          token: 'verification-token-123'
        })}
        disabled={isLoading.verifyEmail}
      >
        <Text style={styles.buttonText}>
          {isLoading.verifyEmail ? '인증 중...' : '이메일 인증'}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

// UI 관련 컴포넌트
const UIActionsComponent: React.FC = () => {
  const action = useAction();
  const [modalVisible, setModalVisible] = useState(false);
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [currentTheme, setCurrentTheme] = useState<'light' | 'dark' | 'system'>('light');
  const [currentRoute, setCurrentRoute] = useState('/home');

  // 모달 표시/숨기기 핸들러
  useActionHandler('ui/show-modal', (payload) => {
    console.log('모달 표시:', payload);
    setModalVisible(true);
  });

  useActionHandler('ui/hide-modal', (payload) => {
    console.log('모달 숨기기:', payload);
    setModalVisible(false);
  });

  // 사이드바 토글 핸들러
  useActionHandler('ui/toggle-sidebar', () => {
    console.log('사이드바 토글');
    setSidebarVisible(prev => !prev);
  });

  // 사이드바 닫기 핸들러
  useActionHandler('ui/close-sidebar', () => {
    console.log('사이드바 닫기');
    setSidebarVisible(false);
  });

  // 모든 모달 숨기기 핸들러
  useActionHandler('ui/hide-all-modals', () => {
    console.log('모든 모달 숨기기');
    setModalVisible(false);
  });

  // UI 새로고침 핸들러
  useActionHandler('ui/refresh-ui', () => {
    console.log('UI 새로고침');
    // UI 상태 초기화
    setModalVisible(false);
    setSidebarVisible(false);
    setCurrentTheme('light');
    setCurrentRoute('/home');
  });

  // 뒤로가기 핸들러
  useActionHandler('ui/go-back', () => {
    console.log('뒤로가기');
    setCurrentRoute('/previous');
  });

  // 테마 변경 핸들러
  useActionHandler('ui/set-theme', (payload) => {
    console.log('테마 변경:', payload.theme);
    setCurrentTheme(payload.theme);
  });

  // 네비게이션 핸들러
  useActionHandler('ui/navigate', (payload) => {
    console.log('네비게이션:', payload);
    setCurrentRoute(payload.route);
  });

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>UI 액션 테스트</Text>
      <Text style={styles.statusText}>현재 테마: {currentTheme}</Text>
      <Text style={styles.statusText}>현재 경로: {currentRoute}</Text>
      <Text style={styles.statusText}>사이드바: {sidebarVisible ? '열림' : '닫힘'}</Text>
      
      <View style={styles.buttonRow}>
        <TouchableOpacity 
          style={[styles.button, styles.buttonSmall]} 
          onPress={() => action.dispatch('ui/show-toast', {
            type: 'success',
            message: '성공 토스트입니다!',
            duration: 2000
          })}
        >
          <Text style={styles.buttonText}>성공 토스트</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.button, styles.buttonSmall]} 
          onPress={() => action.dispatch('ui/show-toast', {
            type: 'error',
            message: '에러 토스트입니다!',
            duration: 3000
          })}
        >
          <Text style={styles.buttonText}>에러 토스트</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.buttonRow}>
        <TouchableOpacity 
          style={[styles.button, styles.buttonSmall]} 
          onPress={() => action.dispatch('ui/show-toast', {
            type: 'warning',
            message: '경고 토스트입니다!',
            duration: 2500
          })}
        >
          <Text style={styles.buttonText}>경고 토스트</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.button, styles.buttonSmall]} 
          onPress={() => action.dispatch('ui/show-toast', {
            type: 'info',
            message: '정보 토스트입니다!',
            duration: 2000
          })}
        >
          <Text style={styles.buttonText}>정보 토스트</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity 
        style={styles.button} 
        onPress={() => action.dispatch('ui/show-modal', {
          modalId: 'test-modal',
          props: { title: '테스트 모달' }
        })}
      >
        <Text style={styles.buttonText}>모달 열기</Text>
      </TouchableOpacity>

      <View style={styles.buttonRow}>
        <TouchableOpacity 
          style={[styles.button, styles.buttonSmall]} 
          onPress={() => action.dispatch('ui/toggle-sidebar')}
        >
          <Text style={styles.buttonText}>사이드바 토글</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.button, styles.buttonSmall]} 
          onPress={() => action.dispatch('ui/close-sidebar')}
        >
          <Text style={styles.buttonText}>사이드바 닫기</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.buttonRow}>
        <TouchableOpacity 
          style={[styles.button, styles.buttonSmall]} 
          onPress={() => action.dispatch('ui/hide-all-modals')}
        >
          <Text style={styles.buttonText}>모든 모달 숨기기</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.button, styles.buttonSmall]} 
          onPress={() => action.dispatch('ui/refresh-ui')}
        >
          <Text style={styles.buttonText}>UI 새로고침</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity 
        style={styles.button} 
        onPress={() => action.dispatch('ui/go-back')}
      >
        <Text style={styles.buttonText}>뒤로가기</Text>
      </TouchableOpacity>

      <View style={styles.buttonRow}>
        <TouchableOpacity 
          style={[styles.button, styles.buttonSmall]} 
          onPress={() => action.dispatch('ui/set-theme', { theme: 'light' })}
        >
          <Text style={styles.buttonText}>라이트</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.button, styles.buttonSmall]} 
          onPress={() => action.dispatch('ui/set-theme', { theme: 'dark' })}
        >
          <Text style={styles.buttonText}>다크</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.button, styles.buttonSmall]} 
          onPress={() => action.dispatch('ui/set-theme', { theme: 'system' })}
        >
          <Text style={styles.buttonText}>시스템</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity 
        style={styles.button} 
        onPress={() => action.dispatch('ui/navigate', {
          route: '/profile',
          params: { userId: '123' }
        })}
      >
        <Text style={styles.buttonText}>프로필로 이동</Text>
      </TouchableOpacity>

      {/* 간단한 모달 표시 */}
      {modalVisible && (
        <View style={styles.modal}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>테스트 모달</Text>
            <TouchableOpacity 
              style={styles.button} 
              onPress={() => action.dispatch('ui/hide-modal', { modalId: 'test-modal' })}
            >
              <Text style={styles.buttonText}>모달 닫기</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* 간단한 사이드바 표시 */}
      {sidebarVisible && (
        <View style={styles.sidebar}>
          <Text style={styles.sidebarTitle}>사이드바</Text>
          <Text style={styles.sidebarText}>메뉴 항목들...</Text>
        </View>
      )}
    </View>
  );
};

// 데이터 관련 컴포넌트
const DataActionsComponent: React.FC = () => {
  const action = useAction();
  const [isLoading, setIsLoading] = useState<Record<string, boolean>>({});
  const [fetchResult, setFetchResult] = useState<string>('');
  const [cacheKeys, setCacheKeys] = useState<string[]>([]);

  // 데이터 fetch 핸들러
  useActionHandler('data/fetch', async (payload, controller) => {
    console.log('데이터 fetch:', payload);
    setIsLoading(prev => ({ ...prev, fetch: true }));
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const mockData = {
        endpoint: payload.endpoint,
        method: payload.method || 'GET',
        timestamp: new Date().toISOString(),
        data: { result: 'success', items: [1, 2, 3] }
      };
      
      setFetchResult(JSON.stringify(mockData, null, 2));
      
      await action.dispatch('ui/show-toast', {
        type: 'success',
        message: `데이터 fetch 완료: ${payload.endpoint}`,
        duration: 2000
      });
    } catch {
      controller.abort('데이터 fetch 실패');
    } finally {
      setIsLoading(prev => ({ ...prev, fetch: false }));
    }
  });

  // 캐시 무효화 핸들러
  useActionHandler('data/cache-invalidate', async (payload) => {
    console.log('캐시 무효화:', payload.keys);
    setIsLoading(prev => ({ ...prev, cacheInvalidate: true }));
    
    try {
      await new Promise(resolve => setTimeout(resolve, 800));
      setCacheKeys(payload.keys);
      
      await action.dispatch('ui/show-toast', {
        type: 'info',
        message: `${payload.keys.length}개 캐시 키 무효화 완료`,
        duration: 2000
      });
    } finally {
      setIsLoading(prev => ({ ...prev, cacheInvalidate: false }));
    }
  });

  // 배치 업데이트 핸들러
  useActionHandler('data/batch-update', async (payload, controller) => {
    console.log('배치 업데이트:', payload.updates);
    setIsLoading(prev => ({ ...prev, batchUpdate: true }));
    
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      await action.dispatch('ui/show-toast', {
        type: 'success',
        message: `${payload.updates.length}개 항목 배치 업데이트 완료`,
        duration: 2500
      });
    } catch {
      controller.abort('배치 업데이트 실패');
    } finally {
      setIsLoading(prev => ({ ...prev, batchUpdate: false }));
    }
  });

  // 동기화 핸들러
  useActionHandler('data/sync', async (payload, controller) => {
    console.log('데이터 동기화:', payload);
    setIsLoading(prev => ({ ...prev, sync: true }));
    
    try {
      const timeout = payload.options?.timeout || 3000;
      await new Promise(resolve => setTimeout(resolve, timeout));
      
      await action.dispatch('ui/show-toast', {
        type: 'success',
        message: `${payload.source} 동기화 완료`,
        duration: 2000
      });
    } catch {
      controller.abort('동기화 실패');
    } finally {
      setIsLoading(prev => ({ ...prev, sync: false }));
    }
  });

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>데이터 액션 테스트</Text>
      
      <TouchableOpacity 
        style={[styles.button, isLoading.fetch && styles.buttonDisabled]} 
        onPress={() => action.dispatch('data/fetch', {
          endpoint: '/api/users',
          method: 'GET',
          params: { page: 1, limit: 10 },
          headers: { 'Authorization': 'Bearer token' }
        })}
        disabled={isLoading.fetch}
      >
        <Text style={styles.buttonText}>
          {isLoading.fetch ? 'Fetch 중...' : 'API 데이터 Fetch'}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={[styles.button, isLoading.cacheInvalidate && styles.buttonDisabled]} 
        onPress={() => action.dispatch('data/cache-invalidate', {
          keys: ['users', 'posts', 'comments']
        })}
        disabled={isLoading.cacheInvalidate}
      >
        <Text style={styles.buttonText}>
          {isLoading.cacheInvalidate ? '무효화 중...' : '캐시 무효화'}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={[styles.button, isLoading.batchUpdate && styles.buttonDisabled]} 
        onPress={() => action.dispatch('data/batch-update', {
          updates: [
            { id: '1', changes: { name: 'John Updated', status: 'active' } },
            { id: '2', changes: { name: 'Jane Updated', status: 'inactive' } },
            { id: '3', changes: { name: 'Bob Updated', status: 'pending' } }
          ]
        })}
        disabled={isLoading.batchUpdate}
      >
        <Text style={styles.buttonText}>
          {isLoading.batchUpdate ? '업데이트 중...' : '배치 업데이트'}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={[styles.button, isLoading.sync && styles.buttonDisabled]} 
        onPress={() => action.dispatch('data/sync', {
          source: 'remote-server',
          options: { force: true, timeout: 2000 }
        })}
        disabled={isLoading.sync}
      >
        <Text style={styles.buttonText}>
          {isLoading.sync ? '동기화 중...' : '데이터 동기화'}
        </Text>
      </TouchableOpacity>

      {fetchResult && (
        <View style={styles.resultContainer}>
          <Text style={styles.resultTitle}>마지막 Fetch 결과:</Text>
          <ScrollView style={styles.resultScroll}>
            <Text style={styles.resultText}>{fetchResult}</Text>
          </ScrollView>
        </View>
      )}

      {cacheKeys.length > 0 && (
        <View style={styles.statusContainer}>
          <Text style={styles.statusTitle}>무효화된 캐시 키:</Text>
          <Text style={styles.statusText}>{cacheKeys.join(', ')}</Text>
        </View>
      )}
    </View>
  );
};

// Toast 컴포넌트
const ToastComponent: React.FC = () => {
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState<'success' | 'error' | 'warning' | 'info'>('info');

  useActionHandler('ui/show-toast', (payload) => {
    setToastMessage(payload.message);
    setToastType(payload.type);
    setToastVisible(true);
    
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
      <ScrollView style={styles.app}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>createActionContext 전체 테스트</Text>
          <Text style={styles.headerSubtitle}>모든 액션 타입들의 시나리오 테스트</Text>
        </View>
        
        <UserActionsComponent />
        <UIActionsComponent />
        <DataActionsComponent />
        <ToastComponent />
      </ScrollView>
    </ActionProvider>
  );
};

const styles = StyleSheet.create({
  app: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#007AFF',
    padding: 20,
    paddingTop: 50,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
  },
  headerSubtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
    marginTop: 5,
  },
  section: {
    backgroundColor: 'white',
    margin: 10,
    padding: 20,
    borderRadius: 12,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
    borderBottomWidth: 2,
    borderBottomColor: '#007AFF',
    paddingBottom: 5,
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 12,
    borderRadius: 8,
    marginVertical: 6,
    alignItems: 'center',
  },
  buttonDisabled: {
    backgroundColor: '#ccc',
  },
  buttonSmall: {
    flex: 1,
    marginHorizontal: 3,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  buttonRow: {
    flexDirection: 'row',
    marginVertical: 6,
  },
  profileInfo: {
    fontSize: 14,
    color: '#666',
    marginBottom: 10,
    fontStyle: 'italic',
  },
  statusText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  statusContainer: {
    backgroundColor: '#f8f9fa',
    padding: 10,
    borderRadius: 6,
    marginTop: 10,
  },
  statusTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#495057',
    marginBottom: 5,
  },
  resultContainer: {
    backgroundColor: '#f8f9fa',
    padding: 10,
    borderRadius: 6,
    marginTop: 10,
    maxHeight: 200,
  },
  resultTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#495057',
    marginBottom: 5,
  },
  resultScroll: {
    maxHeight: 150,
  },
  resultText: {
    fontSize: 12,
    color: '#495057',
    fontFamily: 'monospace',
  },
  modal: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 12,
    width: '80%',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
  },
  sidebar: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 200,
    backgroundColor: '#343a40',
    padding: 20,
    zIndex: 999,
  },
  sidebarTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  sidebarText: {
    color: '#adb5bd',
    fontSize: 14,
  },
  toast: {
    position: 'absolute',
    top: 80,
    left: 20,
    right: 20,
    padding: 16,
    borderRadius: 8,
    zIndex: 1001,
  },
  toastText: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
    fontWeight: '500',
  },
});

export default CreateActionContextExample;