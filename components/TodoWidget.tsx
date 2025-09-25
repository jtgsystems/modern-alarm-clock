"use client"

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { useDynamicTheme } from "./DynamicThemeProvider"
import { Trash2 } from "lucide-react"

interface Todo {
  id: string
  text: string
  completed: boolean
}

export default function TodoWidget() {
  const [todos, setTodos] = useState<Todo[]>([])
  const [inputValue, setInputValue] = useState("")
  const { currentTheme } = useDynamicTheme()

  useEffect(() => {
    const saved = localStorage.getItem("modern-alarm-todos")
    if (saved) {
      setTodos(JSON.parse(saved))
    }
  }, [])

  useEffect(() => {
    localStorage.setItem("modern-alarm-todos", JSON.stringify(todos))
  }, [todos])

  const addTodo = () => {
    if (inputValue.trim()) {
      setTodos([...todos, { id: Date.now().toString(), text: inputValue.trim(), completed: false }])
      setInputValue("")
    }
  }

  const toggleTodo = (id: string) => {
    setTodos(todos.map(todo => todo.id === id ? { ...todo, completed: !todo.completed } : todo))
  }

  const removeTodo = (id: string) => {
    setTodos(todos.filter(todo => todo.id !== id))
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      addTodo()
    }
  }

  return (
    <div className={`rounded-2xl border border-border/10 ${currentTheme.colors.primary} backdrop-blur-xl shadow-[0_16px_40px_rgba(0,0,0,0.35)] overflow-hidden`}>
      <div className="p-4 sm:p-5 space-y-4">
        <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-foreground/50 flex items-center gap-2">
          Tasks
        </h3>
        <div className="flex gap-2" role="group" aria-label="Add new task">
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Add task..."
            className="flex-1 bg-foreground/5 border-border/10 text-foreground/80 placeholder:text-foreground/40 focus:border-cyan-400/50 focus:ring-cyan-400/20"
            aria-label="New task input"
          />
          <Button
            onClick={addTodo}
            variant="outline"
            size="sm"
            className="bg-foreground/5 hover:bg-foreground/10 border-border/10 text-foreground/80 hover:text-foreground h-10 w-10 p-0"
            aria-label="Add task"
          >
            +
          </Button>
        </div>
        <ul role="list" aria-label="Todo list" className="space-y-2 max-h-48 overflow-y-auto">
          {todos.length === 0 ? (
            <li className="text-center text-foreground/40 py-4 text-sm">No tasks yet</li>
          ) : (
            todos.map((todo) => (
              <li
                key={todo.id}
                className={`flex items-center gap-3 p-3 rounded-lg bg-foreground/5 border border-border/10 transition-colors hover:bg-foreground/10 focus-within:bg-foreground/10 focus-within:ring-2 focus-within:ring-cyan-400/30 ${todo.completed ? 'opacity-60' : ''}`}
                role="listitem"
                tabIndex={0}
                aria-label={`${todo.completed ? 'Completed' : 'Incomplete'} task: ${todo.text}`}
              >
                <Checkbox
                  checked={todo.completed}
                  onCheckedChange={() => toggleTodo(todo.id)}
                  id={`todo-${todo.id}`}
                  className="data-[state=checked]:bg-cyan-400 data-[state=checked]:border-cyan-400"
                  aria-label={`Toggle ${todo.text}`}
                />
                <label
                  htmlFor={`todo-${todo.id}`}
                  className={`flex-1 cursor-pointer text-sm ${todo.completed ? 'line-through text-foreground/60' : 'text-foreground'}`}
                >
                  {todo.text}
                </label>
                <Button
                  onClick={() => removeTodo(todo.id)}
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0 text-foreground/60 hover:text-foreground hover:bg-foreground/10 rounded-full"
                  aria-label={`Delete ${todo.text}`}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </li>
            ))
          )}
        </ul>
        {todos.length > 0 && (
          <div className="text-xs text-foreground/40 text-center">
            {todos.filter(t => !t.completed).length} remaining
          </div>
        )}
      </div>
    </div>
  )
}
