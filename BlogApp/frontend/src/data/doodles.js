// Hand-drawn doodle avatars. Each one is the inner markup of a 100x100 SVG that
// is drawn with a 3px black stroke (see components/Avatar.jsx).
// The ids must match backend/config/avatars.js.
const dot = (x, y, r = 3.5) => `<circle cx="${x}" cy="${y}" r="${r}" fill="#000" stroke="none"/>`;

const DOODLES = {
  cat: `
    <path fill="#fff" d="M22 46V20l19 13q9-3 18 0l19-13v26q4 16-6 27-10 10-22 10T28 73Q18 62 22 46Z"/>
    ${dot(39, 52)}${dot(61, 52)}
    <path fill="#000" d="M46 61h8l-4 5z"/>
    <path d="M50 66q-4 6-9 3M50 66q4 6 9 3M27 62 10 57M27 68l-16 3M73 62l17-5M73 68l16 3"/>`,

  bear: `
    <circle cx="27" cy="29" r="11" fill="#fff"/><circle cx="73" cy="29" r="11" fill="#fff"/>
    <circle cx="27" cy="29" r="4"/><circle cx="73" cy="29" r="4"/>
    <circle cx="50" cy="54" r="30" fill="#fff"/>
    ${dot(39, 48)}${dot(61, 48)}
    <ellipse cx="50" cy="63" rx="12" ry="9" fill="#fff"/>
    <path fill="#000" d="M45 59q5-3 10 0-3 5-5 5t-5-5z"/>
    <path d="M50 64v3m0 0q-4 4-7 1m7-1q4 4 7 1"/>`,

  ghost: `
    <path fill="#fff" d="M24 82V46q0-28 26-28t26 28v36q-7-9-13 0-6-9-13 0-7-9-13 0-6-9-13 0Z"/>
    <ellipse cx="40" cy="45" rx="4" ry="6" fill="#000" stroke="none"/>
    <ellipse cx="60" cy="45" rx="4" ry="6" fill="#000" stroke="none"/>
    <ellipse cx="50" cy="62" rx="5" ry="6"/>
    <path d="M17 50q-6 7-2 14M83 50q6 7 2 14"/>`,

  robot: `
    <path d="M50 14v12"/><circle cx="50" cy="11" r="4" fill="#fff"/>
    <rect x="12" y="42" width="10" height="16" rx="3" fill="#fff"/>
    <rect x="78" y="42" width="10" height="16" rx="3" fill="#fff"/>
    <rect x="22" y="26" width="56" height="48" rx="10" fill="#fff"/>
    <rect x="32" y="39" width="13" height="13" rx="2" fill="#000"/>
    <rect x="55" y="39" width="13" height="13" rx="2" fill="#000"/>
    <path d="M36 63h28M43 59v8M50 59v8M57 59v8M38 74v12M62 74v12"/>`,

  cactus: `
    <path fill="#fff" d="M40 70H30q-8 0-8-8V44q0-6 6-6t6 6v14h6"/>
    <path fill="#fff" d="M60 62h10q8 0 8-8V38q0-6-6-6t-6 6v12h-6"/>
    <path fill="#fff" d="M40 84V36q0-16 10-16t10 16v48Z"/>
    <circle cx="50" cy="15" r="5" fill="#fff"/>
    ${dot(45, 50, 3)}${dot(55, 50, 3)}
    <path d="M46 57q4 4 8 0M46 38l2 2M54 70l-2 2M45 72l2 2"/>
    <path fill="#fff" d="M32 84h36l-4 10H36z"/>`,

  sun: `
    <circle cx="50" cy="50" r="20" fill="#fff"/>
    <path d="M50 22V10M69.8 30.2l8.5-8.5M78 50h12M69.8 69.8l8.5 8.5M50 78v12M30.2 69.8l-8.5 8.5M22 50H10M30.2 30.2l-8.5-8.5"/>
    ${dot(43, 46)}${dot(57, 46)}
    <path d="M42 55q8 8 16 0"/>`,

  moon: `
    <path fill="#fff" d="M48 20.1A32 32 0 1 0 75.6 64.1 26 26 0 0 1 48 20.1Z"/>
    <path d="M22 50q5 5 10 0M24 63q4 4 8 0"/>
    <path d="M76 20v10M71 25h10M86 44v8M82 48h8"/>`,

  cloud: `
    <path fill="#fff" d="M28 74Q14 74 14 61q0-11 12-13 0-16 16-16 10 0 15 8 5-4 11-2 10 2 10 12 10 2 10 12 0 12-12 12Z"/>
    ${dot(38, 56)}${dot(60, 56)}
    <path d="M42 64q7 6 14 0M34 82l-2 8M50 82l-2 8M66 82l-2 8"/>`,

  alien: `
    <path fill="#fff" d="M50 14q32 0 32 32 0 24-20 36-12 6-24 0-20-12-20-36 0-32 32-32Z"/>
    <path d="M50 14V6"/><circle cx="50" cy="5" r="3" fill="#000"/>
    <path fill="#000" d="M24 44q10-4 20 10-12 4-20-10ZM76 44q-10-4-20 10 12 4 20-10Z"/>
    <circle cx="33" cy="49" r="2" fill="#fff" stroke="none"/><circle cx="67" cy="49" r="2" fill="#fff" stroke="none"/>
    <path d="M43 70q7 4 14 0"/>`,

  fish: `
    <path fill="#fff" d="M80 50 94 34q-4 16 0 32Z"/>
    <path fill="#fff" d="M44 31q6-13 14-1"/>
    <path fill="#fff" d="M12 50Q30 24 58 30q16 4 24 20-8 16-24 20-28 6-46-20Z"/>
    ${dot(27, 46)}
    <path d="M40 38q-6 12 0 24M52 44q4 4 0 8M62 46q4 4 0 8M13 52q3 3 6 0"/>
    <circle cx="14" cy="28" r="3" fill="#fff"/><circle cx="22" cy="17" r="2" fill="#fff"/>`,

  mushroom: `
    <path fill="#fff" d="M36 56v24q0 6 6 6h16q6 0 6-6V56Z"/>
    <path fill="#fff" d="M12 56Q12 18 50 18t38 38Z"/>
    <circle cx="34" cy="38" r="5" fill="#000" stroke="none"/>
    <circle cx="58" cy="32" r="6" fill="#000" stroke="none"/>
    <circle cx="73" cy="47" r="4" fill="#000" stroke="none"/>
    ${dot(44, 68, 3)}${dot(56, 68, 3)}
    <path d="M46 75q4 4 8 0"/>`,

  owl: `
    <path fill="#fff" d="M26 28l6-14 10 10q8-2 16 0l10-10 6 14q6 12 4 30-2 22-28 28-26-6-28-28-2-18 4-30Z"/>
    <circle cx="38" cy="44" r="11" fill="#fff"/><circle cx="62" cy="44" r="11" fill="#fff"/>
    ${dot(39, 45, 4)}${dot(61, 45, 4)}
    <path fill="#000" d="M46 54h8l-4 8z"/>
    <path d="M38 72q4-4 8 0M46 77q4-4 8 0M54 72q4-4 8 0M22 58q-8 8 0 18M78 58q8 8 0 18M42 86v6M58 86v6"/>`,
};

export const DOODLE_IDS = Object.keys(DOODLES);
export default DOODLES;

// Users created before doodles existed have a photo URL as avatar.
// Fall back to a stable doodle picked from their name so nobody sees a broken image.
export const resolveDoodle = (id, seed = "") => {
  if (DOODLES[id]) return id;
  const sum = [...String(seed || id || "x")].reduce((total, ch) => total + ch.charCodeAt(0), 0);
  return DOODLE_IDS[sum % DOODLE_IDS.length];
};
