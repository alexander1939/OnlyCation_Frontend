import { useState } from "react";
import { usePasswordReset } from "../../hooks/usePasswordReset";
import ValidateCode from "./ValidateCode";

export default function ResetPassword() {
  const { changePasswordWithCode } = usePasswordReset();
  const [step, setStep] = useState<"validate" | "reset">("validate");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleCodeValidated = (validatedEmail: string, validatedCode: string) => {
    setEmail(validatedEmail);
    setCode(validatedCode);
    setStep("reset");
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const result = await changePasswordWithCode(email, code, newPassword);
      setMessage(result.message);
    } catch (error: any) {
      setMessage("❌ Error al cambiar la contraseña");
    } finally {
      setIsLoading(false);
    }
  };

  if (step === "validate") {
    return <ValidateCode onCodeValidated={handleCodeValidated} />;
  }

  return (
    <div>
      <h2>Establecer Nueva Contraseña</h2>
      <p>Para: {email}</p>
      
      <form onSubmit={handlePasswordSubmit}>
        <input
          type="password"
          placeholder="Nueva contraseña"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
        />
        <button type="submit" disabled={isLoading}>
          {isLoading ? "Actualizando..." : "Actualizar Contraseña"}
        </button>
      </form>
      
      {message && <p>{message}</p>}
      
      <button 
        type="button" 
        onClick={() => setStep("validate")}
        style={{ marginTop: '1rem' }}
      >
        ← Volver a validar código
      </button>
    </div>
  );
}