import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import {
  createBrowserRouter,
  RouterProvider,
} from 'react-router-dom'

import './styles.css'

import App from './App'
import { ToastViewport } from './components/ui/ToastViewport'
import { AuthProvider } from './context/AuthContext'
import { ToastProvider } from './context/ToastContext'

const router =
  createBrowserRouter([
    {
      path: '*',

      element: (
        <ToastProvider>
          <AuthProvider>
            <App />

            <ToastViewport />
          </AuthProvider>
        </ToastProvider>
      ),
    },
  ])

createRoot(
  document.getElementById(
    'root',
  )!,
).render(
  <StrictMode>
    <RouterProvider
      router={router}
    />
  </StrictMode>,
)