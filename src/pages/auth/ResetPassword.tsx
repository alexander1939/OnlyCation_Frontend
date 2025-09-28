import { useEffect, useState } from "react";
import { usePasswordReset } from "../../hooks/usePasswordReset";
import ValidateCode from "./ValidateCode";
import { useLocation, useNavigate } from "react-router-dom";
import "../../styles/Auth.css";

export default function ResetPassword() {
  const { changePasswordWithCode } = usePasswordReset();
  const [step, setStep] = useState<"validate" | "reset">("validate");
  const location = useLocation();
  const navigate = useNavigate();
  const prefilledEmail = (location as any)?.state?.email as string | undefined;
  const [email, setEmail] = useState(prefilledEmail ?? "");
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Hidratar desde sessionStorage si existe (soporta refresh de página)
  useEffect(() => {
    try {
      const storedEmail = sessionStorage.getItem("pr_email") || "";
      const storedCode = sessionStorage.getItem("pr_code") || "";
      if (!email && storedEmail) setEmail(storedEmail);
      if (storedCode) {
        setCode(storedCode);
        setStep("reset");
      }
    } catch (_) {
      // Ignorar errores de acceso a sessionStorage
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleCodeValidated = (validatedEmail: string, validatedCode: string) => {
    setEmail(validatedEmail);
    setCode(validatedCode);
    setStep("reset");
    // Persistir en sessionStorage
    try {
      sessionStorage.setItem("pr_email", validatedEmail);
      sessionStorage.setItem("pr_code", validatedCode);
    } catch (_) {
      // Ignorar si el navegador bloquea storage
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    if (newPassword !== confirmPassword) {
      setMessage("❌ Las contraseñas no coinciden");
      setIsLoading(false);
      return;
    }

    try {
      const result = await changePasswordWithCode(email, code, newPassword);
      setMessage(result.message);
      if (result.success && result.password_changed) {
        // Limpiar sessionStorage al completar
        try {
          sessionStorage.removeItem("pr_email");
          sessionStorage.removeItem("pr_code");
        } catch (_) {}
        // Opcional: redirigir al login tras cambiar la contraseña
        setTimeout(() => navigate("/login"), 1200);
      }
    } catch (error: any) {
      setMessage("❌ Error al cambiar la contraseña");
    } finally {
      setIsLoading(false);
    }
  };

  if (step === "validate") {
    return (
      <div className="page">
        <main className="page__main--compact">
          <div className="container container--wide">
            <div className="card">
              <img src="/Codigo.png" alt="Validar código" className="illustration illustration--xl" />
              <h1 className="brand">Only<span className="brand__accent">Cation</span></h1>
              <h2 className="title">Validar Código de Verificación</h2>
              <p className="subtitle">Revisa tu correo y escribe el código que te enviamos.</p>
              <ValidateCode onCodeValidated={handleCodeValidated} initialEmail={email} />
              <div className="center" style={{ marginTop: 20 }}>
                <button type="button" onClick={() => navigate("/")} className="link">
                  Volver al inicio
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="page">
      <main className="page__main--compact">
        <div className="container container--wide">
          <div className="card">
            <img src="/Cambio_contraseña.png" alt="Cambiar contraseña" className="illustration illustration--xl" />
            <h2 className="title">Establecer Nueva Contraseña</h2>
            <p className="subtitle">Para: <strong>{email}</strong></p>

            <form onSubmit={handlePasswordSubmit} className="form">
              <label className="label">Nueva contraseña</label>
              <input
                type="password"
                placeholder="••••••••"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                className="input"
              />
              <label className="label">Confirmar contraseña</label>
              <input
                type="password"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="input"
              />
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
                    navigate("/");
                  }}
                >
                  CANCELAR
                </button>
              </div>
            </form>

            {message && (
              <div className={`msg ${message.startsWith("✅") ? "msg--success" : message.startsWith("❌") ? "msg--error" : "msg--info"}`}>
                {message}
              </div>
            )}

            <div className="center" style={{ marginTop: 20 }}>
              <button
                type="button"
                onClick={() => {
                  try {
                    sessionStorage.removeItem("pr_email");
                    sessionStorage.removeItem("pr_code");
                  } catch (_) {}
                  navigate("/");
                }}
                className="link"
              >
                Ir al inicio
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}