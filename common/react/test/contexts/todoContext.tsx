import { createAtomContext } from '../core/createAtomContext'
import { useCallback } from 'react'

// Todo 아이템 타입 정의
export interface TodoItem {
  id: string
  text: string
  completed: boolean
  priority: 'low' | 'medium' | 'high'
  createdAt: number
}

// Todo 상태 타입 정의
export interface TodoState {
  todos: TodoItem[]
  filter: 'all' | 'active' | 'completed'
  sortBy: 'date' | 'priority'
}

// 초기 상태
const initialState: TodoState = {
  todos: [],
  filter: 'all',
  sortBy: 'date',
}

// Todo 컨텍스트 생성
export const {
  Provider: TodoProvider,
  useAtomState: useTodoState,
  useAtomReadOnly: useTodoValue,
  useAtomSetter: useTodoSetter,
  useAtomSelect: useTodoSelect,
} = createAtomContext(initialState)

// useAtomSelect 사용 예시를 위한 커스텀 훅들

// 필터링된 투두 목록을 가져오는 훅
export const useFilteredTodos = () => {
  const selector = useCallback((state: TodoState) => {
    const { todos, filter } = state
    
    switch (filter) {
      case 'active':
        return todos.filter(todo => !todo.completed)
      case 'completed':
        return todos.filter(todo => todo.completed)
      default:
        return todos
    }
  }, [])
  
  return useTodoSelect(selector)
}

// 특정 우선순위의 투두 개수를 가져오는 훅
export const useTodoCountByPriority = (priority: TodoItem['priority']) => {
  const selector = useCallback(
    (state: TodoState) => state.todos.filter(todo => todo.priority === priority).length,
    [priority]
  )
  
  return useTodoSelect(selector)
}

// 완료된 투두의 비율을 가져오는 훅
export const useCompletionRate = () => {
  const selector = useCallback((state: TodoState) => {
    const total = state.todos.length
    if (total === 0) return 0
    
    const completed = state.todos.filter(todo => todo.completed).length
    return Math.round((completed / total) * 100)
  }, [])
  
  return useTodoSelect(selector)
}

// 현재 필터 설정만 가져오는 훅
export const useCurrentFilter = () => {
  const selector = useCallback((state: TodoState) => state.filter, [])
  return useTodoSelect(selector)
}

// 정렬된 투두 목록을 가져오는 훅
export const useSortedTodos = () => {
  const selector = useCallback((state: TodoState) => {
    const { todos, sortBy } = state
    
    return [...todos].sort((a, b) => {
      if (sortBy === 'date') {
        return b.createdAt - a.createdAt
      } else {
        const priorityOrder = { high: 3, medium: 2, low: 1 }
        return priorityOrder[b.priority] - priorityOrder[a.priority]
      }
    })
  }, [])
  
  return useTodoSelect(selector)
}

// 특정 ID의 투두를 가져오는 훅
export const useTodoById = (id: string) => {
  const selector = useCallback(
    (state: TodoState) => state.todos.find(todo => todo.id === id),
    [id]
  )
  
  return useTodoSelect(selector)
}

// 투두 통계를 가져오는 훅
export const useTodoStats = () => {
  const selector = useCallback((state: TodoState) => {
    const { todos } = state
    
    return {
      total: todos.length,
      completed: todos.filter(t => t.completed).length,
      active: todos.filter(t => !t.completed).length,
      highPriority: todos.filter(t => t.priority === 'high').length,
      mediumPriority: todos.filter(t => t.priority === 'medium').length,
      lowPriority: todos.filter(t => t.priority === 'low').length,
    }
  }, [])
  
  return useTodoSelect(selector)
}