import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { TextProvider } from '../../contexts/textContext'
import { TextDisplay } from '../../components/TextDisplay'
import { TextController } from '../../components/TextController'

export const TextSection: React.FC = () => {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>📝 Text Context</Text>
      <TextProvider>
        <View style={styles.contextGrid}>
          <TextDisplay />
          <TextController />
        </View>
      </TextProvider>
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
  contextGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    gap: 8,
  },
})