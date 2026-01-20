import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import MyApp from './my-app'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <MyApp />
  </StrictMode>,
)
