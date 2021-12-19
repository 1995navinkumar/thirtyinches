var fs = require('fs'),
    path = require('path');

function walkSync(currentDirPath, callback) {
    fs.readdirSync(currentDirPath).forEach(function (name) {
        var filePath = path.join(currentDirPath, name);
        var stat = fs.statSync(filePath);
        if (stat.isFile()) {
            callback(filePath, stat);
        } else if (stat.isDirectory()) {
            walkSync(filePath, callback);
        }
    });
}

var paths = ["/"];
walkSync("public", (filePath) => paths.push(filePath));

var filterFiles = ["DS_Store", "sw.js", "manifest", "tmp"]

paths = paths
    .filter(p => !filterFiles.some(fp => p.includes(fp)))
    .map(p => p.replace("public", ""));

var serviceWorker = fs.readFileSync("client/src/sw.js", { encoding: "UTF-8" });

serviceWorker = serviceWorker.replace("$$", JSON.stringify(paths, null, 3));

fs.writeFileSync("public/sw.js", serviceWorker);

