import React, { useState } from 'react';
import { useViewActions } from '../contexts/ViewActionContext';
import { createActionContext } from '../../common/react/actionRegister/react/ActionContext';
import { AppActionPayloadMap } from '../actions';

// createActionContext를 사용한 UI 액션 컨텍스트 생성
const { useActionHandler } = createActionContext<AppActionPayloadMap>();

// UI 상태 타입
interface UIState {
  modalVisible: boolean;
  sidebarVisible: boolean;
  currentTheme: 'light' | 'dark' | 'system';
  toastData: {
    type: 'success' | 'error' | 'warning' | 'info';
    message: string;
    duration?: number;
  } | null;
  toastVisible: boolean;
}

// UI 액션 모듈 훅
export const useUIActionModule = () => {
  const viewActions = useViewActions();
  const [uiState, setUIState] = useState<UIState>({
    modalVisible: false,
    sidebarVisible: false,
    currentTheme: 'light',
    toastData: null,
    toastVisible: false,
  });

  const actions = {
    setModalVisible: (visible: boolean) => {
      setUIState(prev => ({ ...prev, modalVisible: visible }));
    },
    
    setSidebarVisible: (visible: boolean) => {
      setUIState(prev => ({ ...prev, sidebarVisible: visible }));
    },
    
    setTheme: (theme: 'light' | 'dark' | 'system') => {
      setUIState(prev => ({ ...prev, currentTheme: theme }));
    },
    
    showToast: (toastData: UIState['toastData']) => {
      setUIState(prev => ({ ...prev, toastData, toastVisible: true }));
    },
    
    hideToast: () => {
      setUIState(prev => ({ ...prev, toastVisible: false }));
    },
  };

  return {
    uiState,
    actions,
  };
};

// UI 액션 핸들러 컴포넌트
export const UIActionHandlers: React.FC = () => {
  const viewActions = useViewActions();

  // 모달 표시 핸들러
  useActionHandler('ui/show-modal', (payload) => {
    viewActions.addLog({ 
      action: 'ui/show-modal', 
      type: 'ui', 
      status: 'success',
      message: '모달 표시됨',
      payload 
    });
    
    // 실제 모달 상태 업데이트는 부모 컴포넌트에서 처리
  });

  // 사이드바 토글 핸들러
  useActionHandler('ui/toggle-sidebar', (_payload) => {
    viewActions.addLog({ 
      action: 'ui/toggle-sidebar', 
      type: 'ui', 
      status: 'success',
      message: '사이드바 토글됨'
    });
    
    // 실제 사이드바 상태 업데이트는 부모 컴포넌트에서 처리
  });

  // 테마 설정 핸들러
  useActionHandler('ui/set-theme', (payload) => {
    viewActions.addLog({ 
      action: 'ui/set-theme', 
      type: 'ui', 
      status: 'success',
      message: `테마 변경: ${payload.theme}`,
      payload 
    });
    
    // 실제 테마 상태 업데이트는 부모 컴포넌트에서 처리
  });

  // 토스트 표시 핸들러
  useActionHandler('ui/show-toast', (payload) => {
    viewActions.addLog({ 
      action: 'ui/show-toast', 
      type: 'ui', 
      status: 'success',
      message: `토스트 표시: ${payload.message}`,
      payload 
    });
    
    // 실제 토스트 상태 업데이트는 부모 컴포넌트에서 처리
  });

  // 모달 숨김 핸들러
  useActionHandler('ui/hide-modal', (payload) => {
    viewActions.addLog({ 
      action: 'ui/hide-modal', 
      type: 'ui', 
      status: 'success',
      message: '모달 숨김',
      payload 
    });
    
    // 실제 모달 상태 업데이트는 부모 컴포넌트에서 처리
  });

  return null;
};