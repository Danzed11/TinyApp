var express = require("express");
var app = express();
var PORT = 8080; // default port 8080
const bodyParser = require("body-parser");
var cookieSession = require('cookie-session');
var app = express()
const bcrypt = require('bcrypt');
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");

app.use(cookieSession({
  name: 'session',
  keys: ['key1'],

   // Cookie Options //
   maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }));

function generateRandomString(length) {
  let letters="abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ123456789";
  let result = "";
  let charactersLength = letters.length;
  for(let i = 0; i < length; i++) {
    result += letters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
  }
  
  //Hashes a password.
  function hashedPassword(password) {
    return bcrypt.hashSync(password, 10)
  };
  
  function shortURLExists(shorturl) {
    if (urlDatabase[shorturl]) return true;
    else return false;
  };

  function emailLookup (email) {
    for (let id in users) {
      console.log(id);
      if (email === users[id].email) {
      return users[id];
      }
    }
  }
  function addhttp(url) {
    if (!/^https?:\/\//i.test(url)) {
      url = 'http://' + url;
    };
    return url;
  };
  
  function urlsForUser(userID){
    let userURLs = {};
    for (let urlId in urlDatabase){
      let url = urlDatabase[urlId];
      if (url.userID === userID){
        userURLs[urlId] = url;
      }
    }
    return userURLs;
  }
  
  const urlDatabase = {
            b6UTxQ:
              { longURL: "https://www.tsn.ca",
                userID: "user2RandomID",
              },
            wIn7sz:   
              { longURL: "https://www.google.ca",
                userID: "123",
              }
   };

const users = { 
  
 "None": {
    id: "None",
    email: "no@email.com",
    password: ""
    },
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


app.post("/urls/:shortURL/update", (req, res) => {
  if (shortURLExists(req.params.shortURL) && (req.session.user_id === urlDatabase[req.params.shortURL].userID)) {
    urlDatabase[req.params.shortURL].longURL = (req.body.longURL);
    return res.redirect("/urls");
  }
    res.redirect("/urls");
});

app.post("/urls/:shortURL/delete", (req, res) => { 
  delete urlDatabase[req.params.shortURL];
  res.redirect("/urls");
});

app.get("/urls", (req, res) => {
  const user_id = req.session.user_id 
  const userURLS = urlsForUser(user_id)                  
  let templateVars = { urls: userURLS, userlist: users, user_id };   
  res.render("urls_index", templateVars);
});

app.post("/urls", (req, res) => {
  let shortURL = generateRandomString(6);
  let longstring = req.body.longURL;
  urlDatabase[shortURL] = {
    longURL: addhttp(longstring),
    userID: req.session.user_id
  };
  let templateVars = { shortURL: shortURL, longURL: req.body.longURL, userlist: users, user_id: req.session.user_id}
  res.redirect("/urls/" + shortURL );
});

app.get("/u/:shortURL", (req, res) => {
  if(shortURLExists(req.params.shortURL)) {
    let outboundURL = urlDatabase[req.params.shortURL].longURL;
    res.redirect(outboundURL);
  };
  res.status(400).send('Shorted URL does not exist.</br><a href="/urls">Go Back</a>');
});

app.get("/urls/new", (req, res) => {
  if (!req.session.user_id) {      
    res.redirect("/urls");
  }
  let templateVars = { userlist: users, user_id: req.session.user_id}          
  res.render("urls_new", templateVars);
});

app.get("/urls/:shortURL", (req, res) => {
  const shortURL = req.params.shortURL
  const urlObj = urlDatabase[shortURL]
  if (!urlObj) {
    return res.redirect("/urls/new")
  }
  let templateVars = {
    shortURL: shortURL,
    longURL: urlObj.longURL,
    userlist: users,
    user_id: req.session.user_id
  };
    res.render("urls_show", templateVars);
});

app.get("/login", (req, res) => {
  let templateVars = {urls: urlDatabase, userlist: users, user_id: req.session.user_id };
  res.render("login", templateVars);
})

app.post("/login", (req,res) => { 
  let email = req.body.email;
  let user = emailLookup(email);
  if (!user) {
    res.send("Error 403 Bad Request. You're not registered");
  } else if (!bcrypt.compareSync(req.body.password, user.password)) {
    res.send("Error 403 Wrong Password");
  } else {
    
  req.session.user_id = user.id;
  res.redirect("/urls");
                                                                                                                                                                                                                                                                                                                                                                                                                  
}});


app.post("/logout", (req, res) => {
  req.session = null;
  res.redirect("/urls");
});

app.get("/register", (req, res) => {
    let templateVars = { userlist: users, user_id: req.session.user_id };
  res.render("registration", templateVars);
});

app.post("/register", (req, res) => {         
  let email = req.body.email;
  let user = emailLookup(email);
  if (!req.body.email || !req.body.password) {
    res.send("400 Bad Request");
  } else if (user) {
    res.send("You are already registered");
  } else {
      let newID = generateRandomString(6);
      users[newID] = {
        id: newID,
        email: req.body.email,
        password: hashedPassword(req.body.password)
  };
  req.session.user_id = newID                   
  res.redirect("/urls");
                                                                                                                                                                                                                                                                                                                                                                                                                  
}});


app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});


