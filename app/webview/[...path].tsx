import { Stack, useLocalSearchParams } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import React, { useRef, useState } from 'react';
import {
  Button,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import {
  BridgeMessage,
  createNativeMessage,
  generateJS,
  MessageType,
  parseWebMessage,
  webViewInitScript
} from '../../utils/webview-bridge';

// 조건부로 WebView import
let WebView: any;
if (Platform.OS !== 'web') {
  WebView = require('react-native-webview').WebView;
}

// URL 매핑
const urlMappings: Record<string, string> = {
  'naver': 'https://www.naver.com',
  'test': `file://${Platform.OS === 'android' ? '/android_asset' : ''}/common/react/test/index.html`,
  'google': 'https://www.google.com',
  'github': 'https://github.com',
};

export default function DynamicWebViewScreen() {
  const { path } = useLocalSearchParams<{ path: string[] }>();
  const webViewRef = useRef<any>(null);
  const [message, setMessage] = useState('');
  const [receivedMessages, setReceivedMessages] = useState<BridgeMessage[]>([]);
  
  // path 배열을 문자열로 변환
  const pathString = path?.join('/') || 'naver';
  const url = urlMappings[pathString] || urlMappings['naver'];
  
  // 로컬 파일인지 확인
  const isLocalFile = url.startsWith('file://');
  
  const openBrowser = async () => {
    await WebBrowser.openBrowserAsync(url);
  };
  
  // 웹뷰로 메시지 전송
  const sendMessageToWebView = () => {
    if (webViewRef.current && message) {
      const jsCode = generateJS.showMessage(`네이티브에서 보낸 메시지: ${message}`, 5000);
      webViewRef.current.injectJavaScript(jsCode);
      
      const nativeMsg = createNativeMessage('sendMessage', { message });
      console.log('Sent to WebView:', nativeMsg);
      
      setMessage('');
    }
  };
  
  // 스타일 변경
  const changeWebViewStyle = () => {
    if (webViewRef.current) {
      const jsCode = generateJS.setStyle('body', {
        'background-color': '#f0f0f0',
        'transition': 'background-color 0.3s'
      });
      webViewRef.current.injectJavaScript(jsCode);
    }
  };
  
  // 웹뷰로부터 메시지 수신
  const handleMessage = (event: any) => {
    const message = parseWebMessage(event.nativeEvent.data);
    if (message) {
      setReceivedMessages(prev => [...prev, message]);
      
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
            title: `웹뷰 - ${pathString}`,
            headerShown: true,
          }} 
        />
        <SafeAreaView style={styles.container}>
          <View style={styles.content}>
            <Text style={styles.title}>{pathString} 열기</Text>
            <Text style={styles.description}>
              웹 환경에서는 새 탭에서 페이지를 열 수 있습니다.
            </Text>
            <Text style={styles.urlText}>{url}</Text>
            <Button
              title={`새 탭에서 ${pathString} 열기`}
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
          title: `웹뷰 - ${pathString}`,
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
              source={isLocalFile && Platform.OS === 'android' 
                ? { uri: url.replace('file://', '') }
                : { uri: url }
              }
              style={styles.webview}
              startInLoadingState={true}
              scalesPageToFit={true}
              javaScriptEnabled={true}
              domStorageEnabled={true}
              onMessage={handleMessage}
              keyboardDisplayRequiresUserAction={false}
              // 로컬 파일 접근 허용 (Android)
              allowFileAccess={true}
              allowUniversalAccessFromFileURLs={true}
              // 웹뷰 초기화 시 통신 인터페이스 주입
              injectedJavaScript={webViewInitScript}
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
    marginBottom: 10,
    color: '#666',
  },
  urlText: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 30,
    color: '#999',
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
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