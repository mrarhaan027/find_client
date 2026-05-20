import React from 'react'
import { Routes, Route } from 'react-router-dom'
import LeadManagementDashboard from './Pages/LeadManagementDashboard'
import Signin from './Pages/Signin'
import Signup from './Pages/Signup'
import { AuthProvider } from './Context/AuthContext'
import ProtectedRoute from './Components/Auth/ProtectedRoute'

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/signin" element={<Signin />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/*" element={
          <ProtectedRoute>
            <LeadManagementDashboard />
          </ProtectedRoute>
        } />
      </Routes>
    </AuthProvider>
  )
}

export default App
