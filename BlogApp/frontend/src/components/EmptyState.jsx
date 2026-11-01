import Doodle from "./Doodle";

export default function EmptyState({ doodle = "ghost", title, text, children }) {
  return (
    <div className="empty">
      <Doodle id={doodle} className="empty-doodle" />
      <h2>{title}</h2>
      {text && <p>{text}</p>}
      {children}
    </div>
  );
}
