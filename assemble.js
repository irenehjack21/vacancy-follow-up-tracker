// Inlines the built CSS + JS into a single, self-contained, offline HTML file.
const fs = require("fs");
const css = fs.readFileSync("dist/app.css", "utf8");
let js = fs.readFileSync("dist/app.js", "utf8");
js = js.replace(/<\/script/gi, "<\\/script");
const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>Vacancy follow-up tracker</title>
<style>
html,body{margin:0;padding:0;background:#fafaf9;}
${css}
</style>
</head>
<body>
<div id="root"></div>
<script>${js}</script>
</body>
</html>`;
fs.writeFileSync("vacancy-follow-up-tracker.html", html);
console.log("Built vacancy-follow-up-tracker.html");
