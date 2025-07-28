import { Stack } from 'expo-router';
import React from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';
import Widget from '../common/react/test/components/Widget';
import { CounterProvider } from '../common/react/test/contexts/counterContext';

export default function JotaiTestScreen() {
  return (
    <>
      <Stack.Screen 
        options={{
          title: '🔢 Jotai 기본 테스트',
          headerShown: true,
        }} 
      />
      <SafeAreaView style={styles.container}>
        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.header}>
            <Text style={styles.title}>Counter Widget 테스트</Text>
            <Text style={styles.subtitle}>
              각 Provider는 독립적인 카운터 상태를 관리합니다
            </Text>
          </View>
          
          <View style={styles.widgetRow}>
            <CounterProvider>
              <Widget />
            </CounterProvider>
            <CounterProvider>
              <Widget />
            </CounterProvider>
          </View>
          <View style={styles.widgetRow}>
            <CounterProvider>
              <Widget />
            </CounterProvider>
            <CounterProvider>
              <Widget />
            </CounterProvider>
          </View>
        </ScrollView>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    lineHeight: 16,
  },
  widgetRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-start',
    width: '100%',
    marginBottom: 16,
  },
});