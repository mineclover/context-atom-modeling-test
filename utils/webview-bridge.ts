/**
 * WebView Bridge Protocol
 * 네이티브와 웹뷰 간 표준화된 통신 프로토콜
 */

// 메시지 타입 정의
export enum MessageType {
  // 네이티브 → 웹뷰
  NATIVE_TO_WEB = 'NATIVE_TO_WEB',
  WEB_EXECUTE = 'WEB_EXECUTE',
  WEB_STYLE = 'WEB_STYLE',
  
  // 웹뷰 → 네이티브
  WEB_TO_NATIVE = 'WEB_TO_NATIVE',
  WEB_EVENT = 'WEB_EVENT',
  WEB_ERROR = 'WEB_ERROR',
  WEB_LOG = 'WEB_LOG',
}

// 메시지 인터페이스
export interface BridgeMessage {
  type: MessageType;
  action: string;
  payload: any;
  timestamp: string;
  id?: string;
}

// 네이티브 → 웹뷰 메시지 생성
export const createNativeMessage = (
  action: string,
  payload: any,
  type: MessageType = MessageType.NATIVE_TO_WEB
): BridgeMessage => ({
  type,
  action,
  payload,
  timestamp: new Date().toISOString(),
  id: `native_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`,
});

// 웹뷰 → 네이티브 메시지 파싱
export const parseWebMessage = (data: string): BridgeMessage | null => {
  try {
    const parsed = JSON.parse(data);
    if (parsed.type && parsed.action) {
      return parsed as BridgeMessage;
    }
    // 레거시 메시지 포맷 지원
    return {
      type: MessageType.WEB_TO_NATIVE,
      action: 'legacy',
      payload: parsed,
      timestamp: new Date().toISOString(),
    };
  } catch (error) {
    console.error('Failed to parse web message:', error);
    return null;
  }
};

// JavaScript 코드 생성 함수
export const generateJS = {
  // 메시지 표시
  showMessage: (message: string, duration: number = 3000): string => `
    (function() {
      const messageDiv = document.createElement('div');
      messageDiv.style.cssText = 'position: fixed; top: 10px; right: 10px; background: #007AFF; color: white; padding: 10px 15px; border-radius: 5px; z-index: 9999; font-size: 14px; box-shadow: 0 2px 5px rgba(0,0,0,0.2); max-width: 300px; word-wrap: break-word;';
      messageDiv.textContent = '${message.replace(/'/g, "\\'")}';
      document.body.appendChild(messageDiv);
      
      setTimeout(() => {
        messageDiv.style.transition = 'opacity 0.3s';
        messageDiv.style.opacity = '0';
        setTimeout(() => messageDiv.remove(), 300);
      }, ${duration});
    })();
    true;
  `,

  // 스타일 변경
  setStyle: (selector: string, styles: Record<string, string>): string => `
    (function() {
      const elements = document.querySelectorAll('${selector}');
      const styleString = '${Object.entries(styles).map(([k, v]) => `${k}: ${v}`).join('; ')}';
      elements.forEach(el => {
        el.style.cssText += ';' + styleString;
      });
    })();
    true;
  `,

  // 이벤트 리스너 추가
  addEventListener: (selector: string, event: string, messageAction: string): string => `
    (function() {
      const elements = document.querySelectorAll('${selector}');
      elements.forEach(el => {
        el.addEventListener('${event}', (e) => {
          window.sendToNative({
            type: '${MessageType.WEB_EVENT}',
            action: '${messageAction}',
            payload: {
              selector: '${selector}',
              event: '${event}',
              target: e.target.tagName,
              value: e.target.value || e.target.textContent
            }
          });
        });
      });
    })();
    true;
  `,

  // 콘솔 로그 전송
  captureConsole: (): string => `
    (function() {
      const originalLog = console.log;
      const originalError = console.error;
      const originalWarn = console.warn;
      
      console.log = function(...args) {
        originalLog.apply(console, args);
        window.sendToNative({
          type: '${MessageType.WEB_LOG}',
          action: 'console.log',
          payload: args.map(arg => String(arg)).join(' ')
        });
      };
      
      console.error = function(...args) {
        originalError.apply(console, args);
        window.sendToNative({
          type: '${MessageType.WEB_ERROR}',
          action: 'console.error',
          payload: args.map(arg => String(arg)).join(' ')
        });
      };
      
      console.warn = function(...args) {
        originalWarn.apply(console, args);
        window.sendToNative({
          type: '${MessageType.WEB_LOG}',
          action: 'console.warn',
          payload: args.map(arg => String(arg)).join(' ')
        });
      };
    })();
    true;
  `,
};

// 웹뷰 초기화 스크립트
export const webViewInitScript = `
  // WebView Bridge 초기화
  window.WebViewBridge = {
    // 네이티브로 메시지 전송
    sendToNative: function(message) {
      if (window.ReactNativeWebView) {
        const bridgeMessage = {
          type: message.type || '${MessageType.WEB_TO_NATIVE}',
          action: message.action || 'unknown',
          payload: message.payload || message,
          timestamp: new Date().toISOString(),
          id: 'web_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9)
        };
        window.ReactNativeWebView.postMessage(JSON.stringify(bridgeMessage));
      }
    },
    
    // 간편 메서드
    send: function(action, payload) {
      this.sendToNative({
        type: '${MessageType.WEB_TO_NATIVE}',
        action: action,
        payload: payload
      });
    },
    
    // 이벤트 전송
    sendEvent: function(action, payload) {
      this.sendToNative({
        type: '${MessageType.WEB_EVENT}',
        action: action,
        payload: payload
      });
    },
    
    // 에러 전송
    sendError: function(error) {
      this.sendToNative({
        type: '${MessageType.WEB_ERROR}',
        action: 'error',
        payload: {
          message: error.message || String(error),
          stack: error.stack
        }
      });
    }
  };
  
  // 레거시 지원
  window.sendToNative = window.WebViewBridge.sendToNative.bind(window.WebViewBridge);
  
  // 전역 에러 핸들러
  window.addEventListener('error', function(event) {
    window.WebViewBridge.sendError({
      message: event.message,
      filename: event.filename,
      lineno: event.lineno,
      colno: event.colno,
      error: event.error
    });
  });
  
  // 준비 완료 신호
  window.WebViewBridge.send('ready', {
    userAgent: navigator.userAgent,
    url: window.location.href
  });
  
  true;
`;