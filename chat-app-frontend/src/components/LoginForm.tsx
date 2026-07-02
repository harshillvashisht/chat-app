import { useState } from 'react';
import { login } from '../services/authApi'
import { useNavigate } from 'react-router-dom';
import { socket } from '../socket/socket';

export default function LoginForm() {
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();
         

        try {
            
            await login(email, password);


            socket.connect();


            navigate("/chat");
        }
        catch (error) {
            console.error("Error:", error);
        }
    }


  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-4"
    >
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        className="rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-blue-500"
      />

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
        minLength={8}
        className="rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-blue-500"
      />

      <button
        type="submit"
        className="rounded-lg bg-blue-600 py-3 font-medium text-white transition hover:bg-blue-700"
      >
        Login
      </button>
    </form>
  );
}