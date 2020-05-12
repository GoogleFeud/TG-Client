

const terser = require("terser");
const fs = require("fs");

const res = terser.minify(fs.readFileSync("./src/bundle.js", {encoding: "utf8"}), {compress: {defaults: true } });

if (res.error) return console.error(res.error);
fs.writeFile("./src/bundle.js", res.code, () => console.log("Successfully built client-side javascript!")); // Builds 

fs.writeFile("../TG-Server/public/bundle.js", res.code, () => console.log("Successfully loaded js..."));

fs.writeFile("../TG-Server/index.html", fs.readFileSync("./src/index.html", {encoding: "utf8"}), () => console.log("Successfully loaded html..."));

fs.writeFile("../TG-Server/public/style.css", fs.readFileSync("./src/style.css", {encoding: "utf8"}), () => console.log("Successfully loaded css..."));