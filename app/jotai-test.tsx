import React from 'react';
import { ScrollView, StyleSheet, SafeAreaView, View } from 'react-native';
import { Stack } from 'expo-router';
import Widget from '../common/react/test/Widget';

export default function JotaiTestScreen() {
  return (
    <>
      <Stack.Screen 
        options={{
          title: 'Jotai 테스트',
          headerShown: true,
        }} 
      />
      <SafeAreaView style={styles.container}>
        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.widgetRow}>
            <Widget />
            <Widget />
          </View>
          <View style={styles.widgetRow}>
            <Widget />
            <Widget />
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
  widgetRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-start',
    width: '100%',
    marginBottom: 16,
  },
});