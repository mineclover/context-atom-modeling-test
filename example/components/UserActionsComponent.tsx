import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { StatusIndicator } from './pure/StatusIndicator';
import { useUserActionModule, UserActionHandlers } from '../modules/UserActionModule';
import { useViewState } from '../contexts/ViewActionContext';

// 사용자 액션 컴포넌트 - 비즈니스 로직과 순수 뷰 결합
export const UserActionsComponent: React.FC = () => {
  const { userProfile, loadingStates, appAction } = useUserActionModule();
  const viewState = useViewState();

  // 컴포넌트 상태 가져오기
  const getComponentStatus = (actionName: string) => {
    return viewState.actions.getComponentStatus(actionName);
  };

  return (
    <>
      <UserActionHandlers />
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>사용자 액션 테스트</Text>
        <Text style={styles.profileInfo}>
          현재 프로필: {userProfile.name} ({userProfile.email})
        </Text>
        
        <View style={styles.statusGrid}>
          <StatusIndicator 
            id="user-login"
            status={getComponentStatus('user/login')} 
            label="로그인" 
          />
          <StatusIndicator 
            id="user-logout"
            status={getComponentStatus('user/logout')} 
            label="로그아웃" 
          />
          <StatusIndicator 
            id="user-session"
            status={getComponentStatus('user/refresh-session')} 
            label="세션" 
          />
          <StatusIndicator 
            id="user-cache"
            status={getComponentStatus('user/clear-cache')} 
            label="캐시" 
          />
        </View>
        
        <TouchableOpacity 
          style={[styles.button, loadingStates['user/login'] && styles.buttonDisabled]} 
          onPress={() => appAction.dispatch('user/login', {
            email: 'user@example.com',
            password: 'password123',
            rememberMe: true
          })}
          disabled={loadingStates['user/login']}
        >
          <Text style={styles.buttonText}>
            {loadingStates['user/login'] ? '로그인 중...' : '로그인 테스트'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.button, loadingStates['user/logout'] && styles.buttonDisabled]} 
          onPress={() => appAction.dispatch('user/logout')}
          disabled={loadingStates['user/logout']}
        >
          <Text style={styles.buttonText}>
            {loadingStates['user/logout'] ? '로그아웃 중...' : '로그아웃 테스트'}
          </Text>
        </TouchableOpacity>

        <View style={styles.buttonRow}>
          <TouchableOpacity 
            style={[styles.button, styles.buttonSmall, loadingStates['user/refresh-session'] && styles.buttonDisabled]} 
            onPress={() => appAction.dispatch('user/refresh-session')}
            disabled={loadingStates['user/refresh-session']}
          >
            <Text style={styles.buttonText}>세션 새로고침</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.button, styles.buttonSmall, loadingStates['user/clear-cache'] && styles.buttonDisabled]} 
            onPress={() => appAction.dispatch('user/clear-cache')}
            disabled={loadingStates['user/clear-cache']}
          >
            <Text style={styles.buttonText}>캐시 클리어</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity 
          style={[styles.button, loadingStates['user/update-profile'] && styles.buttonDisabled]} 
          onPress={() => appAction.dispatch('user/update-profile', {
            userId: '123',
            data: { name: 'Jane Smith', bio: '업데이트된 프로필입니다' }
          })}
          disabled={loadingStates['user/update-profile']}
        >
          <Text style={styles.buttonText}>프로필 업데이트</Text>
        </TouchableOpacity>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
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
});