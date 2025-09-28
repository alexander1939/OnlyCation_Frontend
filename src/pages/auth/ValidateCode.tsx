import { useState } from "react";
import { usePasswordReset } from "../../hooks/usePasswordReset";
import "../../styles/Auth.css";

interface ValidateCodeProps {
  onCodeValidated: (email: string, code: string) => void;
  initialEmail?: string;
}

export default function ValidateCode({ onCodeValidated, initialEmail }: ValidateCodeProps) {
  const { checkVerificationCode, requestPasswordReset } = usePasswordReset();
  const [email] = useState(initialEmail ?? "");
  const [otp, setOtp] = useState<string[]>(Array(6).fill(""));
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage("");
    
    const code = otp.join("");
    try {
      // Validar únicamente el código contra el endpoint dedicado
      const result = await checkVerificationCode(code);
      // Avanzar si el backend indica que el código está activo/validado
      if (result.validated) {
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

  const handleResendCode = async () => {
    if (!email) {
      setMessage("❌ No hay correo asociado a la recuperación");
      return;
    }
    setIsResending(true);
    setMessage("");
    try {
      // Si existía un código previamente validado, limpiarlo para no saltar al paso de cambio de contraseña
      try {
        sessionStorage.removeItem("pr_code");
      } catch (_) {}
      const res = await requestPasswordReset(email);
      setMessage(res.success ? `✅ ${res.message}` : `❌ ${res.message}`);
    } catch (error: any) {
      setMessage("❌ Error al reenviar el código");
    } finally {
      setIsResending(false);
    }
  };


  const handleOtpChange = (index: number, val: string) => {
    const newVal = val.replace(/\D/g, "").slice(0, 1);
    const next = [...otp];
    next[index] = newVal;
    setOtp(next);

    if (newVal && index < otp.length - 1) {
      const nextInput = document.getElementById(`otp-${index + 1}`) as HTMLInputElement | null;
      nextInput?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`) as HTMLInputElement | null;
      prevInput?.focus();
    }
    if (e.key === "ArrowLeft" && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`) as HTMLInputElement | null;
      prevInput?.focus();
    }
    if (e.key === "ArrowRight" && index < otp.length - 1) {
      const nextInput = document.getElementById(`otp-${index + 1}`) as HTMLInputElement | null;
      nextInput?.focus();
    }
  };

  // Permitir pegar el código completo (6 dígitos) en la primera celda o en cualquier celda
  const handleOtpPaste = (index: number, e: React.ClipboardEvent<HTMLInputElement>) => {
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "");
    if (!pasted) return;
    e.preventDefault();
    const chars = pasted.slice(0, otp.length - index).split("");
    const next = [...otp];
    for (let i = 0; i < chars.length; i++) {
      next[index + i] = chars[i];
    }
    setOtp(next);
    const focusTo = Math.min(index + chars.length, otp.length - 1);
    const target = document.getElementById(`otp-${focusTo}`) as HTMLInputElement | null;
    target?.focus();
  };

  return (
    <div>
      <form onSubmit={handleSubmit} className="form">
        <div className="otp">
          {otp.map((v, idx) => (
            <input
              key={idx}
              id={`otp-${idx}`}
              className="otp__input"
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength={1}
              value={v}
              onChange={(e) => handleOtpChange(idx, e.target.value)}
              onKeyDown={(e) => handleOtpKeyDown(idx, e)}
              onPaste={(e) => handleOtpPaste(idx, e)}
            />
          ))}
        </div>

        <div className="actions">
          <button type="submit" disabled={isLoading} className="btn btn--success">
            {isLoading ? "Validando..." : "CONTINUAR"}
          </button>
          <button
            type="button"
            className="btn btn--secondary"
            onClick={() => {
              try {
                sessionStorage.removeItem("pr_email");
                sessionStorage.removeItem("pr_code");
              } catch (_) {}
              // Volver a inicio
              window.location.href = "/";
            }}
          >
            CANCELAR
          </button>
        </div>

        <button
          type="button"
          onClick={handleResendCode}
          disabled={isResending}
          className="btn btn--outline-brand"
        >
          {isResending ? "Reenviando..." : "Reenviar código"}
        </button>
      </form>

      {message && (
        <div className={`msg ${message.startsWith("✅") ? "msg--success" : message.startsWith("❌") ? "msg--error" : "msg--info"}`}>
          {message}
        </div>
      )}
    </div>
  );
}