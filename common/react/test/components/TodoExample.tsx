import React, { useCallback } from 'react'
import { Button, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import {
  TodoProvider,
  useCompletionRate,
  useCurrentFilter,
  useFilteredTodos,
  useSortedTodos,
  useTodoCountByPriority,
  useTodoSelect,
  useTodoState,
  useTodoStats,
  type TodoItem,
  type TodoState,
} from '../contexts/todoContext'

// Todo 목록 컴포넌트
const TodoList: React.FC = () => {
  const todos = useFilteredTodos()
  const filter = useCurrentFilter()
  const [, setState] = useTodoState()
  
  const toggleTodo = useCallback((id: string) => {
    setState(prev => ({
      ...prev,
      todos: prev.todos.map(todo =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      ),
    }))
  }, [setState])
  
  const deleteTodo = useCallback((id: string) => {
    setState(prev => ({
      ...prev,
      todos: prev.todos.filter(todo => todo.id !== id),
    }))
  }, [setState])
  
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>투두 목록 (필터: {filter})</Text>
      {todos.length === 0 ? (
        <Text style={styles.emptyText}>표시할 항목이 없습니다</Text>
      ) : (
        todos.map(todo => (
          <TouchableOpacity 
            key={todo.id} 
            style={styles.todoItem}
            onPress={() => toggleTodo(todo.id)}
            activeOpacity={0.7}
          >
            <View style={styles.todoContent}>
              <View style={[
                styles.checkbox,
                todo.completed && styles.checkboxCompleted
              ]}>
                {todo.completed && <Text style={styles.checkmark}>✓</Text>}
              </View>
              <Text style={[
                styles.todoText,
                todo.completed && styles.completedText
              ]}>
                {todo.text}
              </Text>
            </View>
            <View style={styles.todoActions}>
              <Text style={[
                styles.priorityBadge,
                styles[`priority${todo.priority.charAt(0).toUpperCase() + todo.priority.slice(1)}` as keyof typeof styles]
              ]}>
                {todo.priority}
              </Text>
              <TouchableOpacity
                style={styles.deleteButton}
                onPress={(e) => {
                  e.stopPropagation()
                  deleteTodo(todo.id)
                }}
                activeOpacity={0.7}
              >
                <Text style={styles.deleteButtonText}>✕</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        ))
      )}
    </View>
  )
}

// 우선순위별 카운트 표시 컴포넌트
const PriorityCounters: React.FC = () => {
  const highCount = useTodoCountByPriority('high')
  const mediumCount = useTodoCountByPriority('medium')
  const lowCount = useTodoCountByPriority('low')
  
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>우선순위별 개수</Text>
      <Text>높음: {highCount}</Text>
      <Text>중간: {mediumCount}</Text>
      <Text>낮음: {lowCount}</Text>
    </View>
  )
}

// 완료율 표시 컴포넌트
const CompletionRateDisplay: React.FC = () => {
  const completionRate = useCompletionRate()
  
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>완료율</Text>
      <Text style={styles.largeText}>{completionRate}%</Text>
    </View>
  )
}

// 통계 표시 컴포넌트
const TodoStats: React.FC = () => {
  const stats = useTodoStats()
  
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>전체 통계</Text>
      <Text>전체: {stats.total}</Text>
      <Text>완료: {stats.completed}</Text>
      <Text>진행중: {stats.active}</Text>
    </View>
  )
}

// 정렬된 목록 표시 컴포넌트
const SortedTodoList: React.FC = () => {
  const sortedTodos = useSortedTodos()
  const sortBySelector = useCallback((state: TodoState) => state.sortBy, [])
  const sortBy = useTodoSelect(sortBySelector)
  const [, setState] = useTodoState()
  
  const toggleTodo = useCallback((id: string) => {
    setState(prev => ({
      ...prev,
      todos: prev.todos.map(todo =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      ),
    }))
  }, [setState])
  
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>정렬된 목록 (기준: {sortBy})</Text>
      {sortedTodos.slice(0, 5).map(todo => (
        <TouchableOpacity
          key={todo.id}
          style={styles.todoPreviewItem}
          onPress={() => toggleTodo(todo.id)}
          activeOpacity={0.7}
        >
          <View style={styles.todoPreviewContent}>
            <View style={[
              styles.smallCheckbox,
              todo.completed && styles.checkboxCompleted
            ]}>
              {todo.completed && <Text style={styles.smallCheckmark}>✓</Text>}
            </View>
            <Text style={[
              styles.todoPreview,
              todo.completed && styles.completedText
            ]}>
              • {todo.text} ({todo.priority})
            </Text>
          </View>
        </TouchableOpacity>
      ))}
    </View>
  )
}

// 컨트롤 패널 컴포넌트
const ControlPanel: React.FC = () => {
  const [state, setState] = useTodoState()
  
  const addTodo = () => {
    const newTodo: TodoItem = {
      id: Date.now().toString(),
      text: `새 할 일 ${state.todos.length + 1}`,
      completed: false,
      priority: ['low', 'medium', 'high'][Math.floor(Math.random() * 3)] as TodoItem['priority'],
      createdAt: Date.now(),
    }
    
    setState(prev => ({
      ...prev,
      todos: [...prev.todos, newTodo],
    }))
  }
  
  const toggleTodo = (id: string) => {
    setState(prev => ({
      ...prev,
      todos: prev.todos.map(todo =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      ),
    }))
  }
  
  const changeFilter = () => {
    const filters: TodoState['filter'][] = ['all', 'active', 'completed']
    setState(prev => {
      const currentIndex = filters.indexOf(prev.filter)
      const nextIndex = (currentIndex + 1) % filters.length
      return { ...prev, filter: filters[nextIndex] }
    })
  }
  
  const toggleSort = () => {
    setState(prev => ({
      ...prev,
      sortBy: prev.sortBy === 'date' ? 'priority' : 'date',
    }))
  }
  
  const clearCompleted = () => {
    setState(prev => ({
      ...prev,
      todos: prev.todos.filter(todo => !todo.completed),
    }))
  }
  
  return (
    <View style={styles.controlPanel}>
      <Button title="할 일 추가" onPress={addTodo} />
      <Button title="필터 변경" onPress={changeFilter} />
      <Button title="정렬 변경" onPress={toggleSort} />
      {state.todos.some(todo => todo.completed) && (
        <Button 
          title="완료된 항목 삭제" 
          onPress={clearCompleted}
          color="#ff5252"
        />
      )}
    </View>
  )
}

// 메인 예제 컴포넌트
export const TodoExample: React.FC = () => {
  return (
    <TodoProvider>
      <ScrollView style={styles.container}>
        <Text style={styles.title}>Todo useAtomSelect 예제</Text>
        
        <ControlPanel />
        
        <View style={styles.row}>
          <CompletionRateDisplay />
          <TodoStats />
        </View>
        
        <PriorityCounters />
        <SortedTodoList />
        <TodoList />
      </ScrollView>
    </TodoProvider>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  section: {
    backgroundColor: 'white',
    padding: 15,
    marginVertical: 10,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 10,
  },
  todoItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 4,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    borderRadius: 4,
  },
  todoContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  todoActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: '#ddd',
    marginRight: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
  },
  checkboxCompleted: {
    backgroundColor: '#4CAF50',
    borderColor: '#4CAF50',
  },
  checkmark: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  smallCheckbox: {
    width: 16,
    height: 16,
    borderRadius: 2,
    borderWidth: 1,
    borderColor: '#ddd',
    marginRight: 8,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
  },
  smallCheckmark: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
  },
  todoText: {
    fontSize: 16,
    flex: 1,
  },
  completedText: {
    textDecorationLine: 'line-through',
    color: '#999',
  },
  priorityBadge: {
    fontSize: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    color: 'white',
    fontWeight: '600',
    textAlign: 'center',
    minWidth: 50,
  },
  priorityHigh: {
    backgroundColor: '#f44336',
  },
  priorityMedium: {
    backgroundColor: '#ff9800',
  },
  priorityLow: {
    backgroundColor: '#4caf50',
  },
  largeText: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  controlPanel: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    marginBottom: 20,
    gap: 10,
  },
  todoPreview: {
    fontSize: 14,
    paddingVertical: 2,
    flex: 1,
  },
  todoPreviewItem: {
    paddingVertical: 4,
    paddingHorizontal: 4,
    borderRadius: 4,
  },
  todoPreviewContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
    paddingVertical: 20,
    fontStyle: 'italic',
  },
  deleteButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#ff5252',
    alignItems: 'center',
    justifyContent: 'center',
  },
  deleteButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
})