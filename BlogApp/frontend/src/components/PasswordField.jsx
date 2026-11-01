import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

export default function PasswordField({ label = "Password", autoComplete, ...props }) {
  const [visible, setVisible] = useState(false);

  return (
    <div className="field">
      <label htmlFor={props.id || "password"}>{label}</label>
      <div className="input-wrap">
        <input
          id="password"
          className="input"
          type={visible ? "text" : "password"}
          autoComplete={autoComplete}
          {...props}
        />
        <button
          type="button"
          className="input-action"
          onClick={() => setVisible((v) => !v)}
          aria-label={visible ? "Hide password" : "Show password"}
        >
          {visible ? <EyeOff size={20} /> : <Eye size={20} />}
        </button>
      </div>
    </div>
  );
}
