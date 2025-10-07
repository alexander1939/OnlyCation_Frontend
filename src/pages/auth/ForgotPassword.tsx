import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { usePasswordReset } from "../../hooks/auth/usePasswordReset";
import "../../styles/Auth.css";

export default function ForgotPassword() {
  const { requestPasswordReset } = usePasswordReset();
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [msgVariant, setMsgVariant] = useState<"success" | "error" | "info">("info");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMsgVariant("info");
    const res = await requestPasswordReset(email);
    setMessage(res.message);
    setMsgVariant(res.success ? "success" : "error");
    if (res.success) {
      // Redirigir a la vista de validación/cambio de contraseña con el email
      // Asegurar que no quede un código previo almacenado que salte la verificación
      try {
        sessionStorage.setItem("pr_email", email);
        sessionStorage.removeItem("pr_code");
      } catch (_) {}
      navigate("/reset-password", { state: { email } });
    }
    setIsLoading(false);
  };

  return (
    <div className="page">
      <main className="page__main--compact">
        <div className="container container--wide">
          <div className="card card--xl">
            <img src="/Envio_correo.png" alt="Enviar código por correo" className="illustration illustration--hero" />
            <h2 className="title title--lg">Recuperar contraseña</h2>
            <p className="subtitle">Ingresa tu correo y te enviaremos un código de verificación.</p>

            <form onSubmit={handleSubmit} className="form">
              <label className="label">Correo electrónico</label>
              <input
                type="email"
                placeholder="tu@correo.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="input"
              />
              <button type="submit" disabled={isLoading} className="btn btn--brand">
                {isLoading ? "Enviando..." : "Enviar código"}
              </button>
            </form>

            {message && (
              <div className={`msg ${msgVariant === "success" ? "msg--success" : msgVariant === "error" ? "msg--error" : "msg--info"}`}>
                {message}
              </div>
            )}

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
