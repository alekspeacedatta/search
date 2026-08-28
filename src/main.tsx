import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Search } from './features/search'
import './index.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Search/>
  </StrictMode>,
)
