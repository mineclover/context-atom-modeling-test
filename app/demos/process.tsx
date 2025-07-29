import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Animated,
} from 'react-native';
import { Stack } from 'expo-router';

interface Process {
  id: number;
  name: string;
  status: 'waiting' | 'processing' | 'completed' | 'failed';
  progress: number;
  startTime?: number;
  endTime?: number;
  duration?: number;
}

export default function ProcessDemo() {
  const [processes, setProcesses] = useState<Process[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const fadeAnim = React.useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

  const startProcesses = () => {
    setIsRunning(true);
    const newProcesses: Process[] = [
      { id: 1, name: '데이터 수집', status: 'waiting', progress: 0 },
      { id: 2, name: '데이터 검증', status: 'waiting', progress: 0 },
      { id: 3, name: '데이터 처리', status: 'waiting', progress: 0 },
      { id: 4, name: '결과 분석', status: 'waiting', progress: 0 },
      { id: 5, name: '리포트 생성', status: 'waiting', progress: 0 },
    ];
    setProcesses(newProcesses);

    // 프로세스 시뮬레이션
    newProcesses.forEach((process, index) => {
      setTimeout(() => {
        // 프로세스 시작
        setProcesses(prev => 
          prev.map(p => 
            p.id === process.id 
              ? { ...p, status: 'processing', startTime: Date.now() } 
              : p
          )
        );

        // 프로세스 진행 시뮬레이션
        let progress = 0;
        const interval = setInterval(() => {
          progress += Math.random() * 15 + 5;
          if (progress >= 100) {
            progress = 100;
            clearInterval(interval);
            
            // 프로세스 완료
            const shouldFail = Math.random() > 0.8; // 20% 실패 확률
            setProcesses(prev =>
              prev.map(p =>
                p.id === process.id
                  ? {
                      ...p,
                      status: shouldFail ? 'failed' : 'completed',
                      progress: 100,
                      endTime: Date.now(),
                      duration: Date.now() - (p.startTime || 0),
                    }
                  : p
              )
            );

            // 마지막 프로세스 완료 시
            if (index === newProcesses.length - 1) {
              setTimeout(() => setIsRunning(false), 500);
            }
          } else {
            setProcesses(prev =>
              prev.map(p =>
                p.id === process.id ? { ...p, progress: Math.min(progress, 100) } : p
              )
            );
          }
        }, 200);
      }, index * 2000); // 각 프로세스를 2초 간격으로 시작
    });
  };

  const resetProcesses = () => {
    setProcesses([]);
    setIsRunning(false);
  };

  const getStatusColor = (status: Process['status']) => {
    switch (status) {
      case 'waiting':
        return '#6c757d';
      case 'processing':
        return '#007AFF';
      case 'completed':
        return '#28a745';
      case 'failed':
        return '#dc3545';
      default:
        return '#6c757d';
    }
  };

  const getStatusText = (status: Process['status']) => {
    switch (status) {
      case 'waiting':
        return '대기중';
      case 'processing':
        return '처리중';
      case 'completed':
        return '완료';
      case 'failed':
        return '실패';
      default:
        return '알 수 없음';
    }
  };

  const renderProgressBar = (progress: number, status: Process['status']) => {
    return (
      <View style={styles.progressBarContainer}>
        <View
          style={[
            styles.progressBar,
            {
              width: `${progress}%`,
              backgroundColor: getStatusColor(status),
            },
          ]}
        />
      </View>
    );
  };

  return (
    <>
      <Stack.Screen
        options={{
          title: '프로세스 시각화 데모',
          headerShown: true,
        }}
      />
      <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.header}>
            <Text style={styles.title}>프로세스 처리 시각화</Text>
            <Text style={styles.subtitle}>
              실시간 프로세스 진행 상황을 모니터링합니다
            </Text>
          </View>

          <View style={styles.controls}>
            <TouchableOpacity
              style={[styles.button, isRunning && styles.buttonDisabled]}
              onPress={startProcesses}
              disabled={isRunning}
            >
              <Text style={styles.buttonText}>프로세스 시작</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, styles.resetButton]}
              onPress={resetProcesses}
            >
              <Text style={styles.buttonText}>초기화</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.processContainer}>
            {processes.length === 0 ? (
              <Text style={styles.emptyText}>
&lsquo;프로세스 시작&rsquo; 버튼을 눌러 시작하세요
              </Text>
            ) : (
              processes.map((process) => (
                <View key={process.id} style={styles.processItem}>
                  <View style={styles.processHeader}>
                    <Text style={styles.processName}>{process.name}</Text>
                    <View style={styles.statusContainer}>
                      {process.status === 'processing' && (
                        <ActivityIndicator
                          size="small"
                          color={getStatusColor(process.status)}
                          style={styles.spinner}
                        />
                      )}
                      <Text
                        style={[
                          styles.statusText,
                          { color: getStatusColor(process.status) },
                        ]}
                      >
                        {getStatusText(process.status)}
                      </Text>
                    </View>
                  </View>
                  {renderProgressBar(process.progress, process.status)}
                  <View style={styles.processFooter}>
                    <Text style={styles.progressText}>{process.progress.toFixed(0)}%</Text>
                    {process.duration && (
                      <Text style={styles.durationText}>
                        {(process.duration / 1000).toFixed(1)}초
                      </Text>
                    )}
                  </View>
                </View>
              ))
            )}
          </View>

          {processes.length > 0 && !isRunning && (
            <View style={styles.summary}>
              <Text style={styles.summaryTitle}>처리 요약</Text>
              <Text style={styles.summaryText}>
                전체: {processes.length}개
              </Text>
              <Text style={styles.summaryText}>
                성공: {processes.filter(p => p.status === 'completed').length}개
              </Text>
              <Text style={styles.summaryText}>
                실패: {processes.filter(p => p.status === 'failed').length}개
              </Text>
            </View>
          )}
        </ScrollView>
      </Animated.View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollContent: {
    padding: 20,
  },
  header: {
    marginBottom: 30,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 30,
    gap: 15,
  },
  button: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 25,
    paddingVertical: 12,
    borderRadius: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  buttonDisabled: {
    backgroundColor: '#ccc',
  },
  resetButton: {
    backgroundColor: '#6c757d',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  processContainer: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
  },
  emptyText: {
    textAlign: 'center',
    color: '#999',
    fontSize: 16,
    paddingVertical: 40,
  },
  processItem: {
    marginBottom: 25,
  },
  processHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  processName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  spinner: {
    marginRight: 8,
  },
  statusText: {
    fontSize: 14,
    fontWeight: '500',
  },
  progressBarContainer: {
    height: 8,
    backgroundColor: '#e9ecef',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressBar: {
    height: '100%',
    borderRadius: 4,
  },
  processFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  progressText: {
    fontSize: 12,
    color: '#666',
  },
  durationText: {
    fontSize: 12,
    color: '#666',
  },
  summary: {
    marginTop: 30,
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
  },
  summaryTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  summaryText: {
    fontSize: 16,
    color: '#666',
    marginVertical: 4,
  },
});