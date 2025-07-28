import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { UserProvider } from '../../contexts/userContext'
import { ThemeProvider } from '../../contexts/themeContext'
import { TextProvider } from '../../contexts/textContext'
import { UserDisplay } from '../../components/UserDisplay'
import { UserController } from '../../components/UserController'
import { ThemeDisplay } from '../../components/ThemeDisplay'
import { ThemeController } from '../../components/ThemeController'
import { TextDisplay } from '../../components/TextDisplay'
import { TextController } from '../../components/TextController'

export const MultiContextSection: React.FC = () => {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>🔄 Multiple Contexts</Text>
      <Text style={styles.sectionDescription}>
        Different contexts working independently
      </Text>
      <UserProvider>
        <ThemeProvider>
          <TextProvider>
            <View style={styles.multiContextGrid}>
              <UserDisplay />
              <ThemeDisplay />
              <TextDisplay />
              <UserController />
              <ThemeController />
              <TextController />
            </View>
          </TextProvider>
        </ThemeProvider>
      </UserProvider>
    </View>
  )
}

const styles = StyleSheet.create({
  section: {
    marginBottom: 12,
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
    textAlign: 'center',
  },
  sectionDescription: {
    fontSize: 10,
    color: '#666',
    textAlign: 'center',
    marginBottom: 6,
  },
  multiContextGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    alignItems: 'center',
    gap: 4,
  },
})