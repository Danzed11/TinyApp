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

console.log(users.userRandomID.id);

function emailLookup(email){
  for (userId in users){
   if (email === users[userId].email){
     return userId;
   }
  }
  }
  if (!emailLookup(email)) {
   res.render(“403”);
  } else if (password !== users[userId].password){
   res.render(“403");
  } else {
   res.cookie(“user_id”, users[userId].id);
   res.redirect(“/urls”);
  }
  });