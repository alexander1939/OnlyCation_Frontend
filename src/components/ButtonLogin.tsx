import React from "react";

interface ButtonLoginProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

const ButtonLogin: React.FC<ButtonLoginProps> = ({ children, ...props }) => {
  return (
    <button
      {...props}
      className="w-full px-4 py-2 rounded-xl font-semibold text-white transition-colors
                 disabled:opacity-60 disabled:cursor-not-allowed
                 bg-[#8ED4BE] hover:bg-[#75c3a8] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#8ED4BE]"
    >
      {children}
    </button>
  );
};

export default ButtonLogin;
