import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { CounterProvider } from '../../contexts/counterContext'
import EnhancedWidget from '../../components/EnhancedWidget'

export const EnhancedAnimationSection: React.FC = () => {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>🎛️ Enhanced Animation Control</Text>
      <Text style={styles.sectionDescription}>
        Advanced animation control with play, pause, resume, stop, and reset functionality
      </Text>
      <View style={styles.widgetGrid}>
        <CounterProvider>
          <EnhancedWidget />
        </CounterProvider>
        <CounterProvider>
          <EnhancedWidget />
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
  sectionDescription: {
    fontSize: 10,
    color: '#666',
    textAlign: 'center',
    marginBottom: 8,
    lineHeight: 14,
  },
  widgetGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    gap: 4,
  },
})