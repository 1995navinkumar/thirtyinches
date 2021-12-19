var fs = require('fs')

var serviceAccount = require("./serviceAccount.json");

var index = fs.readFileSync("index.js", { encoding: "UTF-8" });

console.log(index);

index = index.replace("$$SERVICE", JSON.stringify(serviceAccount, null, 3));

fs.writeFileSync("main.js", index);