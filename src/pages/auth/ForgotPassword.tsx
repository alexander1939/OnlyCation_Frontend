import { useState } from "react";
import { usePasswordReset } from "../../hooks/usePasswordReset";

export default function ForgotPassword() {
  const { requestPasswordReset } = usePasswordReset();
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await requestPasswordReset(email);
    setMessage(res.message);
  };

  return (
    <div>
      <h2>Recuperar contraseña</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Ingresa tu correo"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <button type="submit">Enviar código</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}
