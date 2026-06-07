// src/constants/sdm.assets.js
// Webpack asset resolution for hint images.
// Centralised here so sdm.js, sdm.content.js, and sdm.questions.js
// all share one canonical image map without duplicating require.context calls.

const context = require.context("../assets/hints", false, /\.(png|jpe?g|svg)$/);

const hintImages = {};
context.keys().forEach((path) => {
  const fileName = path.replace("./", "").split(".").shift();
  const mod = context(path);
  hintImages[fileName] = typeof mod === "string" ? mod : (mod?.default ?? mod);
});

// Result shape: { cnb: "/static/media/cnb.xxxxxx.png", slnb: "...", ... }
export default hintImages;
