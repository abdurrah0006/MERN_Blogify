import Logo from "./Logo";
import Avatar from "./Avatar";
import { DOODLE_IDS } from "../data/doodles";
import useTitle from "../hooks/useTitle";

export default function AuthLayout({ pageTitle, headline, blurb, title, subtitle, footer, children }) {
  useTitle(pageTitle);

  return (
    <div className="auth">
      <aside className="auth-aside">
        <Logo inverse />

        <div>
          <h1>{headline}</h1>
          <p>{blurb}</p>
        </div>

        <div className="auth-doodles" aria-hidden="true">
          {DOODLE_IDS.slice(0, 8).map((id) => (
            <Avatar key={id} id={id} size={84} />
          ))}
        </div>
      </aside>

      <main className="auth-main">
        <div className="auth-card">
          <div className="auth-mobile-logo">
            <Logo />
          </div>
          <h2>{title}</h2>
          <p className="auth-subtitle">{subtitle}</p>
          {children}
          <p className="auth-footer">{footer}</p>
        </div>
      </main>
    </div>
  );
}
