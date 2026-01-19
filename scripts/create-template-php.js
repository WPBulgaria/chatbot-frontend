const fs = require('node:fs');
const parser = require('node-html-parser')

try {
    const template = fs.readFileSync('./scripts/template.php', 'utf8');

    const source = fs.readFileSync('./dist/index.html', 'utf8');
    const root = parser.parse(source);

    const mainScript =  root.querySelector("script");
    const link =  root.querySelector('head [rel="stylesheet"]');

    let parsedTemplate = template
        .replace("__MAIN_JS__", mainScript.getAttribute("src"))
        .replace("__STYLE_LINK__", link.getAttribute("href"))


    fs.writeFileSync("./dist/template.php", parsedTemplate);
    process.exit();
} catch (err) {
    console.error(err);
    process.exit();
}