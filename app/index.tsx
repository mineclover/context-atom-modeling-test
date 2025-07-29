import { router } from "expo-router";
import { Button, ScrollView, StyleSheet, Text, View } from "react-native";

export default function Index() {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <Text style={styles.title}>🏠 메인 화면</Text>
      <Text style={styles.subtitle}>Expo Router + React Native 데모 앱</Text>
      
      <Text style={styles.sectionTitle}>🌐 웹뷰 페이지</Text>
      <View style={styles.buttonContainer}>
        <Button
          title="웹뷰 목록 보기"
          onPress={() => router.push('/webview')}
        />
      </View>
      <View style={styles.subButtonContainer}>
        <Button
          title="네이버 (직접)"
          onPress={() => router.push('/webview/naver')}
          color="#2ecc71"
        />
        <Button
          title="구글 (직접)"
          onPress={() => router.push('/webview/google')}
          color="#3498db"
        />
      </View>
      
      <Text style={styles.sectionTitle}>🎮 데모 페이지</Text>
      <View style={styles.buttonContainer}>
        <Button
          title="데모 목록 보기"
          onPress={() => router.push('/demos')}
          color="#28a745"
        />
      </View>
      <View style={styles.buttonContainer}>
        <Button
          title="프로세스 시각화 데모 (직접)"
          onPress={() => router.push('/demos/process')}
          color="#22c55e"
        />
      </View>
      
      <Text style={styles.sectionTitle}>⚛️ Jotai Context 테스트</Text>
      <Text style={styles.sectionDescription}>
        createAtomContext 패턴을 사용한 다양한 상태 관리 테스트
      </Text>
      <View style={styles.buttonContainer}>
        <Button
          title="테스트 목록 보기"
          onPress={() => router.push('/tests')}
          color="#6366f1"
        />
      </View>
      <View style={styles.buttonContainer}>
        <Button
          title="🧪 종합 테스트 뷰어 (직접)"
          onPress={() => router.push('/tests/comprehensive')}
          color="#818cf8"
        />
      </View>
      <View style={styles.buttonContainer}>
        <Button
          title="📊 전체 Context 테스트 (직접)"
          onPress={() => router.push('/tests/context')}
          color="#3b82f6"
        />
      </View>
   
      <View style={styles.buttonContainer}>
        <Button
          title="🔢 기본 Jotai 테스트 (직접)"
          onPress={() => router.push('/tests/jotai')}
          color="#9c27b0"
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },
  contentContainer: {
    alignItems: "center",
    padding: 20,
    paddingBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#1e293b",
  },
  subtitle: {
    fontSize: 14,
    color: "#64748b",
    marginBottom: 30,
    textAlign: "center",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginTop: 24,
    marginBottom: 8,
    color: "#334155",
    textAlign: "center",
  },
  sectionDescription: {
    fontSize: 12,
    color: "#64748b",
    marginBottom: 12,
    textAlign: "center",
    paddingHorizontal: 20,
    lineHeight: 16,
  },
  buttonContainer: {
    marginBottom: 10,
    minWidth: 250,
  },
  subButtonContainer: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 10,
    marginBottom: 10,
  },
});
