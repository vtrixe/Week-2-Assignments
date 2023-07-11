/**
  You need to create a HTTP server in Node.js which will handle the logic of an authentication server.
  - Don't need to use any database to store the data.

  - Save the users and their signup/login data in an array in a variable
  - You can store the passwords in plain text (as is) in the variable for now

  The expected API endpoints are defined below,
  1. POST /signup - User Signup
    Description: Allows users to create an account. This should be stored in an array on the server, and a unique id should be generated for every new user that is added.
    Request Body: JSON object with username, password, firstName and lastName fields.
    Response: 201 Created if successful, or 400 Bad Request if the username already exists.
    Example: POST http://localhost:3000/signup

  2. POST /login - User Login
    Description: Gets user back their details like firstname, lastname and id
    Request Body: JSON object with username and password fields.
    Response: 200 OK with an authentication token in JSON format if successful, or 401 Unauthorized if the credentials are invalid.
    Example: POST http://localhost:3000/login

  3. GET /data - Fetch all user's names and ids from the server (Protected route)
    Description: Gets details of all users like firstname, lastname and id in an array format. Returned object should have a key called users which contains the list of all users with their email/firstname/lastname.
    The users username and password should be fetched from the headers and checked before the array is returned
    Response: 200 OK with the protected data in JSON format if the username and password in headers are valid, or 401 Unauthorized if the username and password are missing or invalid.
    Example: GET http://localhost:3000/data

  - For any other route not defined in the server return 404

  Testing the server - run `npm run test-authenticationServer` command in terminal
 */


  const express=require('express');
  const bodyParser=require('body-parser');

  const app=express();
  app.use(bodyParser.json());

  const users=[];

  app.post('/signup', (req, res) => {
    const { username, password, firstName, lastName } = req.body;
  
    // Check if the username already exists
    if (users[username]) {
      return res.status(400).json({ error: 'Username already exists' });
    }
  
    // Generate a unique id for the new user
    const id = generateUniqueId();
  
    // Save the user data in the object
    users[username] = { id, username, password, firstName, lastName };
  
    res.status(201).json({ message: 'User created successfully' });
  });
  
  // Login endpoint
  app.post('/login', (req, res) => {
    const { username, password } = req.body;
  
    // Find the user with the provided username
    const user = users[username];
  
    // Check if the user exists and the password is correct
    if (user && user.password === password) {
      const { id, firstName, lastName } = user;
      const authToken = generateAuthToken();
  
      res.status(200).json({ id, firstName, lastName, authToken });
    } else {
      res.status(401).json({ error: 'Invalid credentials' });
    }
  });
  
  // Data endpoint (Protected route)
  app.get('/data', (req, res) => {
    const { username, password } = req.headers;
  
    // Check if the username and password are provided
    if (!username || !password) {
      return res.status(401).json({ error: 'Missing credentials' });
    }
  
    // Find the user with the provided username
    const user = users[username];
  
    // Check if the user exists and the password is correct
    if (user && user.password === password) {
      const userData = Object.values(users).map(({ id, firstName, lastName }) => ({ id, firstName, lastName }));
      res.status(200).json({ users: userData });
    } else {
      res.status(401).json({ error: 'Invalid credentials' });
    }
  });
  
  // Handle 404 - Not Found
  app.use((req, res) => {
    res.status(404).json({ error: 'Not found' });
  });
  
  // Helper function to generate a unique id
  function generateUniqueId() {
    return Math.random().toString(36).substr(2, 9);
  }
  
  // Helper function to generate an authentication token
  function generateAuthToken() {
    return Math.random().toString(36).substr(2);
  }
  
  // Start the server
  app.listen(3000, () => {
    console.log('Server started on port 3000');
  });