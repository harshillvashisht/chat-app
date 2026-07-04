import { Route, BrowserRouter, Routes, Navigate } from 'react-router-dom';
import AuthPage from './pages/AuthPage.tsx';
import ChatPage from './pages/ChatPage.tsx';

function App() {

  

  return (
    <BrowserRouter>
    <Routes>
      <Route path="/" element={<Navigate to="/auth" replace />} />
      <Route path="/auth" element={<AuthPage />} />
      <Route path="/chat" element={<ChatPage />} />
    </Routes>
  </BrowserRouter>
  );
}

export default App
