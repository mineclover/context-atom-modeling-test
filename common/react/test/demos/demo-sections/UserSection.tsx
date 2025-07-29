import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { UserController } from '../../components/UserController'
import { UserDisplay } from '../../components/UserDisplay'
import { UserProvider } from '../../contexts/userContext'

export const UserSection: React.FC = () => {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>👤 User Context</Text>
      <UserProvider>
        <View style={styles.contextGrid}>
          <UserDisplay />
          <UserController />
        </View>
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
  contextGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    gap: 8,
  },
})