

const terser = require("terser");
const fs = require("fs");

const res = terser.minify(fs.readFileSync("./src/bundle.js", {encoding: "utf8"}), {compress: {defaults: true } });

if (res.error) return console.error(res.error);
fs.writeFile("./src/bundle.js", res.code, () => console.log("DONE"));