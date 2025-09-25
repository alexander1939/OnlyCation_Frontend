import React, { useState } from "react";
import ButtonLogin from "../../components/ButtonLogin";


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
    <form className="animate-card" onSubmit={handleSubmit}>
      <div className="flex flex-col mb-4">
        <label className="block text-sm font-medium text-petroleum-blue mb-1">
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
        <label className="block text-sm font-medium text-petroleum-blue mb-1">
          Contraseña
        </label>
        <input
          type="password"
          className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-blue transition"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
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
