// UI 관련 액션 정의
export interface UIActionPayloadMap {
  'ui/show-modal': {
    modalId: string;
    props?: Record<string, any>;
  };
  'ui/hide-modal': {
    modalId: string;
  };
  'ui/show-toast': {
    type: 'success' | 'error' | 'warning' | 'info';
    message: string;
    duration?: number;
    action?: {
      label: string;
      onClick: () => void;
    };
  };
  'ui/toggle-sidebar': void;
  'ui/set-theme': {
    theme: 'light' | 'dark' | 'system';
  };
  'ui/navigate': {
    route: string;
    params?: Record<string, any>;
  };
}