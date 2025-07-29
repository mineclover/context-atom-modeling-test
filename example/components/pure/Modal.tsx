import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

// 순수 Modal 컴포넌트 props 타입
interface ModalProps {
  visible: boolean;
  title?: string;
  onClose?: () => void;
  children?: React.ReactNode;
}

// 순수 뷰 컴포넌트 - 상태 관리 로직 분리
export const Modal: React.FC<ModalProps> = ({ 
  visible, 
  title = '테스트 모달 ✨', 
  onClose,
  children 
}) => {
  if (!visible) return null;

  return (
    <View style={styles.overlay}>
      <View style={styles.content}>
        <Text style={styles.title}>{title}</Text>
        {children}
        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
          <Text style={styles.closeButtonText}>닫기</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  content: {
    backgroundColor: 'white',
    padding: 30,
    borderRadius: 20,
    width: '85%',
    alignItems: 'center',
    elevation: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#1f2937',
  },
  closeButton: {
    backgroundColor: '#6366f1',
    padding: 15,
    borderRadius: 10,
    marginTop: 10,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#6366f1',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  closeButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});