import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'

import Home from './pages/Home'
import Login from './pages/Login'
import EmailLogin from './pages/EmailLogin'
import Register from './pages/Register'
import VerifyOTP from './pages/VerifyOTP'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/login/email" element={<EmailLogin />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login/verify-otp" element={<VerifyOTP />} />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App