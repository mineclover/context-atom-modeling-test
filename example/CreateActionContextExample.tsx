import React, { useEffect, useRef, useState } from 'react';
import { Animated, InteractionManager, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { createActionContext } from '../common/react/actionRegister/react/ActionContext';
import { AppActionPayloadMap } from './actions';

// 타입 안전한 ActionContext 생성
const { Provider: ActionProvider, useAction, useActionHandler } = createActionContext<AppActionPayloadMap>();

// 액션 로그 타입 정의
type ActionLog = {
  id: string;
  action: string;
  type: 'user' | 'ui' | 'data';
  status: 'pending' | 'success' | 'error';
  timestamp: Date;
  message?: string;
  payload?: any;
};

// 글로벌 상태 관리를 위한 Context
const TestContext = React.createContext<{
  logs: ActionLog[];
  addLog: (log: ActionLog | Omit<ActionLog, 'id' | 'timestamp'>) => void;
  updateLog: (id: string, updates: Partial<ActionLog>) => void;
  clearLogs: () => void;
} | null>(null);

const TestProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [logs, setLogs] = useState<ActionLog[]>([]);

  const addLog = (log: ActionLog | Omit<ActionLog, 'id' | 'timestamp'>) => {
    let newLog: ActionLog;
    if ('id' in log && 'timestamp' in log) {
      newLog = log as ActionLog;
    } else {
      newLog = {
        ...log,
        id: `${Date.now()}-${Math.random()}`,
        timestamp: new Date(),
      } as ActionLog;
    }
    setLogs(prev => [newLog, ...prev].slice(0, 50)); // 최대 50개 로그 유지
  };

  const updateLog = (id: string, updates: Partial<ActionLog>) => {
    setLogs(prev => prev.map(log => 
      log.id === id ? { ...log, ...updates } : log
    ));
  };

  const clearLogs = () => setLogs([]);

  return (
    <TestContext.Provider value={{ logs, addLog, updateLog, clearLogs }}>
      {children}
    </TestContext.Provider>
  );
};

const useTestContext = () => {
  const context = React.useContext(TestContext);
  if (!context) throw new Error('useTestContext must be used within TestProvider');
  return context;
};

// 상태 인디케이터 컴포넌트
const StatusIndicator: React.FC<{ 
  status: 'idle' | 'loading' | 'success' | 'error';
  label: string;
}> = ({ status, label }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const loopAnimationRef = useRef<Animated.CompositeAnimation | null>(null);
  const pulseAnimationRef = useRef<Animated.CompositeAnimation | null>(null);

  useEffect(() => {
    // 기존 애니메이션 중단
    if (loopAnimationRef.current) {
      loopAnimationRef.current.stop();
      loopAnimationRef.current = null;
    }
    if (pulseAnimationRef.current) {
      pulseAnimationRef.current.stop();
      pulseAnimationRef.current = null;
    }

    // 애니메이션을 다음 프레임에서 실행
    requestAnimationFrame(() => {
      if (status === 'loading') {
        // 로딩 애니메이션 (무한 루프)
        const loopAnimation = Animated.loop(
          Animated.sequence([
            Animated.timing(fadeAnim, {
              toValue: 1,
              duration: 500,
              useNativeDriver: true,
            }),
            Animated.timing(fadeAnim, {
              toValue: 0.3,
              duration: 500,
              useNativeDriver: true,
            }),
          ])
        );
        
        loopAnimationRef.current = loopAnimation;
        loopAnimation.start();
      } else {
        // 페이드 애니메이션
        Animated.timing(fadeAnim, {
          toValue: status === 'idle' ? 0.3 : 1,
          duration: 300,
          useNativeDriver: true,
        }).start();
        
        // 성공/에러 시 펄스 애니메이션
        if (status === 'success' || status === 'error') {
          const pulseAnimation = Animated.sequence([
            Animated.timing(scaleAnim, {
              toValue: 1.2,
              duration: 150,
              useNativeDriver: true,
            }),
            Animated.timing(scaleAnim, {
              toValue: 1,
              duration: 150,
              useNativeDriver: true,
            }),
          ]);
          
          pulseAnimationRef.current = pulseAnimation;
          pulseAnimation.start((finished) => {
            if (finished) {
              pulseAnimationRef.current = null;
            }
          });
        }
      }
    });
  }, [status, fadeAnim, scaleAnim]);

  // 컴포넌트 언마운트 시 애니메이션 정리
  useEffect(() => {
    return () => {
      if (loopAnimationRef.current) {
        loopAnimationRef.current.stop();
        loopAnimationRef.current = null;
      }
      if (pulseAnimationRef.current) {
        pulseAnimationRef.current.stop();
        pulseAnimationRef.current = null;
      }
    };
  }, []);

  const getStatusColor = () => {
    switch (status) {
      case 'loading': return '#FF9800';
      case 'success': return '#4CAF50';
      case 'error': return '#F44336';
      default: return '#9E9E9E';
    }
  };

  const getStatusIcon = () => {
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
        styles.statusIndicator, 
        { 
          backgroundColor: getStatusColor(),
          opacity: fadeAnim,
          transform: [{ scale: scaleAnim }]
        }
      ]}
    >
      <Text style={styles.statusIcon}>{getStatusIcon()}</Text>
      <Text style={styles.statusLabel}>{label}</Text>
    </Animated.View>
  );
};

// 실시간 대시보드 컴포넌트
const ActionDashboard: React.FC = () => {
  const { logs, clearLogs } = useTestContext();
  const [stats, setStats] = useState({
    total: 0,
    success: 0,
    error: 0,
    pending: 0,
  });

  useEffect(() => {
    // 통계 계산을 다음 프레임으로 지연하여 성능 최적화
    requestAnimationFrame(() => {
      const newStats = logs.reduce((acc, log) => {
        acc.total++;
        acc[log.status]++;
        return acc;
      }, { total: 0, success: 0, error: 0, pending: 0 });
      setStats(newStats);
    });
  }, [logs]);

  return (
    <View style={styles.dashboard}>
      <View style={styles.dashboardHeader}>
        <Text style={styles.dashboardTitle}>실시간 액션 대시보드</Text>
        <TouchableOpacity style={styles.clearButton} onPress={clearLogs}>
          <Text style={styles.clearButtonText}>클리어</Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.statsContainer}>
        <View style={[styles.statCard, { backgroundColor: '#2196F3' }]}>
          <Text style={styles.statNumber}>{stats.total}</Text>
          <Text style={styles.statLabel}>총 액션</Text>
        </View>
        <View style={[styles.statCard, { backgroundColor: '#4CAF50' }]}>
          <Text style={styles.statNumber}>{stats.success}</Text>
          <Text style={styles.statLabel}>성공</Text>
        </View>
        <View style={[styles.statCard, { backgroundColor: '#F44336' }]}>
          <Text style={styles.statNumber}>{stats.error}</Text>
          <Text style={styles.statLabel}>실패</Text>
        </View>
        <View style={[styles.statCard, { backgroundColor: '#FF9800' }]}>
          <Text style={styles.statNumber}>{stats.pending}</Text>
          <Text style={styles.statLabel}>진행중</Text>
        </View>
      </View>

      <ScrollView style={styles.logContainer} showsVerticalScrollIndicator={false}>
        {logs.map((log) => {
          const borderColor = log.status === 'success' ? '#4CAF50' : 
                            log.status === 'error' ? '#F44336' : '#FF9800';
          return (
            <View key={log.id} style={[styles.logItem, { borderLeftColor: borderColor }]}>
              <View style={styles.logHeader}>
                <Text style={styles.logAction}>{log.action}</Text>
                <Text style={styles.logType}>{log.type.toUpperCase()}</Text>
                <Text style={styles.logTime}>
                  {log.timestamp.toLocaleTimeString()}
                </Text>
              </View>
              {log.message && (
                <Text style={styles.logMessage}>{log.message}</Text>
              )}
              {log.payload && (
                <Text style={styles.logPayload}>
                  {JSON.stringify(log.payload, null, 2)}
                </Text>
              )}
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
};

// 사용자 관련 컴포넌트
const UserActionsComponent: React.FC = () => {
  const action = useAction();
  const { addLog, updateLog } = useTestContext();
  const [isLoading, setIsLoading] = useState<Record<string, boolean>>({});
  const [userProfile, setUserProfile] = useState({ name: 'John Doe', email: 'john@example.com' });
  const [actionResults, setActionResults] = useState<Record<string, 'idle' | 'loading' | 'success' | 'error'>>({});

  const handleActionStart = (actionName: string, payload?: any): string => {
    const newLog: ActionLog = {
      id: `${Date.now()}-${Math.random()}`,
      timestamp: new Date(),
      action: actionName,
      type: 'user',
      status: 'pending',
      message: '액션 시작',
      payload
    };
    addLog(newLog);
    setActionResults(prev => ({ ...prev, [actionName]: 'loading' }));
    setIsLoading(prev => ({ ...prev, [actionName]: true }));
    return newLog.id;
  };

  const handleActionEnd = (actionName: string, logId: string, success: boolean, message?: string) => {
    // 상태 업데이트를 배치로 처리하여 렌더링 최적화
    requestAnimationFrame(() => {
      updateLog(logId, {
        status: success ? 'success' : 'error',
        message: message || (success ? '액션 완료' : '액션 실패')
      });
      
      setActionResults(prev => ({ ...prev, [actionName]: success ? 'success' : 'error' }));
      setIsLoading(prev => ({ ...prev, [actionName]: false }));
      
      // InteractionManager를 사용하여 상호작용이 완료된 후 상태 초기화
      const handle = InteractionManager.createInteractionHandle();
      
      // 3초 후 상태 초기화 (React Native 권장 방법)
      const timeoutId = setTimeout(() => {
        InteractionManager.clearInteractionHandle(handle);
        requestAnimationFrame(() => {
          setActionResults(prev => ({ ...prev, [actionName]: 'idle' }));
        });
      }, 3000);

      // 컴포넌트 언마운트 시 정리를 위한 반환
      return () => {
        clearTimeout(timeoutId);
        InteractionManager.clearInteractionHandle(handle);
      };
    });
  };

  // 로그인 핸들러
  useActionHandler('user/login', async (payload, controller) => {
    const logId = handleActionStart('user/login', payload);
    
    try {
      if (!payload.email || !payload.password) {
        throw new Error('이메일과 비밀번호가 필요합니다');
      }
      
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      await action.dispatch('ui/show-toast', {
        type: 'success',
        message: `로그인 성공: ${payload.email}`,
        duration: 3000
      });
      
      handleActionEnd('user/login', logId, true, `로그인 성공: ${payload.email}`);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '로그인 실패';
      handleActionEnd('user/login', logId, false, errorMessage);
      controller.abort(errorMessage);
    }
  }, { priority: 10, blocking: true });

  // 기타 핸들러들 (축약)
  useActionHandler('user/logout', async (_payload) => {
    const logId = handleActionStart('user/logout');
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      await action.dispatch('ui/show-toast', {
        type: 'info',
        message: '로그아웃 되었습니다',
        duration: 2000
      });
      handleActionEnd('user/logout', logId, true);
    } catch {
      handleActionEnd('user/logout', logId, false);
    }
  });

  useActionHandler('user/refresh-session', async (_payload) => {
    const logId = handleActionStart('user/refresh-session');
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      await action.dispatch('ui/show-toast', {
        type: 'success',
        message: '세션이 새로고침되었습니다',
        duration: 2000
      });
      handleActionEnd('user/refresh-session', logId, true);
    } catch {
      handleActionEnd('user/refresh-session', logId, false);
    }
  });

  useActionHandler('user/clear-cache', async (_payload) => {
    const logId = handleActionStart('user/clear-cache');
    try {
      await new Promise(resolve => setTimeout(resolve, 800));
      await action.dispatch('ui/show-toast', {
        type: 'info',
        message: '사용자 캐시가 클리어되었습니다',
        duration: 2000
      });
      handleActionEnd('user/clear-cache', logId, true);
    } catch {
      handleActionEnd('user/clear-cache', logId, false);
    }
  });

  useActionHandler('user/update-profile', async (payload) => {
    const logId = handleActionStart('user/update-profile', payload);
    try {
      await new Promise(resolve => setTimeout(resolve, 1200));
      setUserProfile(prev => ({ ...prev, ...payload.data }));
      await action.dispatch('ui/show-toast', {
        type: 'success',
        message: '프로필이 업데이트되었습니다',
        duration: 2500
      });
      handleActionEnd('user/update-profile', logId, true);
    } catch {
      handleActionEnd('user/update-profile', logId, false);
    }
  });

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>사용자 액션 테스트</Text>
      <Text style={styles.profileInfo}>현재 프로필: {userProfile.name} ({userProfile.email})</Text>
      
      <View style={styles.statusGrid}>
        <StatusIndicator status={actionResults['user/login'] || 'idle'} label="로그인" />
        <StatusIndicator status={actionResults['user/logout'] || 'idle'} label="로그아웃" />
        <StatusIndicator status={actionResults['user/refresh-session'] || 'idle'} label="세션" />
        <StatusIndicator status={actionResults['user/clear-cache'] || 'idle'} label="캐시" />
      </View>
      
      <TouchableOpacity 
        style={[styles.button, isLoading['user/login'] && styles.buttonDisabled]} 
        onPress={() => action.dispatch('user/login', {
          email: 'user@example.com',
          password: 'password123',
          rememberMe: true
        })}
        disabled={isLoading['user/login']}
      >
        <Text style={styles.buttonText}>
          {isLoading['user/login'] ? '로그인 중...' : '로그인 테스트'}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={[styles.button, isLoading['user/logout'] && styles.buttonDisabled]} 
        onPress={() => action.dispatch('user/logout')}
        disabled={isLoading['user/logout']}
      >
        <Text style={styles.buttonText}>
          {isLoading['user/logout'] ? '로그아웃 중...' : '로그아웃 테스트'}
        </Text>
      </TouchableOpacity>

      <View style={styles.buttonRow}>
        <TouchableOpacity 
          style={[styles.button, styles.buttonSmall, isLoading['user/refresh-session'] && styles.buttonDisabled]} 
          onPress={() => action.dispatch('user/refresh-session')}
          disabled={isLoading['user/refresh-session']}
        >
          <Text style={styles.buttonText}>세션 새로고침</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.button, styles.buttonSmall, isLoading['user/clear-cache'] && styles.buttonDisabled]} 
          onPress={() => action.dispatch('user/clear-cache')}
          disabled={isLoading['user/clear-cache']}
        >
          <Text style={styles.buttonText}>캐시 클리어</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity 
        style={[styles.button, isLoading['user/update-profile'] && styles.buttonDisabled]} 
        onPress={() => action.dispatch('user/update-profile', {
          userId: '123',
          data: { name: 'Jane Smith', bio: '업데이트된 프로필입니다' }
        })}
        disabled={isLoading['user/update-profile']}
      >
        <Text style={styles.buttonText}>프로필 업데이트</Text>
      </TouchableOpacity>
    </View>
  );
};

// UI 관련 컴포넌트 (간소화)
const UIActionsComponent: React.FC = () => {
  const action = useAction();
  const { addLog } = useTestContext();
  const [modalVisible, setModalVisible] = useState(false);
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [currentTheme, setCurrentTheme] = useState<'light' | 'dark' | 'system'>('light');

  useActionHandler('ui/show-modal', (payload) => {
    addLog({ 
      action: 'ui/show-modal', 
      type: 'ui', 
      status: 'success',
      message: '모달 표시됨',
      payload 
    });
    setModalVisible(true);
  });

  useActionHandler('ui/toggle-sidebar', (_payload) => {
    addLog({ 
      action: 'ui/toggle-sidebar', 
      type: 'ui', 
      status: 'success',
      message: '사이드바 토글됨'
    });
    setSidebarVisible(prev => !prev);
  });

  useActionHandler('ui/set-theme', (payload) => {
    addLog({ 
      action: 'ui/set-theme', 
      type: 'ui', 
      status: 'success',
      message: `테마 변경: ${payload.theme}`,
      payload 
    });
    setCurrentTheme(payload.theme);
  });

  useActionHandler('ui/show-toast', (payload) => {
    addLog({ 
      action: 'ui/show-toast', 
      type: 'ui', 
      status: 'success',
      message: `토스트 표시: ${payload.message}`,
      payload 
    });
  });

  useActionHandler('ui/hide-modal', (payload) => {
    addLog({ 
      action: 'ui/hide-modal', 
      type: 'ui', 
      status: 'success',
      message: '모달 숨김',
      payload 
    });
    setModalVisible(false);
  });

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>UI 액션 테스트</Text>
      
      <View style={styles.uiStatus}>
        <Text style={styles.statusText}>테마: {currentTheme}</Text>
        <Text style={styles.statusText}>사이드바: {sidebarVisible ? '열림 🔓' : '닫힘 🔒'}</Text>
        <Text style={styles.statusText}>모달: {modalVisible ? '표시중 👁️' : '숨김 🙈'}</Text>
      </View>

      <View style={styles.buttonRow}>
        <TouchableOpacity 
          style={[styles.button, styles.buttonSmall]} 
          onPress={() => action.dispatch('ui/show-toast', {
            type: 'success',
            message: '성공 토스트!',
            duration: 2000
          })}
        >
          <Text style={styles.buttonText}>성공 토스트</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.button, styles.buttonSmall]} 
          onPress={() => action.dispatch('ui/toggle-sidebar')}
        >
          <Text style={styles.buttonText}>사이드바 토글</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.buttonRow}>
        <TouchableOpacity 
          style={[styles.button, styles.buttonSmall]} 
          onPress={() => action.dispatch('ui/set-theme', { theme: 'dark' })}
        >
          <Text style={styles.buttonText}>다크 테마</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.button, styles.buttonSmall]} 
          onPress={() => action.dispatch('ui/show-modal', { modalId: 'test' })}
        >
          <Text style={styles.buttonText}>모달 열기</Text>
        </TouchableOpacity>
      </View>

      {modalVisible && (
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>테스트 모달 ✨</Text>
            <TouchableOpacity 
              style={styles.button} 
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.buttonText}>닫기</Text>
            </TouchableOpacity>
          </View>
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
  const slideAnim = useRef(new Animated.Value(-100)).current;
  const animationRef = useRef<Animated.CompositeAnimation | null>(null);

  useActionHandler('ui/show-toast', (payload) => {
    // 기존 애니메이션이 있다면 중단
    if (animationRef.current) {
      animationRef.current.stop();
    }

    // 상태 업데이트를 다음 프레임으로 지연
    requestAnimationFrame(() => {
      setToastMessage(payload.message);
      setToastType(payload.type);
      setToastVisible(true);
      
      // 애니메이션 시퀀스 생성 (React Native 권장 방법)
      const animationSequence = Animated.sequence([
        // 토스트 슬라이드 인
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        // 지정된 시간 동안 대기 (setTimeout 대신 Animated.delay 사용)
        Animated.delay(payload.duration || 3000),
        // 토스트 슬라이드 아웃
        Animated.timing(slideAnim, {
          toValue: -100,
          duration: 300,
          useNativeDriver: true,
        }),
      ]);

      // 애니메이션 시작 전 초기값 설정
      slideAnim.setValue(-100);
      
      // 애니메이션 참조 저장 및 시작
      animationRef.current = animationSequence;
      animationSequence.start((finished) => {
        // 애니메이션이 완전히 완료된 경우에만 토스트 숨기기
        if (finished) {
          requestAnimationFrame(() => {
            setToastVisible(false);
          });
        }
        // 애니메이션 참조 클리어
        animationRef.current = null;
      });
    });
  });

  // 컴포넌트 언마운트 시 애니메이션 정리
  useEffect(() => {
    return () => {
      if (animationRef.current) {
        animationRef.current.stop();
        animationRef.current = null;
      }
    };
  }, []);

  if (!toastVisible) return null;

  const getToastStyle = () => {
    switch (toastType) {
      case 'success': return { backgroundColor: '#4CAF50' };
      case 'error': return { backgroundColor: '#F44336' };
      case 'warning': return { backgroundColor: '#FF9800' };
      default: return { backgroundColor: '#2196F3' };
    }
  };

  return (
    <Animated.View 
      style={[
        styles.toast, 
        getToastStyle(),
        { transform: [{ translateY: slideAnim }] }
      ]}
    >
      <Text style={styles.toastText}>{toastMessage}</Text>
    </Animated.View>
  );
};

// 메인 애플리케이션
const CreateActionContextExample: React.FC = () => {
  return (
    <TestProvider>
      <ActionProvider>
        <ScrollView style={styles.app}>
          <View style={styles.header}>
            <Text style={styles.headerTitle}>🚀 ActionContext 시각적 테스트</Text>
            <Text style={styles.headerSubtitle}>실시간 모니터링 및 시각적 피드백</Text>
          </View>
          
          <ActionDashboard />
          <UserActionsComponent />
          <UIActionsComponent />
          <ToastComponent />
        </ScrollView>
      </ActionProvider>
    </TestProvider>
  );
};

const styles = StyleSheet.create({
  app: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    backgroundColor: '#6366f1',
    padding: 20,
    paddingTop: 50,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
  },
  headerSubtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    marginTop: 5,
  },
  dashboard: {
    backgroundColor: 'white',
    margin: 15,
    padding: 20,
    borderRadius: 15,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  dashboardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  dashboardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  clearButton: {
    backgroundColor: '#ef4444',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 8,
  },
  clearButtonText: {
    color: 'white',
    fontWeight: '600',
  },
  statsContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  statCard: {
    flex: 1,
    padding: 15,
    borderRadius: 12,
    marginHorizontal: 3,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  statLabel: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.9)',
    marginTop: 4,
  },
  logContainer: {
    maxHeight: 200,
  },
  logItem: {
    backgroundColor: '#f8f9fa',
    padding: 12,
    marginVertical: 4,
    borderRadius: 8,
    borderLeftWidth: 4,
  },
  logHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  logAction: {
    fontWeight: '600',
    color: '#1f2937',
    flex: 1,
  },
  logType: {
    fontSize: 10,
    backgroundColor: '#e5e7eb',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    marginHorizontal: 8,
  },
  logTime: {
    fontSize: 11,
    color: '#6b7280',
  },
  logMessage: {
    marginTop: 4,
    fontSize: 12,
    color: '#4b5563',
  },
  logPayload: {
    marginTop: 4,
    fontSize: 10,
    color: '#6b7280',
    fontFamily: 'monospace',
  },
  section: {
    backgroundColor: 'white',
    margin: 15,
    padding: 20,
    borderRadius: 15,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#1f2937',
    borderBottomWidth: 2,
    borderBottomColor: '#6366f1',
    paddingBottom: 8,
  },
  profileInfo: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 15,
    fontStyle: 'italic',
    backgroundColor: '#f3f4f6',
    padding: 10,
    borderRadius: 8,
  },
  statusGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 20,
  },
  statusIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    margin: 4,
  },
  statusIcon: {
    fontSize: 16,
    marginRight: 6,
  },
  statusLabel: {
    color: 'white',
    fontWeight: '600',
    fontSize: 12,
  },
  uiStatus: {
    backgroundColor: '#f3f4f6',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
  },
  statusText: {
    fontSize: 14,
    color: '#4b5563',
    marginBottom: 5,
  },
  button: {
    backgroundColor: '#6366f1',
    padding: 15,
    borderRadius: 10,
    marginVertical: 8,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#6366f1',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  buttonDisabled: {
    backgroundColor: '#d1d5db',
    elevation: 0,
    shadowOpacity: 0,
  },
  buttonSmall: {
    flex: 1,
    marginHorizontal: 4,
    paddingVertical: 12,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  buttonRow: {
    flexDirection: 'row',
    marginVertical: 4,
  },
  modalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 30,
    borderRadius: 20,
    width: '85%',
    alignItems: 'center',
    elevation: 10,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#1f2937',
  },
  toast: {
    position: 'absolute',
    top: 90,
    left: 20,
    right: 20,
    padding: 16,
    borderRadius: 12,
    zIndex: 1001,
    elevation: 10,
  },
  toastText: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
    fontWeight: '600',
  },
});

export default CreateActionContextExample;