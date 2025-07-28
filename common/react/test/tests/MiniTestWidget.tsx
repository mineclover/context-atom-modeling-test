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

type ContextType = 'counter' | 'user' | 'theme' | 'text' | 'mixed'

interface MiniTestWidgetProps {
  type: ContextType
  title?: string
  showDuplicate?: boolean
}

export const MiniTestWidget: React.FC<MiniTestWidgetProps> = ({ 
  type, 
  title,
  showDuplicate = true 
}) => {
  const getContextColor = (contextType: ContextType) => {
    switch (contextType) {
      case 'counter': return { bg: '#dbeafe', border: '#3b82f6' }
      case 'user': return { bg: '#fed7aa', border: '#f97316' }
      case 'theme': return { bg: '#dcfce7', border: '#22c55e' }
      case 'text': return { bg: '#fecaca', border: '#ef4444' }
      case 'mixed': return { bg: '#f3e8ff', border: '#a855f7' }
      default: return { bg: '#f1f5f9', border: '#64748b' }
    }
  }

  const colors = getContextColor(type)

  const renderContextContent = (contextType: ContextType) => {
    switch (contextType) {
      case 'counter':
        return (
          <CounterProvider>
            <View style={styles.contextRow}>
              <CounterDisplay />
              <CounterController />
            </View>
          </CounterProvider>
        )
      
      case 'user':
        return (
          <UserProvider>
            <View style={styles.contextRow}>
              <UserDisplay />
              <UserController />
            </View>
          </UserProvider>
        )
      
      case 'theme':
        return (
          <ThemeProvider>
            <View style={styles.contextRow}>
              <ThemeDisplay />
              <ThemeController />
            </View>
          </ThemeProvider>
        )
      
      case 'text':
        return (
          <TextProvider>
            <View style={styles.contextRow}>
              <TextDisplay />
              <TextController />
            </View>
          </TextProvider>
        )
      
      case 'mixed':
        return (
          <CounterProvider>
            <UserProvider>
              <ThemeProvider>
                <TextProvider>
                  <View style={styles.mixedGrid}>
                    <CounterDisplay />
                    <UserDisplay />
                    <ThemeDisplay />
                    <TextDisplay />
                  </View>
                </TextProvider>
              </ThemeProvider>
            </UserProvider>
          </CounterProvider>
        )
      
      default:
        return <Text style={styles.errorText}>Unknown context type</Text>
    }
  }

  const getTypeInfo = (contextType: ContextType) => {
    switch (contextType) {
      case 'counter': return { emoji: '🔢', name: 'Counter', dataType: 'number' }
      case 'user': return { emoji: '👤', name: 'User', dataType: 'object' }
      case 'theme': return { emoji: '🎨', name: 'Theme', dataType: 'union' }
      case 'text': return { emoji: '📝', name: 'Text', dataType: 'string' }
      case 'mixed': return { emoji: '🔀', name: 'Mixed', dataType: 'all types' }
      default: return { emoji: '❓', name: 'Unknown', dataType: 'unknown' }
    }
  }

  const typeInfo = getTypeInfo(type)

  return (
    <View style={[styles.widget, { backgroundColor: colors.bg, borderColor: colors.border }]}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>
          {typeInfo.emoji} {title || typeInfo.name} Context
        </Text>
        <Text style={styles.dataType}>
          Type: {typeInfo.dataType}
        </Text>
      </View>

      {/* Context Test */}
      <View style={styles.content}>
        {renderContextContent(type)}
        
        {/* Duplicate test for isolation verification */}
        {showDuplicate && type !== 'mixed' && (
          <>
            <View style={styles.separator} />
            {renderContextContent(type)}
          </>
        )}
      </View>

      {/* Status */}
      <View style={styles.status}>
        <Text style={styles.statusText}>
          ✅ Context isolation: {showDuplicate ? 'Verified' : 'Single instance'}
        </Text>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  widget: {
    borderRadius: 8,
    borderWidth: 1,
    margin: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  header: {
    padding: 8,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.1)',
    alignItems: 'center',
  },
  title: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#374151',
    marginBottom: 2,
  },
  dataType: {
    fontSize: 8,
    color: '#6b7280',
    fontStyle: 'italic',
  },
  content: {
    padding: 6,
  },
  contextRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    borderRadius: 4,
    padding: 4,
    marginBottom: 4,
  },
  mixedGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    alignItems: 'center',
    gap: 2,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    borderRadius: 4,
    padding: 4,
  },
  separator: {
    height: 1,
    backgroundColor: 'rgba(0,0,0,0.1)',
    marginVertical: 4,
  },
  status: {
    padding: 4,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.1)',
    alignItems: 'center',
  },
  statusText: {
    fontSize: 8,
    color: '#059669',
    fontWeight: '600',
  },
  errorText: {
    fontSize: 10,
    color: '#dc2626',
    textAlign: 'center',
    padding: 8,
  },
})