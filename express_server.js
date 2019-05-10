var express = require("express");
var app = express();
var PORT = 8080; // default port 8080
const bodyParser = require("body-parser");
var cookieParser = require('cookie-parser')
var app = express()
app.use(cookieParser())
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

const users = { 
  "userRandomID": {
    id: "userRandomID", 
    email: "user@example.com", 
    password: "purple-monkey-dinosaur"
  },
 "user2RandomID": {
    id: "user2RandomID", 
    email: "user2@example.com", 
    password: "dishwasher-funk"
  }
}


// app.get("/hello", (req, res) => {
//   res.send("<html><body>Hello <b>World</b></body></html>\n");
// });
// app.post("/urls/login", (req, res) => {
//   res.cookie("username", req.body["username"]);       //1st cookie step
//   res.redirect("/urls");
// })
app.post("/urls/:shortURL/update", (req, res) => {
  const editId = req.params.shortURL;
  let longstring = req.body.longURL;
  urlDatabase[editId] = longstring;        //Work on this one
  console.log("editing>>>", urlDatabase);
  res.redirect("/urls/");
});
app.post("/urls/:shortURL/delete", (req, res) => { //ROUTE to handle delete buttons
  delete urlDatabase[req.params.shortURL];
  console.log("deleting");
  res.redirect("/urls");
});
app.post("/urls", (req, res) => {
  let shortURL = generateRandomString(6);
  let longstring = req.body.longURL;
  urlDatabase[shortURL] = "https://" + longstring;
  let templateVars = { shortURL: shortURL, longURL: req.body.longURL, userlist: users, user_id: req.cookies["user_id"]}
  console.log(urlDatabase);
  res.redirect("/urls/" + shortURL ); //////////ADD TEMPLATE VARIABLES?!?!?!?!?!?!?!?//////////
});

app.get("/u/:shortURL", (req, res) => {
  const longURL = urlDatabase[req.params.shortURL]
  res.redirect(longURL);
});

app.get("/urls", (req, res) => {
  let templateVars = { urls: urlDatabase, userlist: users, user_id: req.cookies["user_id"] };   //When sending variables to and EJS template, we need to have them inside an object
  res.render("urls_index", templateVars);
});

app.get("/urls/new", (req, res) => {
  let templateVars = { userlist: users, user_id: req.cookies["user_id"]}          // REDIRECTING TO UPDATE PAGE CURRENTLY
  res.render("urls_new", templateVars);
});

app.get("/urls/:shortURL", (req, res) => {
  //const shortURL = req.params.shortURL
  let templateVars = { shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL], userlist: users, user_id: req.cookies["user_id"]};
    res.render("urls_show", templateVars);
});

app.get("/login", (req, res) => {
  let templateVars = {urls: urlDatabase, userlist: users, user_id: req.cookies["user_id"]};
  res.render("login", templateVars);
})

app.post("/login", (req,res) => {
  let tempID = emailToId(req.body.email);
    if (tempID === false) {
      res.send(`User not found </br><a href="/login"> Go Back</a>`) //USER not found if not in system
    } else if (req.body.password === users[tempID].password) {
      res.cookie("user_id", tempID);
    } else {
      res.send(`Password incorrect.</br> <a href="/login"> Go Back</a>`) //Or Password incorrect
    }
  res.redirect("/urls");
});

app.post("/logout", (req, res) => {
  res.clearCookie("user_id");              ////// LOGOUT ADDED
  res.redirect("/urls");
});

app.get("/register", (req, res) => {
    let templateVars = { userlist: users, user_id: req.cookies["user_id"], error: undefined
    };
  res.render("registration", templateVars);
});

app.post("/register", (req, res) => {
  if (inUsers(users, 'email', req.body.user)) {
    res.status(400).send('email in use</br><a href="/register">Go Back</a>');
  } else {
  
  let newID = generateRandomString(6);
  users[newID] = {
    id: newID,
    email: req.body.email,
    password: req.body.password
  };
  res.cookie("user_id", req.body.email)                     //Cookies for email memory -- Trying to stay logged in
  res.redirect("/urls");
  console.log(users);
                                                                                                                                                                                                                                                                                                                                                                                                                  
}});


//if (users[email = req.body.email])

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});

function idToEmail(user_id) {
  if (users[user_id].email !== undefined) {
    return users[user_id].email;
  } else return "None";
};


function emailToId(input) {
  for (let id in users) {
    if (users[id].email === input) {
      return id;
    };
  };
  return false;
}; 

function inUsers(obj, key, value) {
  for (let entry in obj) {
    if (obj[entry][key] === value) {
      return true;
    };
  }
  return false;
};