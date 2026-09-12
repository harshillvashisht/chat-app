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
      <div className="flex flex-col gap-1">
        <label className="text-[11px] text-[#5a5e66]">Username</label>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          className="rounded-md border border-[#1f2530] bg-[#0d1117] px-2.5 py-2.25 text-[13px] text-[#e8e8e6] outline-none transition placeholder:text-[#5a5e66] focus:border-[#2dd4bf] focus:ring-0"
        />
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-[11px] text-[#5a5e66]">Email</label>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="rounded-md border border-[#1f2530] bg-[#0d1117] px-2.5 py-2.25 text-[13px] text-[#e8e8e6] outline-none transition placeholder:text-[#5a5e66] focus:border-[#2dd4bf] focus:ring-0"
        />
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-[11px] text-[#5a5e66]">Password</label>
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          minLength={8}
          className="rounded-md border border-[#1f2530] bg-[#0d1117] px-2.5 py-2.25 text-[13px] text-[#e8e8e6] outline-none transition placeholder:text-[#5a5e66] focus:border-[#2dd4bf] focus:ring-0"
        />
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-[11px] text-[#5a5e66]">Confirm Password</label>
        <input
          type="password"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
          minLength={8}
          className="rounded-md border border-[#1f2530] bg-[#0d1117] px-2.5 py-2.25 text-[13px] text-[#e8e8e6] outline-none transition placeholder:text-[#5a5e66] focus:border-[#2dd4bf] focus:ring-0"
        />
      </div>

      <button
        type="submit"
        className="w-full rounded-md bg-[#12332e] p-2.5 text-[13px] font-medium text-[#2dd4bf] transition hover:bg-[#1a3d3a]"
      >
        Register
      </button>
    </form>
  );
}