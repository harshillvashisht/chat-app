import { useState } from "react";
import LoginForm from "../components/LoginForm";
import RegisterForm from "../components/RegisterForm";

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);

  const handleRegisterSuccess = () => {
    setIsLogin(true);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md rounded-xl bg-white p-8 shadow-lg">
        <h1 className="mb-6 text-center text-3xl font-bold">
          Chat App
        </h1>

        <div className="mb-6 flex rounded-lg bg-gray-200 p-1">
          <button
            onClick={() => setIsLogin(true)}
            className={`flex-1 rounded-md py-2 font-medium transition ${
              isLogin
                ? "bg-blue-600 text-white"
                : "text-gray-700 hover:bg-gray-300"
            }`}
          >
            Login
          </button>

          <button
            onClick={() => setIsLogin(false)}
            className={`flex-1 rounded-md py-2 font-medium transition ${
              !isLogin
                ? "bg-blue-600 text-white"
                : "text-gray-700 hover:bg-gray-300"
            }`}
          >
            Register
          </button>
        </div>

        {isLogin ? <LoginForm /> : <RegisterForm onRegisterSuccess={handleRegisterSuccess} />}
      </div>
    </div>
  );
}