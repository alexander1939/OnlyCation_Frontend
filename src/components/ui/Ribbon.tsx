import React, { useRef, useLayoutEffect } from "react";

interface RibbonProps {
  text: string;
  backgroundColor?: string;   // e.g. '#68B2C9'
  textColor?: string;         // e.g. 'white'
  fontSize?: string;          // e.g. '14px' or '0.875rem'
  padding?: string;           // e.g. '6px 18px' (vertical horizontal)
  className?: string;
  ariaLabel?: string;
}

const Ribbon: React.FC<RibbonProps> = ({
  text,
  backgroundColor = "#68B2C9",
  textColor = "white",
  fontSize = "14px",
  padding = "6px 18px", // reducido para que no parezca botón
  className = "",
  ariaLabel,
}) => {
  const ref = useRef<HTMLSpanElement | null>(null);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Actualiza --notch basado en la altura actual del elemento
    const updateNotch = () => {
      // clientHeight incluye paddings; es la altura real usada en pantalla
      const height = el.clientHeight || 0;
      // notch proporcional a la altura (ajusta factor 0.55 según quieras más o menos punta)
      const notch = Math.max(8, Math.round(height * 0.55));
      el.style.setProperty("--notch", `${notch}px`);
    };

    updateNotch();

    // Observador para reaccionar si cambia el contenido o el tamaño (ej. responsive)
    let ro: ResizeObserver | null = null;
    if (typeof ResizeObserver !== "undefined") {
      ro = new ResizeObserver(updateNotch);
      ro.observe(el);
    } else {
      // Fallback simple
      window.addEventListener("resize", updateNotch);
    }

    return () => {
      if (ro) ro.disconnect();
      else window.removeEventListener("resize", updateNotch);
    };
  }, [text, fontSize, padding]);

  return (
    <span
      ref={ref}
      role="img"
      aria-label={ariaLabel || text}
      className={className}
      style={{
        display: "inline-block",
        position: "relative",
        padding,
        backgroundColor,
        color: textColor,
        fontSize,
        fontWeight: 600,
        textTransform: "uppercase",
        letterSpacing: "1px",
        whiteSpace: "nowrap",
        lineHeight: 1, // evita alturas extra
        // clip-path usa la variable --notch (calculada en runtime)
        clipPath:
          "polygon(0 0, calc(100% - var(--notch)) 0, 100% 50%, calc(100% - var(--notch)) 100%, 0 100%)",
        WebkitClipPath:
          "polygon(0 0, calc(100% - var(--notch)) 0, 100% 50%, calc(100% - var(--notch)) 100%, 0 100%)",
      }}
    >
      {text}
    </span>
  );
};

export default Ribbon;
