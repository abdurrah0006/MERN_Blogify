import Doodle from "./Doodle";
import { resolveDoodle } from "../data/doodles";

export default function Avatar({ id, name = "", size = 40, className = "" }) {
  return (
    <span
      className={`avatar ${size >= 64 ? "wobble" : ""} ${className}`}
      // Thinner artwork needs a heavier stroke to stay legible when small.
      style={{ "--size": `${size}px`, "--stroke": size < 48 ? 5 : 3 }}
      role="img"
      aria-label={name ? `${name}'s avatar` : "Avatar"}
    >
      <Doodle id={resolveDoodle(id, name)} />
    </span>
  );
}
