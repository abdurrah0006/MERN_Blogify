import DOODLES from "../data/doodles";

// A bare doodle drawing (no frame). Use <Avatar /> for the round profile picture.
export default function Doodle({ id, className = "" }) {
  return (
    <svg
      className={`doodle ${className}`}
      viewBox="0 0 100 100"
      aria-hidden="true"
      dangerouslySetInnerHTML={{ __html: DOODLES[id] }}
    />
  );
}
