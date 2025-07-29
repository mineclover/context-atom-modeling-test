import React from 'react';
import { ScrollView, View, Text, StyleSheet } from 'react-native';
import { useAnimationHandlers } from './contexts/AnimationContext';
import { useViewState } from './contexts/ViewActionContext';
import { DashboardComponent } from './components/DashboardComponent';
import { UserActionsComponent } from './components/UserActionsComponent';
import { UIActionsComponent } from './components/UIActionsComponent';
import { createActionContext } from '../common/react/actionRegister/react/ActionContext';
import { ExtendedActionPayloadMap } from './actions/extended';

// createActionContext를 사용한 앱 레벨 Provider
const { Provider: AppActionProvider } = createActionContext<ExtendedActionPayloadMap>();

// 내부 앱 컴포넌트
const AppContent: React.FC = () => {
  const viewState = useViewState();
  
  // 애니메이션 핸들러만 설정 (viewState는 내부에서 자동 처리)
  useAnimationHandlers();

  return (
    <ScrollView style={styles.app}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>🚀 모듈화된 ActionContext 예제</Text>
        <Text style={styles.headerSubtitle}>
          Pure View + Animation Data + View Action 모듈화
        </Text>
      </View>
      
      <DashboardComponent logs={viewState.state.logs} />
      <UserActionsComponent />
      <UIActionsComponent />
    </ScrollView>
  );
};

// 메인 모듈화된 애플리케이션 컴포넌트
const ModularizedExample: React.FC = () => {
  return (
    <AppActionProvider>
      <AppContent />
    </AppActionProvider>
  );
};

const styles = StyleSheet.create({
  app: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    backgroundColor: '#6366f1',
    padding: 20,
    paddingTop: 50,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
  },
  headerSubtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    marginTop: 5,
  },
});

export default ModularizedExample;