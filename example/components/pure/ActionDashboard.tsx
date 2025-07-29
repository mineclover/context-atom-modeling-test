import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { ActionLog } from '../../contexts/ViewActionContext';

// 통계 타입 정의
interface DashboardStats {
  total: number;
  success: number;
  error: number;
  pending: number;
}

// 순수 대시보드 컴포넌트 props 타입
interface ActionDashboardProps {
  logs: ActionLog[];
  onClearLogs?: () => void;
}

// 순수 뷰 컴포넌트 - 로직과 뷰 분리
export const ActionDashboard: React.FC<ActionDashboardProps> = ({ 
  logs,
  onClearLogs 
}) => {
  const [stats, setStats] = useState<DashboardStats>({
    total: 0,
    success: 0,
    error: 0,
    pending: 0,
  });

  useEffect(() => {
    // 통계 계산을 다음 프레임으로 지연하여 성능 최적화
    requestAnimationFrame(() => {
      const newStats = logs.reduce((acc, log) => {
        acc.total++;
        acc[log.status]++;
        return acc;
      }, { total: 0, success: 0, error: 0, pending: 0 });
      setStats(newStats);
    });
  }, [logs]);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>실시간 액션 대시보드</Text>
        <TouchableOpacity style={styles.clearButton} onPress={onClearLogs}>
          <Text style={styles.clearButtonText}>클리어</Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.statsContainer}>
        <View style={[styles.statCard, { backgroundColor: '#2196F3' }]}>
          <Text style={styles.statNumber}>{stats.total}</Text>
          <Text style={styles.statLabel}>총 액션</Text>
        </View>
        <View style={[styles.statCard, { backgroundColor: '#4CAF50' }]}>
          <Text style={styles.statNumber}>{stats.success}</Text>
          <Text style={styles.statLabel}>성공</Text>
        </View>
        <View style={[styles.statCard, { backgroundColor: '#F44336' }]}>
          <Text style={styles.statNumber}>{stats.error}</Text>
          <Text style={styles.statLabel}>실패</Text>
        </View>
        <View style={[styles.statCard, { backgroundColor: '#FF9800' }]}>
          <Text style={styles.statNumber}>{stats.pending}</Text>
          <Text style={styles.statLabel}>진행중</Text>
        </View>
      </View>

      <ScrollView style={styles.logContainer} showsVerticalScrollIndicator={false}>
        {logs.map((log) => {
          const borderColor = log.status === 'success' ? '#4CAF50' : 
                            log.status === 'error' ? '#F44336' : '#FF9800';
          return (
            <View key={log.id} style={[styles.logItem, { borderLeftColor: borderColor }]}>
              <View style={styles.logHeader}>
                <Text style={styles.logAction}>{log.action}</Text>
                <Text style={styles.logType}>{log.type.toUpperCase()}</Text>
                <Text style={styles.logTime}>
                  {log.timestamp.toLocaleTimeString()}
                </Text>
              </View>
              {log.message && (
                <Text style={styles.logMessage}>{log.message}</Text>
              )}
              {log.payload && (
                <Text style={styles.logPayload}>
                  {JSON.stringify(log.payload, null, 2)}
                </Text>
              )}
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    margin: 15,
    padding: 20,
    borderRadius: 15,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  clearButton: {
    backgroundColor: '#ef4444',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 8,
  },
  clearButtonText: {
    color: 'white',
    fontWeight: '600',
  },
  statsContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  statCard: {
    flex: 1,
    padding: 15,
    borderRadius: 12,
    marginHorizontal: 3,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  statLabel: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.9)',
    marginTop: 4,
  },
  logContainer: {
    maxHeight: 200,
  },
  logItem: {
    backgroundColor: '#f8f9fa',
    padding: 12,
    marginVertical: 4,
    borderRadius: 8,
    borderLeftWidth: 4,
  },
  logHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  logAction: {
    fontWeight: '600',
    color: '#1f2937',
    flex: 1,
  },
  logType: {
    fontSize: 10,
    backgroundColor: '#e5e7eb',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    marginHorizontal: 8,
  },
  logTime: {
    fontSize: 11,
    color: '#6b7280',
  },
  logMessage: {
    marginTop: 4,
    fontSize: 12,
    color: '#4b5563',
  },
  logPayload: {
    marginTop: 4,
    fontSize: 10,
    color: '#6b7280',
    fontFamily: 'monospace',
  },
});