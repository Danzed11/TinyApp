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


<% if(userlist[user_id] === undefined){ %>
  <div style="padding-left: 1em; padding-right: 1em; ">
    <h1>Welcome to TinyApp</h1>
      <p>Please log in or register to shorten URLs</p>
  </div>
  <%} else {%>
    <h2>tinyApp URLS for <%= userlist[user_id].email %>:
    <ul>
    <% for (var entry in urls) { if (urls[entry] === user_id) {%>
      <li><%= entry %>: <a href="<%= urls[entry].longURL %>"><%= urls[entry].longURL %></a></li>
      <a href="urls/<%- entry %>">Edit</a>
      <form method="POST" action="/urls/<%= entry %>/delete">
        <button type="submit">DELETE</button>
      </form>
      </br>
    <%}; }; %>
    </ul>
  <% }%>
  </div>