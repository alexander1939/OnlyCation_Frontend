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
  const [emailError, setEmailError] = useState<string>("");
  const [passwordError, setPasswordError] = useState<string>("");

  const validateEmail = (value: string) => {
    if (!value) return "El correo es obligatorio";
    const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!pattern.test(value)) return "Formato de correo inválido";
    return "";
  };

  const validatePassword = (value: string) => {
    if (!value) return "La contraseña es obligatoria";
    if (value.length < 8) return "La contraseña debe tener al menos 8 caracteres";
    return "";
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const emailErr = validateEmail(email);
    const passErr = validatePassword(password);
    setEmailError(emailErr);
    setPasswordError(passErr);
    if (emailErr || passErr) return;
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
          className={`w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 transition ${
            emailError ? "border-red-500 focus:ring-red-300" : "border-gray-300 focus:ring-sky-blue"
          }`}
          value={email}
          onChange={(e) => {
            const val = e.target.value;
            setEmail(val);
            if (emailError) setEmailError(validateEmail(val));
          }}
          onBlur={() => setEmailError(validateEmail(email))}
          placeholder="tu@email.com"
          required
        />
        {emailError && (
          <p className="text-red-500 text-xs mt-1">{emailError}</p>
        )}
      </div>

      <div className="flex flex-col mb-6">
        <label className="block text-[0.9rem] font-medium text-gray-900 mb-1">
          Contraseña
        </label>
        <PasswordInput
          value={password}
          onChange={(val) => {
            setPassword(val);
            if (passwordError) setPasswordError(validatePassword(val));
          }}
          placeholder="••••••••"
          required
          error={passwordError}
        />
        {/* Forzado de validación al salir del campo via onBlur es manejado en PasswordInput con cambios; aquí lo disparamos con submit y onChange */}
      </div>

      <ButtonLogin type="submit" disabled={isLoading}>
        {isLoading ? "Ingresando..." : "Iniciar sesión"}
      </ButtonLogin>
    </form>
  );
};

export default LoginForm;
