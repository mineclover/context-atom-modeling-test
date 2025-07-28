import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useCounterViewModel } from '../core/useCounterViewModel';

export const CounterDisplay: React.FC = () => {
  const { count } = useCounterViewModel();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>카운터 현재 값</Text>
      <Text style={styles.countText}>
        {count}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 8, // 패딩 축소
    margin: 4, // 마진 축소
    backgroundColor: '#f0f0f0',
    borderRadius: 6,
    alignItems: 'center',
  },
  title: {
    marginBottom: 4, // 마진 축소
    fontSize: 10, // 폰트 크기 축소
    fontWeight: '600',
    color: '#333',
  },
  countText: {
    fontSize: 24, // 폰트 크기 축소
    fontWeight: 'bold',
    color: '#333',
  },
});