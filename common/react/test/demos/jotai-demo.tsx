import React from 'react'
import { ScrollView, StyleSheet } from 'react-native'
import { DemoHeader } from './demo-sections/DemoHeader'
import { CounterSection } from './demo-sections/CounterSection'
import { UserSection } from './demo-sections/UserSection'
import { ThemeSection } from './demo-sections/ThemeSection'
import { TextSection } from './demo-sections/TextSection'
import { MultiContextSection } from './demo-sections/MultiContextSection'
import { EnhancedAnimationSection } from './demo-sections/EnhancedAnimationSection'
import { PatternBenefits } from './demo-sections/PatternBenefits'

export default function JotaiDemo() {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <DemoHeader />
      <CounterSection />
      <UserSection />
      <ThemeSection />
      <TextSection />
      <MultiContextSection />
      <EnhancedAnimationSection />
      <PatternBenefits />
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  contentContainer: {
    padding: 8,
  },
})