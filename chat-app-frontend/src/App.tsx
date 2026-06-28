import './App.css'
import { Route, BrowserRouter, Routes } from 'react-router-dom';
import AuthPage from './pages/AuthPage.tsx';
import ChatPage from './pages/ChatPage.tsx';

function App() {

  

  return (
    <BrowserRouter>
    <Routes>
      <Route path="/auth" element={<AuthPage />} />
      <Route path="/chat" element={<ChatPage />} />
    </Routes>
  </BrowserRouter>
  );
}

export default App
