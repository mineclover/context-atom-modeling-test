import { Stack } from 'expo-router'
import { TodoExample } from '../../common/react/test/components/TodoExample'

export default function TodoTestScreen() {
  return (
    <>
      <Stack.Screen 
        options={{
          title: 'Todo useAtomSelect 테스트',
          headerShown: true,
        }} 
      />
      <TodoExample />
    </>
  )
}