const SIMPLE_ICONS_OVERRIDES: Record<string, string> = {
  "vs code": "visualstudiocode",
  "visual studio code": "visualstudiocode",
  "next.js": "nextdotjs",
  "node.js": "nodedotjs",
  "davinci resolve": "davinciresolve",
  "pro tools": "protools",
  "tailwind css": "tailwindcss",
  tailwind: "tailwindcss",
  "google analytics": "googleanalytics",
  "google search console": "googlesearchconsole",
  "final cut pro": "finalcutpro",
  "logic pro": "logicpro",
};

// Adobe and a few others were removed from Simple Icons over trademark
// concerns. Use vectorlogo.zone as a primary source for those, with simpleicons
// as a fallback (in case vectorlogo.zone is unreachable).
const VECTORLOGO_OVERRIDES: Record<string, string> = {
  "adobe photoshop": "adobe_photoshop/adobe_photoshop-icon.svg",
  photoshop: "adobe_photoshop/adobe_photoshop-icon.svg",
  "adobe illustrator": "adobe_illustrator/adobe_illustrator-icon.svg",
  illustrator: "adobe_illustrator/adobe_illustrator-icon.svg",
  "adobe lightroom": "adobe_lightroom/adobe_lightroom-icon.svg",
  lightroom: "adobe_lightroom/adobe_lightroom-icon.svg",
  "adobe premiere pro": "adobe_premiere/adobe_premiere-icon.svg",
  "premiere pro": "adobe_premiere/adobe_premiere-icon.svg",
  "adobe after effects": "adobe_after_effects/adobe_after_effects-icon.svg",
  "after effects": "adobe_after_effects/adobe_after_effects-icon.svg",
  "adobe indesign": "adobe_indesign/adobe_indesign-icon.svg",
  indesign: "adobe_indesign/adobe_indesign-icon.svg",
};

function simpleIconsSlug(name: string): string {
  const key = name.toLowerCase().trim();
  if (SIMPLE_ICONS_OVERRIDES[key]) return SIMPLE_ICONS_OVERRIDES[key];
  return key.replace(/[^a-z0-9]/g, "");
}

export function softwareLogoSources(name: string): string[] {
  const key = name.toLowerCase().trim();
  const sources: string[] = [];
  if (VECTORLOGO_OVERRIDES[key]) {
    sources.push(`https://www.vectorlogo.zone/logos/${VECTORLOGO_OVERRIDES[key]}`);
  }
  sources.push(`https://cdn.simpleicons.org/${simpleIconsSlug(name)}`);
  return sources;
}
