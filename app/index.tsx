import { Link, router } from "expo-router";
import { Button, StyleSheet, Text, View } from "react-native";

export default function Index() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>홈 화면</Text>
      
      <Text style={styles.sectionTitle}>웹뷰 페이지</Text>
      <View style={styles.buttonContainer}>
        <Button
          title="네이버 웹뷰"
          onPress={() => router.push('/webview/naver')}
        />
      </View>

      <View style={styles.buttonContainer}>
        <Button
          title="구글 웹뷰"
          onPress={() => router.push('/webview/google')}
          color="#6c757d"
        />
      </View>
      
      <Text style={styles.sectionTitle}>데모 페이지</Text>
      <View style={styles.buttonContainer}>
        <Button
          title="프로세스 시각화 데모"
          onPress={() => router.push('/process-demo')}
          color="#28a745"
        />
      </View>
      <View style={styles.buttonContainer}>
        <Button
          title="Jotai 상태관리 테스트"
          onPress={() => router.push('/jotai-test')}
          color="#9c27b0"
        />
      </View>
      
      <Text style={styles.sectionTitle}>기존 링크 (레거시)</Text>
      <Link href="/webview" style={styles.link}>
        <Text style={styles.linkText}>기존 웹뷰 페이지</Text>
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginTop: 20,
    marginBottom: 10,
    color: "#333",
  },
  buttonContainer: {
    marginBottom: 10,
    minWidth: 200,
  },
  link: {
    marginTop: 10,
  },
  linkText: {
    color: "#007AFF",
    fontSize: 16,
    textDecorationLine: "underline",
  },
});
