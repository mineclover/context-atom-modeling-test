import { Stack } from 'expo-router'

export default function DemosLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: '#28a745',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    />
  )
}