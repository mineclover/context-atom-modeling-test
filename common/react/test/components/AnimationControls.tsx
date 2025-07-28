import React from 'react'
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'

interface AnimationControlsProps {
  onPlay: () => void
  onStop: () => void
  onReset: () => void
  title?: string
  size?: 'small' | 'medium' | 'large'
}

export const AnimationControls: React.FC<AnimationControlsProps> = ({
  onPlay,
  onStop,
  onReset,
  title = '🎬 Animation',
  size = 'small',
}) => {
  const sizeStyles = getSizeStyles(size)

  return (
    <View style={[styles.container, sizeStyles.container]}>
      <Text style={[styles.title, sizeStyles.title]}>{title}</Text>
      <View style={styles.buttons}>
        <TouchableOpacity style={[styles.button, sizeStyles.button]} onPress={onPlay}>
          <Text style={[styles.buttonText, sizeStyles.buttonText]}>▶️</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, sizeStyles.button]} onPress={onStop}>
          <Text style={[styles.buttonText, sizeStyles.buttonText]}>⏹️</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, sizeStyles.button]} onPress={onReset}>
          <Text style={[styles.buttonText, sizeStyles.buttonText]}>🔄</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

const getSizeStyles = (size: 'small' | 'medium' | 'large') => {
  switch (size) {
    case 'small':
      return {
        container: { padding: 6 },
        title: { fontSize: 10, marginBottom: 4 },
        button: { width: 28, height: 28, borderRadius: 14 },
        buttonText: { fontSize: 12 },
      }
    case 'medium':
      return {
        container: { padding: 8 },
        title: { fontSize: 12, marginBottom: 6 },
        button: { width: 36, height: 36, borderRadius: 18 },
        buttonText: { fontSize: 14 },
      }
    case 'large':
      return {
        container: { padding: 12 },
        title: { fontSize: 14, marginBottom: 8 },
        button: { width: 44, height: 44, borderRadius: 22 },
        buttonText: { fontSize: 16 },
      }
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: 'rgba(52, 152, 219, 0.3)',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  title: {
    fontWeight: '600',
    color: '#4a5568',
  },
  buttons: {
    flexDirection: 'row',
    gap: 6,
  },
  button: {
    backgroundColor: '#667eea',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  buttonText: {
    // fontSize will be overridden by size styles
  },
})