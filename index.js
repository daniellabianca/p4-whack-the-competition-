const express = require("express");
const app = express();

app.set("views", "./views");
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));


app.get(
  "/",
  ("/",
    (req, res) => {
      res.render("index", { });
    })
);


app.get("/:catch", function (req, res) {
  res.send("404 Page Not Found. Bummer!");
});

app.listen(3700, () => console.log("I'm running on port 3700"));
