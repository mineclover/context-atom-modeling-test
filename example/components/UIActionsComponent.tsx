import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Modal } from './pure/Modal';
import { Toast } from './pure/Toast';
import { useUIActionModule, UIActionHandlers } from '../modules/UIActionModule';

// UI 액션 컴포넌트 - 간단한 UI 상태 표시 및 직접 제어
export const UIActionsComponent: React.FC = () => {
  const { uiState, actions } = useUIActionModule();

  return (
    <>
      <UIActionHandlers />
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>UI 액션 테스트</Text>
        
        <View style={styles.uiStatus}>
          <Text style={styles.statusText}>테마: {uiState.currentTheme}</Text>
          <Text style={styles.statusText}>
            사이드바: {uiState.sidebarVisible ? '열림 🔓' : '닫힘 🔒'}
          </Text>
          <Text style={styles.statusText}>
            모달: {uiState.modalVisible ? '표시중 👁️' : '숨김 🙈'}
          </Text>
        </View>

        <View style={styles.buttonRow}>
          <TouchableOpacity 
            style={[styles.button, styles.buttonSmall]} 
            onPress={() => {
              console.log('Button clicked: show-toast');
              actions.showToast({
                type: 'success',
                message: '성공 토스트!',
                duration: 2000
              });
              // 토스트 자동 숨김
              setTimeout(() => {
                actions.hideToast();
              }, 2000);
            }}
          >
            <Text style={styles.buttonText}>성공 토스트</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.button, styles.buttonSmall]} 
            onPress={() => {
              console.log('Button clicked: toggle-sidebar');
              actions.setSidebarVisible(!uiState.sidebarVisible);
            }}
          >
            <Text style={styles.buttonText}>사이드바 토글</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.buttonRow}>
          <TouchableOpacity 
            style={[styles.button, styles.buttonSmall]} 
            onPress={() => {
              console.log('Button clicked: set-theme');
              actions.setTheme('dark');
            }}
          >
            <Text style={styles.buttonText}>다크 테마</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.button, styles.buttonSmall]} 
            onPress={() => {
              console.log('Button clicked: show-modal');
              actions.setModalVisible(true);
            }}
          >
            <Text style={styles.buttonText}>모달 열기</Text>
          </TouchableOpacity>
        </View>

        <Modal 
          visible={uiState.modalVisible}
          onClose={() => actions.setModalVisible(false)}
        />

        <Toast 
          id="main-toast"
          toastData={uiState.toastData}
          visible={uiState.toastVisible}
        />
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
  uiStatus: {
    backgroundColor: '#f3f4f6',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
  },
  statusText: {
    fontSize: 14,
    color: '#4b5563',
    marginBottom: 5,
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