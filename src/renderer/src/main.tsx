import './assets/main.css'

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router'
import Chat from './pages/chat'
import DatabaseConnection from './pages/database-connection'
import DatabaseModelDetection from './pages/database-model-detection'
import Settings from './pages/settings'
import ChatLayout from './layout/chat-layout'

const root = createRoot(document.getElementById('root')!)

root.render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<ChatLayout />}>
          <Route index element={<Chat />} />
          <Route path="database-connection" element={<DatabaseConnection />} />
          <Route path="database-model-detection" element={<DatabaseModelDetection />} />
          <Route path="settings" element={<Settings />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>
)
