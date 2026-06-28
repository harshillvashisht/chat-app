import { useState } from 'react';
import  LoginForm  from '../components/LoginForm.tsx';
import  RegisterForm  from '../components/RegisterForm.tsx';

export default function AuthPage() {

    const [isLogin, setIsLogin] = useState(true);

  return (
    <div>
        <button onClick={() => setIsLogin(true)}>Login</button>
        <button onClick={() => setIsLogin(false)}>Register</button>

        {isLogin ? <LoginForm /> : <RegisterForm />}
    </div>
  );
}