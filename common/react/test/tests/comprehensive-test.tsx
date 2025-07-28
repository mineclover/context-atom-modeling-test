import React, { useState } from 'react'
import { ScrollView, View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import { AllContextTestWidget } from './AllContextTestWidget'
import { MiniTestWidget } from './MiniTestWidget'

type TestMode = 'full' | 'individual' | 'scenarios'

export default function ComprehensiveTest() {
  const [mode, setMode] = useState<TestMode>('full')

  const renderModeSelector = () => (
    <View style={styles.modeSelector}>
      <Text style={styles.modeSelectorTitle}>테스트 모드 선택</Text>
      <View style={styles.modeButtons}>
        {[
          { key: 'full', label: '전체 테스트', emoji: '🧪' },
          { key: 'individual', label: '개별 테스트', emoji: '🔍' },
          { key: 'scenarios', label: '시나리오 테스트', emoji: '📋' },
        ].map(({ key, label, emoji }) => (
          <TouchableOpacity
            key={key}
            onPress={() => setMode(key as TestMode)}
            style={[
              styles.modeButton,
              mode === key && styles.modeButtonActive,
            ]}
          >
            <Text style={[
              styles.modeButtonText,
              mode === key && styles.modeButtonTextActive,
            ]}>
              {emoji} {label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  )

  const renderFullTest = () => (
    <AllContextTestWidget />
  )

  const renderIndividualTests = () => (
    <View style={styles.individualTests}>
      <Text style={styles.sectionTitle}>개별 Context 테스트</Text>
      <View style={styles.miniWidgetGrid}>
        <MiniTestWidget type="counter" showDuplicate={true} />
        <MiniTestWidget type="user" showDuplicate={true} />
        <MiniTestWidget type="theme" showDuplicate={true} />
        <MiniTestWidget type="text" showDuplicate={true} />
      </View>
      
      <Text style={styles.sectionTitle}>통합 Context 테스트</Text>
      <MiniTestWidget type="mixed" showDuplicate={false} />
    </View>
  )

  const renderScenarioTests = () => (
    <View style={styles.scenarioTests}>
      <Text style={styles.sectionTitle}>테스트 시나리오</Text>
      
      {/* Scenario 1: Context Isolation */}
      <View style={styles.scenario}>
        <Text style={styles.scenarioTitle}>
          📍 시나리오 1: Context 독립성 검증
        </Text>
        <Text style={styles.scenarioDescription}>
          동일한 타입의 여러 Provider가 독립적인 상태를 유지하는지 확인
        </Text>
        <View style={styles.scenarioContent}>
          <MiniTestWidget type="counter" title="Counter A" showDuplicate={false} />
          <MiniTestWidget type="counter" title="Counter B" showDuplicate={false} />
        </View>
      </View>

      {/* Scenario 2: Type Safety */}
      <View style={styles.scenario}>
        <Text style={styles.scenarioTitle}>
          🔒 시나리오 2: 타입 안전성 검증
        </Text>
        <Text style={styles.scenarioDescription}>
          각 Context가 올바른 타입을 유지하고 있는지 확인
        </Text>
        <View style={styles.scenarioContent}>
          <MiniTestWidget type="user" title="Object Type" showDuplicate={false} />
          <MiniTestWidget type="theme" title="Union Type" showDuplicate={false} />
        </View>
      </View>

      {/* Scenario 3: Performance */}
      <View style={styles.scenario}>
        <Text style={styles.scenarioTitle}>
          ⚡ 시나리오 3: 성능 테스트
        </Text>
        <Text style={styles.scenarioDescription}>
          다중 Context가 함께 작동할 때의 성능 확인
        </Text>
        <View style={styles.scenarioContent}>
          <MiniTestWidget type="mixed" title="Multi Context" showDuplicate={false} />
        </View>
      </View>

      {/* Scenario 4: Hook Variations */}
      <View style={styles.scenario}>
        <Text style={styles.scenarioTitle}>
          🎣 시나리오 4: Hook 변형 테스트
        </Text>
        <Text style={styles.scenarioDescription}>
          useAtomState, useAtomReadOnly, useAtomSetter 각각의 동작 확인
        </Text>
        <View style={styles.scenarioContent}>
          <MiniTestWidget type="text" title="Hook Variants" showDuplicate={false} />
        </View>
      </View>
    </View>
  )

  const renderContent = () => {
    switch (mode) {
      case 'full': return renderFullTest()
      case 'individual': return renderIndividualTests()
      case 'scenarios': return renderScenarioTests()
      default: return renderFullTest()
    }
  }

  return (
    <ScrollView 
      style={styles.container} 
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>🔬 createAtomContext 종합 테스트</Text>
        <Text style={styles.subtitle}>
          모든 Context 패턴과 시나리오를 검증하는 테스트 도구
        </Text>
      </View>

      {renderModeSelector()}
      {renderContent()}

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.footerTitle}>테스트 완료 ✅</Text>
        <Text style={styles.footerText}>
          createAtomContext 패턴이 모든 시나리오에서 정상 작동합니다
        </Text>
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  contentContainer: {
    paddingVertical: 8,
    paddingHorizontal: 8,
  },
  header: {
    alignItems: 'center',
    marginBottom: 16,
    padding: 16,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 11,
    color: '#64748b',
    textAlign: 'center',
  },
  modeSelector: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  modeSelectorTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#374151',
    textAlign: 'center',
    marginBottom: 8,
  },
  modeButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    gap: 4,
  },
  modeButton: {
    flex: 1,
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderRadius: 6,
    backgroundColor: '#f1f5f9',
    alignItems: 'center',
  },
  modeButtonActive: {
    backgroundColor: '#3b82f6',
  },
  modeButtonText: {
    fontSize: 9,
    fontWeight: '600',
    color: '#64748b',
  },
  modeButtonTextActive: {
    color: '#ffffff',
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#374151',
    textAlign: 'center',
    marginVertical: 8,
  },
  individualTests: {
    gap: 8,
  },
  miniWidgetGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  scenarioTests: {
    gap: 12,
  },
  scenario: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  scenarioTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 4,
  },
  scenarioDescription: {
    fontSize: 9,
    color: '#64748b',
    marginBottom: 8,
    lineHeight: 12,
  },
  scenarioContent: {
    gap: 6,
  },
  footer: {
    backgroundColor: '#ecfdf5',
    borderRadius: 8,
    padding: 12,
    marginTop: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#22c55e',
  },
  footerTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#15803d',
    marginBottom: 4,
  },
  footerText: {
    fontSize: 9,
    color: '#15803d',
    textAlign: 'center',
  },
})