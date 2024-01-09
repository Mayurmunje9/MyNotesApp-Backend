const express = require("express");
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require("../models/User");
const fetchUser=require('../middleware/fetchUser')
const { validationResult } = require("express-validator");
const { body } = require("express-validator");

const JWT_SECRET = "ImAWeb$Token";

//Route 1:  Create user by Post: /api/auth/createUser
router.post(
  "/createUser",
  [
    // Validate user input
    body("name", "Enter a valid name").isLength({ min: 3 }),
    body("email", "Enter a valid email").isEmail(),
    body("password").isLength({ min: 5 }),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        // Return validation errors
        return res.status(400).json({ errors: "error" });
      }

      // Check whether user already exists
      let user = await User.findOne({ email: req.body.email });
      if (user) {
        // Return error if user already exists
        return res.status(400).json({ error: "Sorry, this email already exists" });
      }

      const salt = await bcrypt.genSalt(10);
      const securePassword = await bcrypt.hash(req.body.password, salt);

      // Create user
      
      user = await User.create({
        name: req.body.name,
        password: securePassword,
        email: req.body.email,
      });

      const data = {
        user: {
          id: user.id,
        },
      };

      // Generate JWT token
      const authToken =  jwt.sign(data, JWT_SECRET);

      // Log the generated token
      console.log(authToken);

      // Return success message

      
      return res.json({ success: "User created successfully", authToken });
    
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Some error occurred");
    }
  }
);

// Login user by Post: /api/auth/login
// ... (previous code)

//Route 2:  Login user by Post: /api/auth/login

router.post(
    "/login",
    [
      // Validate user input
      body("email", "Enter a valid email").isEmail(),
      body("password", "Password is required").exists(),
    ],
    async (req, res) => {
      try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          // Return validation errors
          return res.status(400).json({ errors: errors.array() });
        }
  
        const { email, password } = req.body;
  
        // Check if the user exists
        const user = await User.findOne({ email });
        if (!user) {
          return res.status(400).json({ error: "User not found. Please check your email." });
        }
  
        // Check if the password is correct
        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (!isPasswordMatch) {
          success=false
          return res.status(401).json({ success, error: "Invalid password. Please try again." });
        }
  
        const data = {
          user: {
            id: user.id,
          },
        };
  
        // Generate JWT token for authentication
        const authToken = jwt.sign ( data, JWT_SECRET);
        
        // Log the generated token
        
        
        // Return success message with token
        success=true;
        res.json({ authToken, message: "Login successful",success });
      } catch (error) {
        console.error(error.message);
        res.status(500).send("Some error occurred");
      }
    }
  );
  
  //Route 3:  Login user by Post: /api/auth/getUser
 
  router.post('/getUser', fetchUser, async (req, res) => {
    try {
      const userId = req.user.id;
      const user = await User.findById(userId).select("-password");  // Fix: Use 'User' instead of 'user'
      res.send(user);
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Some error occurred");
    }
  });
  

  // Route 4: Delete the last user created by Post: /api/auth/deleteUser
// Route 4: Delete the last user created by Post: /api/auth/deleteUser
router.post('/deleteUser', async (req, res) => {
  try {
    // Find the last created user and delete it
    const lastUser = await User.findOneAndDelete({}, { sort: { 'createdAt': -1 } });
    
    if (!lastUser) {
      return res.status(404).json({ error: 'No users found to delete.' });
    }

    res.json({ success: 'User deleted successfully' });
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Some error occurred');
  }
});



// Route 5: Get names of all users: /api/auth/getAllUsers
router.get('/getAllUsers', async (req, res) => {
  try {
    // Retrieve all users and return only the names
    const allUsers = await User.find({}, 'name');
    
    if (!allUsers.length) {
      return res.status(404).json({ error: 'No users found.' });
    }

    const userNames = allUsers.map(user => user.name);
                  res.json({ userNames });
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Some error occurred');
  }
});


router.post('/logout', (req, res) => {
  try {
    // Assuming you're using JWT tokens for authentication
    // You may want to implement additional logic based on your authentication mechanism
    res.clearCookie('token'); // Clear the token cookie on the client side
    
    res.json({ success: 'Logout successful' });
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Some error occurred');
  }
});

module.exports = router;


