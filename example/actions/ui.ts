// UI 관련 액션 정의
export interface UIActionPayloadMap {
  'ui/show-modal': {
    modalId: string;
    props?: Record<string, any>;
  };
  'ui/hide-modal': {
    modalId: string;
  };
  'ui/hide-all-modals': void;
  'ui/show-toast': {
    type: 'success' | 'error' | 'warning' | 'info';
    message: string;
    duration?: number;
    action?: {
      label: string;
      onClick: () => void;
    };
  };
  'ui/hide-all-toasts': void;
  'ui/toggle-sidebar': void;
  'ui/close-sidebar': void;
  'ui/refresh-ui': void;
  'ui/set-theme': {
    theme: 'light' | 'dark';
  };
  'ui/toggle-theme': void;
  'ui/navigate': {
    route: string;
    params?: Record<string, any>;
  };
  'ui/go-back': void;
}