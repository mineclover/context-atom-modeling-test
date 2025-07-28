import React from 'react'
import { View, Text, StyleSheet } from 'react-native'

export const PatternBenefits: React.FC = () => {
  return (
    <View style={styles.footer}>
      <Text style={styles.footerTitle}>✨ Pattern Benefits</Text>
      <View style={styles.benefitsList}>
        <Text style={styles.benefit}>• Single line context declaration</Text>
        <Text style={styles.benefit}>• Type-safe by default</Text>
        <Text style={styles.benefit}>• Automatic hook generation</Text>
        <Text style={styles.benefit}>• Reusable across any atom type</Text>
        <Text style={styles.benefit}>• Maintains atom isolation within contexts</Text>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  footer: {
    backgroundColor: '#e9f7ef',
    borderRadius: 8,
    padding: 8,
    marginTop: 4,
  },
  footerTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#155724',
    textAlign: 'center',
    marginBottom: 6,
  },
  benefitsList: {
    alignItems: 'flex-start',
  },
  benefit: {
    fontSize: 9,
    color: '#155724',
    marginBottom: 2,
    paddingLeft: 4,
  },
})