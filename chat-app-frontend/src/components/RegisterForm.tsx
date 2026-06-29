import { useState } from 'react';
import { register } from '../services/authApi.ts';

export default function RegisterForm( { onRegisterSuccess }: { onRegisterSuccess: () => void }) {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();

        try{

            if (password !== confirmPassword) {
                console.error("Passwords do not match");
                return;
            }

            await register(username, email, password);

            onRegisterSuccess(); // Call the callback function after successful registration

        } catch (error) {
            console.error("Error:", error);
        }
    }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-4"
    >
      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        required
        className="rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-blue-500"
      />

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

      <input
        type="password"
        placeholder="Confirm Password"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        required
        minLength={8}
        className="rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-blue-500"
      />

      <button
        type="submit"
        className="rounded-lg bg-blue-600 py-3 font-medium text-white transition hover:bg-blue-700"
      >
        Register
      </button>
    </form>
  );
}