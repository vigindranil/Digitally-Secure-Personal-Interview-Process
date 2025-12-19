'use client'

// Inspired by react-hot-toast + shadcn/ui
import * as React from 'react'
import type { ToastActionElement, ToastProps } from '@/components/ui/toast'

/* ------------------ CONFIG ------------------ */

const TOAST_LIMIT = 1
const TOAST_AUTO_DISMISS = 3000 // 3s (much better UX)

/* ------------------ TYPES ------------------ */

type ToasterToast = ToastProps & {
  id: string
  title?: React.ReactNode
  description?: React.ReactNode
  action?: ToastActionElement
}

interface State {
  toasts: ToasterToast[]
}

type Action =
  | { type: 'ADD_TOAST'; toast: ToasterToast }
  | { type: 'UPDATE_TOAST'; toast: Partial<ToasterToast> & { id: string } }
  | { type: 'DISMISS_TOAST'; toastId?: string }
  | { type: 'REMOVE_TOAST'; toastId?: string }

/* ------------------ INTERNAL STATE ------------------ */

let toastCount = 0
const listeners: Array<(state: State) => void> = []
let memoryState: State = { toasts: [] }
const toastTimeouts = new Map<string, ReturnType<typeof setTimeout>>()

/* ------------------ HELPERS ------------------ */

function genId() {
  toastCount = (toastCount + 1) % Number.MAX_SAFE_INTEGER
  return toastCount.toString()
}

function notify() {
  listeners.forEach((l) => l(memoryState))
}

function scheduleRemove(id: string) {
  if (toastTimeouts.has(id)) return

  const timeout = setTimeout(() => {
    toastTimeouts.delete(id)
    dispatch({ type: 'REMOVE_TOAST', toastId: id })
  }, TOAST_AUTO_DISMISS)

  toastTimeouts.set(id, timeout)
}

/* ------------------ REDUCER ------------------ */

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'ADD_TOAST':
      return {
        toasts: [action.toast, ...state.toasts].slice(0, TOAST_LIMIT),
      }

    case 'UPDATE_TOAST':
      return {
        toasts: state.toasts.map((t) =>
          t.id === action.toast.id ? { ...t, ...action.toast } : t
        ),
      }

    case 'DISMISS_TOAST': {
      const ids = action.toastId
        ? [action.toastId]
        : state.toasts.map((t) => t.id)

      ids.forEach(scheduleRemove)

      return {
        toasts: state.toasts.map((t) =>
          !action.toastId || t.id === action.toastId
            ? { ...t, open: false }
            : t
        ),
      }
    }

    case 'REMOVE_TOAST':
      return {
        toasts: action.toastId
          ? state.toasts.filter((t) => t.id !== action.toastId)
          : [],
      }

    default:
      return state
  }
}

/* ------------------ DISPATCH ------------------ */

function dispatch(action: Action) {
  memoryState = reducer(memoryState, action)
  notify()
}

/* ------------------ PUBLIC API ------------------ */

type ToastInput = Omit<ToasterToast, 'id' | 'open'>

function toast(props: ToastInput) {
  const id = genId()

  dispatch({
    type: 'ADD_TOAST',
    toast: {
      ...props,
      id,
      open: true,
      onOpenChange(open) {
        if (!open) dispatch({ type: 'DISMISS_TOAST', toastId: id })
      },
    },
  })

  return {
    id,
    dismiss: () => dispatch({ type: 'DISMISS_TOAST', toastId: id }),
    update: (data: Partial<ToasterToast>) =>
      dispatch({ type: 'UPDATE_TOAST', toast: { ...data, id } }),
  }
}

function useToast() {
  const [state, setState] = React.useState<State>(memoryState)

  React.useEffect(() => {
    listeners.push(setState)
    return () => {
      const index = listeners.indexOf(setState)
      if (index > -1) listeners.splice(index, 1)
    }
  }, []) // ✅ FIXED: no `state` dependency

  return {
    ...state,
    toast,
    dismiss: (toastId?: string) =>
      dispatch({ type: 'DISMISS_TOAST', toastId }),
  }
}

export { useToast, toast }
