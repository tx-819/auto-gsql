import './assets/main.css'

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router'
import Chat from './pages/chat'
import DatabaseConnection from './pages/database-connection'
import DatabaseModelDetection from './pages/database-model-detection'
import Settings from './pages/settings'
import Login from './pages/login'
import Register from './pages/register'
import ChatLayout from './layout/chat-layout'
import AuthGuard from './components/AuthGuard'

const root = createRoot(document.getElementById('root')!)

root.render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        {/* 登录和注册页面 - 不需要认证 */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* 需要认证的路由 */}
        <Route
          path="/*"
          element={
            <AuthGuard>
              <ChatLayout />
            </AuthGuard>
          }
        >
          <Route index element={<Chat />} />
          <Route path="database-connection" element={<DatabaseConnection />} />
          <Route path="database-model-detection" element={<DatabaseModelDetection />} />
          <Route path="settings" element={<Settings />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>
)
