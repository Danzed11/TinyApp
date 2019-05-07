var express = require("express");
var app = express();
var PORT = 8080; // default port 8080

app.set("view engine", "ejs");

var urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

// app.get("/hello", (req, res) => {
//   res.send("<html><body>Hello <b>World</b></body></html>\n");
// });
app.get("/urls.json", (req, res) => {
  res.send(urlDatabase);
});
app.get("/faq", (req, res) => {
  res.send("FAQ");
});
app.get("/urls", (req, res) => {
  let templateVars = { urls: urlDatabase };   //When sending variables to and EJS template, we need to have them inside an object
  res.render("urls_index", templateVars);
});
app.get("/hello", (req, res) => {
  let templateVars = { greeting: 'Hello World!!!!' }; //Send "Hello World!!!!" as the variable templateVars to the template "hello_world by re.render()"
  res.render("hello_world", templateVars);
});


app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});
