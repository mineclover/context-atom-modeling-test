import React, { useState } from 'react';
import { InteractionManager } from 'react-native';
import { useViewActions } from '../contexts/ViewActionContext';
import { createActionContext } from '@context-action/react';
import { AppActionPayloadMap } from '../actions';

// createActionContext를 사용한 사용자 액션 컨텍스트 생성
const { useActionHandler, useAction } = createActionContext<AppActionPayloadMap>();

// 사용자 프로필 데이터 타입
interface UserProfile {
  name: string;
  email: string;
  avatar?: string;
  bio?: string;
}

// 사용자 액션 모듈 훅
export const useUserActionModule = () => {
  const viewActions = useViewActions();
  const appAction = useAction();
  const [userProfile, setUserProfile] = useState<UserProfile>({ 
    name: 'John Doe', 
    email: 'john@example.com' 
  });
  const [loadingStates, setLoadingStates] = useState<Record<string, boolean>>({});

  // 액션 시작 로깅 헬퍼
  const handleActionStart = (actionName: string, payload?: any): string => {
    const logId = `${Date.now()}-${Math.random()}`;
    
    viewActions.addLog({
      action: actionName,
      type: 'user',
      status: 'pending',
      message: '액션 시작',
      payload
    });
    
    viewActions.updateStatus(actionName, 'loading');
    
    setLoadingStates(prev => ({ ...prev, [actionName]: true }));
    return logId;
  };

  // 액션 완료 로깅 헬퍼
  const handleActionEnd = (actionName: string, logId: string, success: boolean, message?: string) => {
    // 상태 업데이트를 배치로 처리하여 렌더링 최적화
    requestAnimationFrame(() => {
      viewActions.updateLog(logId, {
        status: success ? 'success' : 'error',
        message: message || (success ? '액션 완료' : '액션 실패')
      });
      
      viewActions.updateStatus(actionName, success ? 'success' : 'error');
      
      setLoadingStates(prev => ({ ...prev, [actionName]: false }));
      
      // InteractionManager를 사용하여 상호작용이 완료된 후 상태 초기화
      const handle = InteractionManager.createInteractionHandle();
      
      // 3초 후 상태 초기화
      const timeoutId = setTimeout(() => {
        InteractionManager.clearInteractionHandle(handle);
        requestAnimationFrame(() => {
          viewActions.updateStatus(actionName, 'idle');
        });
      }, 3000);

      // 정리 함수 반환
      return () => {
        clearTimeout(timeoutId);
        InteractionManager.clearInteractionHandle(handle);
      };
    });
  };

  return {
    userProfile,
    loadingStates,
    handleActionStart,
    handleActionEnd,
    setUserProfile,
    appAction,
  };
};

// 사용자 액션 핸들러 컴포넌트
export const UserActionHandlers: React.FC = () => {
  const { handleActionStart, handleActionEnd } = useUserActionModule();
  const appAction = useAction();

  // 로그인 핸들러
  useActionHandler('user/login', async (payload, controller) => {
    const logId = handleActionStart('user/login', payload);
    
    try {
      if (!payload.email || !payload.password) {
        throw new Error('이메일과 비밀번호가 필요합니다');
      }
      
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      await appAction.dispatch('ui/show-toast', {
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

  // 로그아웃 핸들러
  useActionHandler('user/logout', async (_payload) => {
    const logId = handleActionStart('user/logout');
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      await appAction.dispatch('ui/show-toast', {
        type: 'info',
        message: '로그아웃 되었습니다',
        duration: 2000
      });
      handleActionEnd('user/logout', logId, true);
    } catch {
      handleActionEnd('user/logout', logId, false);
    }
  });

  // 세션 새로고침 핸들러
  useActionHandler('user/refresh-session', async (_payload) => {
    const logId = handleActionStart('user/refresh-session');
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      await appAction.dispatch('ui/show-toast', {
        type: 'success',
        message: '세션이 새로고침되었습니다',
        duration: 2000
      });
      handleActionEnd('user/refresh-session', logId, true);
    } catch {
      handleActionEnd('user/refresh-session', logId, false);
    }
  });

  // 캐시 클리어 핸들러
  useActionHandler('user/clear-cache', async (_payload) => {
    const logId = handleActionStart('user/clear-cache');
    try {
      await new Promise(resolve => setTimeout(resolve, 800));
      await appAction.dispatch('ui/show-toast', {
        type: 'info',
        message: '사용자 캐시가 클리어되었습니다',
        duration: 2000
      });
      handleActionEnd('user/clear-cache', logId, true);
    } catch {
      handleActionEnd('user/clear-cache', logId, false);
    }
  });

  // 프로필 업데이트 핸들러
  useActionHandler('user/update-profile', async (payload) => {
    const logId = handleActionStart('user/update-profile', payload);
    try {
      await new Promise(resolve => setTimeout(resolve, 1200));
      // 여기서 실제로는 상태 업데이트 로직이 필요하지만, 
      // 데모에서는 토스트만 표시
      await appAction.dispatch('ui/show-toast', {
        type: 'success',
        message: '프로필이 업데이트되었습니다',
        duration: 2500
      });
      handleActionEnd('user/update-profile', logId, true);
    } catch {
      handleActionEnd('user/update-profile', logId, false);
    }
  });

  return null;
};