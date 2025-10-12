import React, { useState } from "react";
import ButtonLogin from "../../components/ButtonLogin";
import PasswordInput from "../../components/PasswordInput";

interface Props {
  onSubmit: (email: string, password: string) => void;
  isLoading?: boolean;
}

const LoginForm: React.FC<Props> = ({ onSubmit, isLoading = false }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(email, password);
  };

  return (
    <form onSubmit={handleSubmit} className="animate-card">
      <div className="flex flex-col mb-4">
        <label className="block text-[0.9rem] font-medium text-gray-900 mb-1">
          Email
        </label>
        <input
          type="email"
          className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-blue transition"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="tu@email.com"
          required
        />
      </div>

      <div className="flex flex-col mb-6">
        <label className="block text-[0.9rem] font-medium text-gray-900 mb-1">
          Contraseña
        </label>
        <PasswordInput
          value={password}
          onChange={setPassword}
          placeholder="••••••••"
          required
        />
      </div>

      <ButtonLogin type="submit" disabled={isLoading}>
        {isLoading ? "Ingresando..." : "Iniciar sesión"}
      </ButtonLogin>
    </form>
  );
};

export default LoginForm;
