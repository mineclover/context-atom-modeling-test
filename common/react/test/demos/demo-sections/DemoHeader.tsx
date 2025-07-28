import React from 'react'
import { View, Text, StyleSheet } from 'react-native'

export const DemoHeader: React.FC = () => {
  return (
    <View style={styles.header}>
      <Text style={styles.title}>🚀 Jotai Context Demo</Text>
      <Text style={styles.subtitle}>Simplified createAtomContext Pattern</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  header: {
    alignItems: 'center',
    marginBottom: 12,
    padding: 8,
    backgroundColor: '#fff',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
})