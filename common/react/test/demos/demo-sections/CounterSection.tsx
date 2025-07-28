import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { CounterProvider } from '../../contexts/counterContext'
import Widget from '../../components/Widget'
import DebugWidget from '../../components/DebugWidget'

export const CounterSection: React.FC = () => {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>📊 Counter Widgets</Text>
      <View style={styles.widgetGrid}>
        <CounterProvider>
          <Widget />
          <Widget />
        </CounterProvider>
        <CounterProvider>
          <Widget />
          <DebugWidget />
        </CounterProvider>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  section: {
    marginBottom: 12,
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
    textAlign: 'center',
  },
  widgetGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    gap: 4,
  },
})