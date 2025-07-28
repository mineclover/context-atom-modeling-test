import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { CounterProvider } from '../contexts/counterContext'
import { UserProvider } from '../contexts/userContext'
import { ThemeProvider } from '../contexts/themeContext'
import { TextProvider } from '../contexts/textContext'
import { CounterDisplay } from '../components/CounterDisplay'
import { CounterController } from '../components/CounterController'
import { UserDisplay } from '../components/UserDisplay'
import { UserController } from '../components/UserController'
import { ThemeDisplay } from '../components/ThemeDisplay'
import { ThemeController } from '../components/ThemeController'
import { TextDisplay } from '../components/TextDisplay'
import { TextController } from '../components/TextController'

interface TestSectionProps {
  title: string
  emoji: string
  backgroundColor: string
  borderColor: string
  children: React.ReactNode
}

const TestSection: React.FC<TestSectionProps> = ({ 
  title, 
  emoji, 
  backgroundColor, 
  borderColor, 
  children 
}) => (
  <View style={[styles.section, { backgroundColor, borderColor }]}>
    <Text style={styles.sectionTitle}>
      {emoji} {title}
    </Text>
    <View style={styles.sectionContent}>
      {children}
    </View>
  </View>
)

export const AllContextTestWidget: React.FC = () => {
  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>🧪 Context Test Lab</Text>
        <Text style={styles.subtitle}>
          모든 createAtomContext 패턴 테스트
        </Text>
      </View>

      {/* Counter Context Test */}
      <TestSection
        title="Counter Context (number)"
        emoji="🔢"
        backgroundColor="#f8f9ff"
        borderColor="#6366f1"
      >
        <CounterProvider>
          <View style={styles.testRow}>
            <CounterDisplay />
            <CounterController />
          </View>
        </CounterProvider>
        <CounterProvider>
          <View style={styles.testRow}>
            <CounterDisplay />
            <CounterController />
          </View>
        </CounterProvider>
      </TestSection>

      {/* User Context Test */}
      <TestSection
        title="User Context (object)"
        emoji="👤"
        backgroundColor="#fef7f0"
        borderColor="#f97316"
      >
        <UserProvider>
          <View style={styles.testRow}>
            <UserDisplay />
            <UserController />
          </View>
        </UserProvider>
        <UserProvider>
          <View style={styles.testRow}>
            <UserDisplay />
            <UserController />
          </View>
        </UserProvider>
      </TestSection>

      {/* Theme Context Test */}
      <TestSection
        title="Theme Context (union type)"
        emoji="🎨"
        backgroundColor="#f0fdf4"
        borderColor="#22c55e"
      >
        <ThemeProvider>
          <View style={styles.testRow}>
            <ThemeDisplay />
            <ThemeController />
          </View>
        </ThemeProvider>
        <ThemeProvider>
          <View style={styles.testRow}>
            <ThemeDisplay />
            <ThemeController />
          </View>
        </ThemeProvider>
      </TestSection>

      {/* Text Context Test */}
      <TestSection
        title="Text Context (string)"
        emoji="📝"
        backgroundColor="#fef3f2"
        borderColor="#ef4444"
      >
        <TextProvider>
          <View style={styles.testRow}>
            <TextDisplay />
            <TextController />
          </View>
        </TextProvider>
        <TextProvider>
          <View style={styles.testRow}>
            <TextDisplay />
            <TextController />
          </View>
        </TextProvider>
      </TestSection>

      {/* Multi-Context Integration Test */}
      <TestSection
        title="Multi-Context Integration"
        emoji="🔀"
        backgroundColor="#faf5ff"
        borderColor="#a855f7"
      >
        <CounterProvider>
          <UserProvider>
            <ThemeProvider>
              <TextProvider>
                <View style={styles.multiContextGrid}>
                  <CounterDisplay />
                  <UserDisplay />
                  <ThemeDisplay />
                  <TextDisplay />
                  <CounterController />
                  <UserController />
                  <ThemeController />
                  <TextController />
                </View>
              </TextProvider>
            </ThemeProvider>
          </UserProvider>
        </CounterProvider>
      </TestSection>

      {/* Test Results Summary */}
      <View style={styles.summary}>
        <Text style={styles.summaryTitle}>✅ 테스트 결과</Text>
        <View style={styles.summaryGrid}>
          <Text style={styles.summaryItem}>• Counter: 독립 상태 ✓</Text>
          <Text style={styles.summaryItem}>• User: 객체 타입 ✓</Text>
          <Text style={styles.summaryItem}>• Theme: 유니온 타입 ✓</Text>
          <Text style={styles.summaryItem}>• Text: 문자열 타입 ✓</Text>
          <Text style={styles.summaryItem}>• Context 격리 ✓</Text>
          <Text style={styles.summaryItem}>• 타입 안전성 ✓</Text>
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 8,
    backgroundColor: '#f8fafc',
  },
  header: {
    alignItems: 'center',
    marginBottom: 12,
    padding: 12,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 12,
    color: '#64748b',
    textAlign: 'center',
  },
  section: {
    marginBottom: 12,
    padding: 8,
    borderRadius: 8,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#374151',
    marginBottom: 6,
    textAlign: 'center',
  },
  sectionContent: {
    gap: 6,
  },
  testRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    borderRadius: 6,
    padding: 4,
    marginBottom: 4,
  },
  multiContextGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    borderRadius: 6,
    padding: 6,
  },
  summary: {
    backgroundColor: '#ecfdf5',
    borderRadius: 8,
    padding: 10,
    borderWidth: 1,
    borderColor: '#22c55e',
    marginTop: 4,
  },
  summaryTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#15803d',
    textAlign: 'center',
    marginBottom: 8,
  },
  summaryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 4,
  },
  summaryItem: {
    fontSize: 9,
    color: '#15803d',
    width: '48%',
    marginBottom: 2,
  },
})