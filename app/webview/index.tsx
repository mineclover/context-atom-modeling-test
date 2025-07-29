import { Link, Stack } from 'expo-router'
import { ScrollView, StyleSheet, Text, View } from 'react-native'

export default function WebViewIndex() {
  return (
    <>
      <Stack.Screen 
        options={{
          title: '웹뷰 페이지',
          headerShown: true,
        }} 
      />
      <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
        <Text style={styles.title}>🌐 웹뷰 페이지</Text>
        <Text style={styles.description}>
          다양한 웹 페이지를 React Native WebView로 보기
        </Text>
        
        <View style={styles.linkContainer}>
          <Link href="/webview/naver" style={styles.link}>
            <View style={styles.linkCard}>
              <Text style={styles.linkTitle}>📱 네이버</Text>
              <Text style={styles.linkDescription}>
                네이버 메인 페이지를 WebView로 표시
              </Text>
            </View>
          </Link>
          
          <Link href="/webview/google" style={styles.link}>
            <View style={styles.linkCard}>
              <Text style={styles.linkTitle}>🔍 구글</Text>
              <Text style={styles.linkDescription}>
                구글 검색 페이지를 WebView로 표시
              </Text>
            </View>
          </Link>
          
          <Link href="/webview/github" style={styles.link}>
            <View style={styles.linkCard}>
              <Text style={styles.linkTitle}>🐙 GitHub</Text>
              <Text style={styles.linkDescription}>
                GitHub 메인 페이지를 WebView로 표시
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