import React from 'react'
import { ScrollView, StyleSheet } from 'react-native'
import { AllContextTestWidget } from './AllContextTestWidget'

export default function ContextTest() {
  return (
    <ScrollView 
      style={styles.container} 
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    >
      <AllContextTestWidget />
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f1f5f9',
  },
  contentContainer: {
    paddingVertical: 8,
  },
})