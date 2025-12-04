'use client'

import { useToast } from '@/components/ui/use-toast'
import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from '@/components/ui/toast'
import { AlertCircle, CheckCircle2 } from 'lucide-react'

export function Toaster() {
  const { toasts } = useToast()

  return (
    <ToastProvider>
      {toasts.map(function ({ id, title, description, action, ...props }) {
        return (
          <Toast
            key={id}
            {...props}
            className={`${props?.variant === 'destructive' ? 'border-rose-200' : 'border-emerald-200'} bg-white shadow-xl rounded-xl`}
          >
            <div className={`${props?.variant === 'destructive' ? 'bg-rose-50' : 'bg-emerald-50'} flex items-start gap-3 p-4 rounded-lg`}>
              <div className={`w-8 h-8 rounded-md flex items-center justify-center ${props?.variant === 'destructive' ? 'bg-rose-200 text-rose-700' : 'bg-emerald-200 text-emerald-700'}`}>
                {props?.variant === 'destructive' ? (
                  <AlertCircle className="h-4 w-4" />
                ) : (
                  <CheckCircle2 className="h-4 w-4" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                {title && <div className="text-sm font-semibold text-slate-900 truncate">{title}</div>}
                {description && <div className="text-xs text-slate-700 mt-0.5">{description}</div>}
              </div>
              {action}
              <ToastClose />
            </div>
          </Toast>
        )
      })}
      <ToastViewport />
    </ToastProvider>
  )
}
