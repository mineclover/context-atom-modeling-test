import { Link, Stack } from 'expo-router'
import { ScrollView, StyleSheet, Text, View } from 'react-native'

export default function DemosIndex() {
  return (
    <>
      <Stack.Screen 
        options={{
          title: '데모 목록',
          headerShown: true,
        }} 
      />
      <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
        <Text style={styles.title}>🎮 데모 페이지</Text>
        <Text style={styles.description}>
          React Native 기능 데모 및 시각화
        </Text>
        
        <View style={styles.linkContainer}>
          <Link href="/demos/process" style={styles.link}>
            <View style={styles.linkCard}>
              <Text style={styles.linkTitle}>📊 프로세스 시각화 데모</Text>
              <Text style={styles.linkDescription}>
                애니메이션과 함께 프로세스 진행 상황을 시각화
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