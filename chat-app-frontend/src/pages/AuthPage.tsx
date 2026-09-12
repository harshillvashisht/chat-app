import { useState } from "react";
import LoginForm from "../components/LoginForm";
import RegisterForm from "../components/RegisterForm";

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);

  const handleRegisterSuccess = () => {
    setIsLogin(true);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0a0d12] px-4">
      <div className="w-[320px] rounded-xl border border-[#1f2530] bg-[#12161d] px-6 py-7">
        <h1 className="mb-6 text-center text-[20px] font-medium text-[#e8e8e6]">
          Chat App
        </h1>

        <div className="mb-6 flex border-b border-[#1f2530]">
          <button
            onClick={() => setIsLogin(true)}
            className={`flex-1 border-b-2 py-2 text-[13px] font-medium transition ${
              isLogin
                ? "border-[#2dd4bf] text-[#2dd4bf]"
                : "border-transparent text-[#5a5e66]"
            }`}
          >
            Login
          </button>

          <button
            onClick={() => setIsLogin(false)}
            className={`flex-1 border-b-2 py-2 text-[13px] font-medium transition ${
              !isLogin
                ? "border-[#2dd4bf] text-[#2dd4bf]"
                : "border-transparent text-[#5a5e66]"
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