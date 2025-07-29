import { useState } from 'react';
import { createActionContext } from '../../common/react/actionRegister/react/ActionContext';
import { AppActionPayloadMap } from '../actions';

// 뷰 액션 페이로드 맵 (기존 앱 액션을 확장)
export interface ViewActionPayloadMap extends AppActionPayloadMap {
  'view/update-status': {
    componentId: string;
    status: 'idle' | 'loading' | 'success' | 'error';
  };
  'view/toggle-visibility': {
    componentId: string;
    visible: boolean;
  };
  'view/set-loading': {
    componentId: string;
    loading: boolean;
  };
  'view/add-log': {
    log: {
      id?: string;
      action: string;
      type: 'user' | 'ui' | 'data';
      status: 'pending' | 'success' | 'error';
      message?: string;
      payload?: any;
      timestamp?: Date;
    };
  };
  'view/update-log': {
    id: string;
    updates: {
      status?: 'pending' | 'success' | 'error';
      message?: string;
    };
  };
  'view/clear-logs': void;
}

// createActionContext를 사용한 뷰 액션 컨텍스트 생성
const { useAction, useActionHandler } = createActionContext<ViewActionPayloadMap>();

// 로그 타입 정의
export interface ActionLog {
  id: string;
  action: string;
  type: 'user' | 'ui' | 'data';
  status: 'pending' | 'success' | 'error';
  timestamp: Date;
  message?: string;
  payload?: any;
}

// 통합된 뷰 상태 관리 hook (상태 + 핸들러)
export const useViewState = () => {
  const [componentStatuses, setComponentStatuses] = useState<Map<string, 'idle' | 'loading' | 'success' | 'error'>>(new Map());
  const [componentVisibility, setComponentVisibility] = useState<Map<string, boolean>>(new Map());
  const [loadingStates, setLoadingStates] = useState<Map<string, boolean>>(new Map());
  const [logs, setLogs] = useState<ActionLog[]>([]);

  const actions = {
    updateComponentStatus: (componentId: string, status: 'idle' | 'loading' | 'success' | 'error') => {
      setComponentStatuses(prev => new Map(prev.set(componentId, status)));
    },

    toggleComponentVisibility: (componentId: string, visible: boolean) => {
      setComponentVisibility(prev => new Map(prev.set(componentId, visible)));
    },

    setComponentLoading: (componentId: string, loading: boolean) => {
      setLoadingStates(prev => new Map(prev.set(componentId, loading)));
    },

    addLog: (log: ActionLog | Omit<ActionLog, 'id' | 'timestamp'>) => {
      const newLog: ActionLog = {
        id: 'id' in log ? log.id : `${Date.now()}-${Math.random()}`,
        timestamp: 'timestamp' in log ? log.timestamp : new Date(),
        ...log,
      };

      setLogs(prev => [newLog, ...prev].slice(0, 50)); // 최대 50개 로그 유지
    },

    updateLog: (id: string, updates: Partial<ActionLog>) => {
      setLogs(prev => prev.map(log => 
        log.id === id ? { ...log, ...updates } : log
      ));
    },

    clearLogs: () => {
      setLogs([]);
    },

    getComponentStatus: (componentId: string) => {
      return componentStatuses.get(componentId) || 'idle';
    },

    isComponentVisible: (componentId: string) => {
      return componentVisibility.get(componentId) ?? true;
    },

    isComponentLoading: (componentId: string) => {
      return loadingStates.get(componentId) ?? false;
    },
  };

  // 액션 핸들러 자동 등록 (hook 내부에서 처리)
  useActionHandler('view/update-status', (payload) => {
    actions.updateComponentStatus(payload.componentId, payload.status);
  });

  useActionHandler('view/toggle-visibility', (payload) => {
    actions.toggleComponentVisibility(payload.componentId, payload.visible);
  });

  useActionHandler('view/set-loading', (payload) => {
    actions.setComponentLoading(payload.componentId, payload.loading);
  });

  useActionHandler('view/add-log', (payload) => {
    actions.addLog(payload.log);
  });

  useActionHandler('view/update-log', (payload) => {
    actions.updateLog(payload.id, payload.updates);
  });

  useActionHandler('view/clear-logs', () => {
    actions.clearLogs();
  });

  return {
    state: {
      componentStatuses,
      componentVisibility,
      loadingStates,
      logs,
    },
    actions,
  };
};

// 뷰 액션 hooks
export const useViewActions = () => {
  const action = useAction();

  return {
    updateStatus: (componentId: string, status: 'idle' | 'loading' | 'success' | 'error') => {
      action.dispatch('view/update-status', { componentId, status });
    },

    toggleVisibility: (componentId: string, visible: boolean) => {
      action.dispatch('view/toggle-visibility', { componentId, visible });
    },

    setLoading: (componentId: string, loading: boolean) => {
      action.dispatch('view/set-loading', { componentId, loading });
    },

    addLog: (log: Omit<ActionLog, 'id' | 'timestamp'>) => {
      action.dispatch('view/add-log', { log });
    },

    updateLog: (id: string, updates: { status?: 'pending' | 'success' | 'error'; message?: string }) => {
      action.dispatch('view/update-log', { id, updates });
    },

    clearLogs: () => {
      action.dispatch('view/clear-logs');
    },
  };
};


// 뷰 액션 훅 재export
export const useViewAction = useAction;