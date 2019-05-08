var express = require("express");
var app = express();
var PORT = 8080; // default port 8080
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));

app.set("view engine", "ejs");

function generateRandomString(length) {
  let letters="abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ123456789";
  let result = "";
  let charactersLength = letters.length;
  for(let i = 0; i < length; i++) {
    result += letters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
  }
  console.log(generateRandomString(6));
  

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

// app.get("/hello", (req, res) => {
//   res.send("<html><body>Hello <b>World</b></body></html>\n");
// });

app.post("/urls", (req, res) => {
  let shortURL = generateRandomString(6);
  let longstring = req.body.longURL;
  urlDatabase[shortURL] = "https://" + longstring;
  console.log(urlDatabase);
  res.redirect("/urls/" + shortURL );
});
app.post("urls/:shortURL/delete", (req, res) => {
  delete urlDatabase[req.params.shortURL];
  res.redirect("/urls");
})
app.get("/u/:shortURL", (req, res) => {
  const longURL = urlDatabase[req.params.shortURL]
  res.redirect(longURL);
});

app.get("/urls", (req, res) => {
  let templateVars = { urls: urlDatabase };   //When sending variables to and EJS template, we need to have them inside an object
  res.render("urls_index", templateVars);
});

app.get("/urls/new", (req, res) => {
  res.render("urls_new");
});

app.get("/urls/:shortURL", (req, res) => {
  //const shortURL = req.params.shortURL
  let templateVars = { shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL]};
    res.render("urls_show", templateVars);
});


app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});
