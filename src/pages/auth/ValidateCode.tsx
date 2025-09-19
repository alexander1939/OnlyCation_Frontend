import { useState } from "react";
import { usePasswordReset } from "../../hooks/usePasswordReset";

interface ValidateCodeProps {
  onCodeValidated: (email: string, code: string) => void;
}

export default function ValidateCode({ onCodeValidated }: ValidateCodeProps) {
  const { validateCode } = usePasswordReset();
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage("");
    
    try {
      const result = await validateCode(email, code);
      if (result.success && result.validated) {
        setMessage("✅ Código validado correctamente");
        onCodeValidated(email, code);
      } else {
        setMessage(`❌ ${result.message}`);
      }
    } catch (error: any) {
      setMessage("❌ Error al validar el código");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <h2>Validar Código de Verificación</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Correo electrónico"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Código de verificación"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          required
        />
        <button type="submit" disabled={isLoading}>
          {isLoading ? "Validando..." : "Validar Código"}
        </button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}