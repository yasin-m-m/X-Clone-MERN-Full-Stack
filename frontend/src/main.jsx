import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { BrowserRouter } from 'react-router-dom'
import {
  QueryClient,
  QueryClientProvider,
  useQuery,
} from '@tanstack/react-query'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      refetchInterval: 0,
    },
  },
})

createRoot(document.getElementById('root')).render(
  <StrictMode>
  <BrowserRouter>
  <QueryClientProvider client={queryClient}>
    <App />
  </QueryClientProvider>
  </BrowserRouter>
  </StrictMode>,
)
