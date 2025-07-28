import React, { useRef, useState } from 'react';
import { 
  StyleSheet, 
  SafeAreaView, 
  View, 
  Text, 
  Button, 
  Platform, 
  KeyboardAvoidingView,
  TextInput,
  TouchableOpacity,
  ScrollView
} from 'react-native';
import { Stack } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import { 
  createNativeMessage, 
  parseWebMessage, 
  generateJS, 
  webViewInitScript,
  MessageType,
  BridgeMessage 
} from '../utils/webview-bridge';

// 조건부로 WebView import
let WebView: any;
if (Platform.OS !== 'web') {
  WebView = require('react-native-webview').WebView;
}

export default function WebViewScreen() {
  const webViewRef = useRef<any>(null);
  const [message, setMessage] = useState('');
  const [receivedMessages, setReceivedMessages] = useState<BridgeMessage[]>([]);
  
  const openBrowser = async () => {
    await WebBrowser.openBrowserAsync('https://www.naver.com');
  };
  
  // 웹뷰로 메시지 전송 (표준화된 프로토콜 사용)
  const sendMessageToWebView = () => {
    if (webViewRef.current && message) {
      // 메시지 표시 JS 생성
      const jsCode = generateJS.showMessage(`네이티브에서 보낸 메시지: ${message}`, 5000);
      webViewRef.current.injectJavaScript(jsCode);
      
      // 로그 기록
      const nativeMsg = createNativeMessage('sendMessage', { message });
      console.log('Sent to WebView:', nativeMsg);
      
      setMessage('');
    }
  };
  
  // 추가 기능: 스타일 변경 예시
  const changeWebViewStyle = () => {
    if (webViewRef.current) {
      const jsCode = generateJS.setStyle('body', {
        'background-color': '#f0f0f0',
        'transition': 'background-color 0.3s'
      });
      webViewRef.current.injectJavaScript(jsCode);
    }
  };
  
  // 웹뷰로부터 메시지 수신 (표준화된 프로토콜 파싱)
  const handleMessage = (event: any) => {
    const message = parseWebMessage(event.nativeEvent.data);
    if (message) {
      setReceivedMessages(prev => [...prev, message]);
      
      // 메시지 타입별 처리
      switch (message.type) {
        case MessageType.WEB_EVENT:
          console.log('Web Event:', message.action, message.payload);
          break;
        case MessageType.WEB_ERROR:
          console.error('Web Error:', message.payload);
          break;
        case MessageType.WEB_LOG:
          console.log('Web Log:', message.payload);
          break;
        default:
          console.log('Web Message:', message);
      }
    }
  };

  // 웹 플랫폼에서는 expo-web-browser 사용
  if (Platform.OS === 'web') {
    return (
      <>
        <Stack.Screen 
          options={{
            title: '웹뷰',
            headerShown: true,
          }} 
        />
        <SafeAreaView style={styles.container}>
          <View style={styles.content}>
            <Text style={styles.title}>네이버 열기</Text>
            <Text style={styles.description}>
              웹 환경에서는 새 탭에서 네이버를 열 수 있습니다.
            </Text>
            <Button
              title="새 탭에서 네이버 열기"
              onPress={openBrowser}
            />
          </View>
        </SafeAreaView>
      </>
    );
  }

  // 모바일에서는 react-native-webview 사용
  return (
    <>
      <Stack.Screen 
        options={{
          title: '웹뷰',
          headerShown: true,
        }} 
      />
      <KeyboardAvoidingView 
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <SafeAreaView style={styles.container}>
          {/* 메시지 전송 UI */}
          <View style={styles.messageContainer}>
            <TextInput
              style={styles.input}
              placeholder="웹뷰로 보낼 메시지 입력"
              value={message}
              onChangeText={setMessage}
              onSubmitEditing={sendMessageToWebView}
            />
            <TouchableOpacity 
              style={styles.sendButton} 
              onPress={sendMessageToWebView}
            >
              <Text style={styles.sendButtonText}>전송</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.sendButton, { backgroundColor: '#6c757d', marginLeft: 5 }]} 
              onPress={changeWebViewStyle}
            >
              <Text style={styles.sendButtonText}>스타일</Text>
            </TouchableOpacity>
          </View>
          
          {/* 받은 메시지 표시 영역 */}
          {receivedMessages.length > 0 && (
            <ScrollView style={styles.receivedContainer}>
              <Text style={styles.receivedTitle}>웹뷰에서 받은 메시지:</Text>
              {receivedMessages.map((msg, index) => (
                <View key={index} style={styles.messageItem}>
                  <Text style={styles.messageType}>[{msg.type}]</Text>
                  <Text style={styles.messageAction}>{msg.action}:</Text>
                  <Text style={styles.receivedMessage}>
                    {typeof msg.payload === 'object' 
                      ? JSON.stringify(msg.payload, null, 2) 
                      : msg.payload}
                  </Text>
                </View>
              ))}
            </ScrollView>
          )}
          
          {/* 웹뷰 */}
          <View style={styles.webviewContainer}>
            <WebView
              ref={webViewRef}
              source={{ uri: 'https://www.naver.com' }}
              style={styles.webview}
              startInLoadingState={true}
              scalesPageToFit={true}
              javaScriptEnabled={true}
              domStorageEnabled={true}
              onMessage={handleMessage}
              // 키보드 관련 설정
              keyboardDisplayRequiresUserAction={false}
              // 웹뷰 초기화 시 통신 인터페이스 주입
              injectedJavaScript={`
                ${webViewInitScript}
                
                // 테스트 UI 추가
                setTimeout(() => {
                  // 테스트 버튼 컨테이너
                  const container = document.createElement('div');
                  container.style.cssText = 'position: fixed; bottom: 20px; right: 20px; display: flex; flex-direction: column; gap: 10px; z-index: 9999;';
                  
                  // 메시지 전송 버튼
                  const msgButton = document.createElement('button');
                  msgButton.style.cssText = 'background: #28a745; color: white; padding: 10px 20px; border: none; border-radius: 5px; font-size: 14px; cursor: pointer;';
                  msgButton.textContent = '메시지 전송';
                  msgButton.onclick = () => {
                    window.WebViewBridge.send('testMessage', {
                      text: '테스트 메시지',
                      time: new Date().toLocaleTimeString()
                    });
                  };
                  
                  // 이벤트 전송 버튼
                  const eventButton = document.createElement('button');
                  eventButton.style.cssText = 'background: #007AFF; color: white; padding: 10px 20px; border: none; border-radius: 5px; font-size: 14px; cursor: pointer;';
                  eventButton.textContent = '이벤트 전송';
                  eventButton.onclick = () => {
                    window.WebViewBridge.sendEvent('buttonClick', {
                      buttonId: 'testEventButton',
                      timestamp: Date.now()
                    });
                  };
                  
                  // 에러 테스트 버튼
                  const errorButton = document.createElement('button');
                  errorButton.style.cssText = 'background: #dc3545; color: white; padding: 10px 20px; border: none; border-radius: 5px; font-size: 14px; cursor: pointer;';
                  errorButton.textContent = '에러 테스트';
                  errorButton.onclick = () => {
                    try {
                      throw new Error('테스트 에러 발생!');
                    } catch (e) {
                      window.WebViewBridge.sendError(e);
                    }
                  };
                  
                  container.appendChild(msgButton);
                  container.appendChild(eventButton);
                  container.appendChild(errorButton);
                  document.body.appendChild(container);
                  
                  // 콘솔 로그 테스트
                  console.log('웹뷰 브리지 초기화 완료');
                }, 1000);
                
                // 클릭 이벤트 리스너 추가 예시
                ${generateJS.addEventListener('a', 'click', 'linkClick')}
                
                // 콘솔 캐처 활성화
                ${generateJS.captureConsole()}
              `}
            />
          </View>
        </SafeAreaView>
      </KeyboardAvoidingView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 30,
    color: '#666',
  },
  messageContainer: {
    flexDirection: 'row',
    padding: 10,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  input: {
    flex: 1,
    height: 40,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    paddingHorizontal: 10,
    marginRight: 10,
    fontSize: 16,
  },
  sendButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
    justifyContent: 'center',
  },
  sendButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  receivedContainer: {
    maxHeight: 150,
    backgroundColor: '#f0f0f0',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  receivedTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  messageItem: {
    marginBottom: 8,
    padding: 5,
    backgroundColor: 'white',
    borderRadius: 4,
  },
  messageType: {
    fontSize: 10,
    color: '#007AFF',
    fontWeight: 'bold',
  },
  messageAction: {
    fontSize: 12,
    color: '#666',
    fontWeight: '600',
  },
  receivedMessage: {
    fontSize: 12,
    color: '#333',
    marginTop: 2,
  },
  webviewContainer: {
    flex: 1,
  },
  webview: {
    flex: 1,
  },
});