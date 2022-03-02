var fs = require("fs");
var cp = require("child_process");

cp.exec("grunt", readHTMLFile);

function readHTMLFile(error, stdout, stderr) {
  console.log(error);
  console.log(stdout);
  console.log(stderr);
  fs.readFile("client/index.html", "utf-8", (err, html) => {
    readSVGFile(html);
  });
}

function readSVGFile(html) {
  fs.readFile("dest/dest.svg", "utf-8", (err, svg) => {
    console.log(err);
    appendSVG(html, svg);
  });
}

function appendSVG(html, svg) {
  var svgAppended = html.replace("$svg", svg);
  var writeStream = fs.createWriteStream("public/index.html", "utf-8");
  writeStream.end(svgAppended);
}
