import React, { useState } from 'react';
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

// UI 액션 핸들러 컴포넌트 (로그만 처리)
export const UIActionHandlers: React.FC = () => {
  // 단순히 null을 반환 - 실제 핸들러는 UIActionsComponent에서 처리
  return null;
};