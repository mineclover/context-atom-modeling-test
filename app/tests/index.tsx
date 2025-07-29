import { Link, Stack } from 'expo-router'
import { ScrollView, StyleSheet, Text, View } from 'react-native'

export default function TestsIndex() {
  return (
    <>
      <Stack.Screen 
        options={{
          title: '테스트 목록',
          headerShown: true,
        }} 
      />
      <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
        <Text style={styles.title}>⚛️ Jotai Context 테스트</Text>
        <Text style={styles.description}>
          createAtomContext 패턴을 사용한 다양한 상태 관리 테스트
        </Text>
        
        <View style={styles.linkContainer}>
          <Link href="/tests/comprehensive" style={styles.link}>
            <View style={styles.linkCard}>
              <Text style={styles.linkTitle}>🧪 종합 테스트 뷰어</Text>
              <Text style={styles.linkDescription}>
                모든 컨텍스트 타입을 한 화면에서 테스트
              </Text>
            </View>
          </Link>
          
          <Link href="/tests/context" style={styles.link}>
            <View style={styles.linkCard}>
              <Text style={styles.linkTitle}>📊 전체 Context 테스트</Text>
              <Text style={styles.linkDescription}>
                다양한 컨텍스트 타입별 테스트
              </Text>
            </View>
          </Link>
          
          <Link href="/tests/jotai" style={styles.link}>
            <View style={styles.linkCard}>
              <Text style={styles.linkTitle}>🔢 기본 Jotai 테스트</Text>
              <Text style={styles.linkDescription}>
                Counter Widget 기본 테스트
              </Text>
            </View>
          </Link>

          <Link href="/tests/action-context" style={styles.link}>
            <View style={styles.linkCard}>
              <Text style={styles.linkTitle}>⚡ ActionContext 테스트 #1</Text>
              <Text style={styles.linkDescription}>
                createActionContext 패턴 테스트 - 첫 번째
              </Text>
            </View>
          </Link>
        </View>
      </ScrollView>
    </>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  contentContainer: {
    padding: 20,
    paddingBottom: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 8,
    textAlign: 'center',
  },
  description: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 24,
    textAlign: 'center',
    lineHeight: 20,
  },
  linkContainer: {
    gap: 12,
  },
  link: {
    marginBottom: 12,
  },
  linkCard: {
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  linkTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#334155',
    marginBottom: 4,
  },
  linkDescription: {
    fontSize: 12,
    color: '#64748b',
    lineHeight: 16,
  },
})