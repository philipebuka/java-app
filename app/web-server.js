const express = require('express');
const mongoose = require('mongoose');
const app = express();

// 1. DATABASE CONFIGURATION
// We use your credentials: admin / password
const mongoUrl = 'mongodb://admin:password@mongo:27017/testdb?authSource=admin';

// 2. CONNECT TO MONGODB
mongoose.connect(mongoUrl)
    .then(() => console.log('✅ Connected to MongoDB!'))
    .catch(err => console.error('❌ DB Connection Error:', err));

// 3. DEFINE DATA MODEL
const User = mongoose.model('User', new mongoose.Schema({
    name: String,
    role: String
}));

// Middleware to read form data from the browser
app.use(express.urlencoded({ extended: true }));

// --- ROUTES ---

// GET Route: Shows the HTML Form and the List of Users
app.get('/', async (req, res) => {
    // Fetch all users from the database to display them
    const users = await User.find().sort({ _id: -1 }); // Newest first

    // Create a list of HTML items
    const userListHtml = users.map(user => 
        `<li style="margin-bottom: 5px; padding: 10px; background: #f4f4f4; border-radius: 4px;">
            <strong>${user.name}</strong> - <span style="color: #666;">${user.role}</span>
         </li>`
    ).join('');

    // Send the full HTML page
    res.send(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>My Docker Mongo App</title>
            <style>
                body { font-family: sans-serif; max-width: 600px; margin: 40px auto; padding: 20px; }
                input { padding: 10px; width: 100%; margin-bottom: 10px; box-sizing: border-box; }
                button { width: 100%; padding: 10px; background: #28a745; color: white; border: none; cursor: pointer; }
                button:hover { background: #218838; }
                h2 { border-bottom: 2px solid #eee; padding-bottom: 10px; }
            </style>
        </head>
        <body>
            <h1>🚀 Mongo User Manager</h1>
            
            <div style="background: #e9ecef; padding: 20px; border-radius: 8px;">
                <h3>Add New User</h3>
                <form action="/add" method="POST">
                    <input type="text" name="name" placeholder="Enter Name" required>
                    <input type="text" name="role" placeholder="Enter Role (e.g. Developer)" required>
                    <button type="submit">Save to Database</button>
                </form>
            </div>

            <h2>Current Users in DB (${users.length})</h2>
            <ul style="list-style: none; padding: 0;">
                ${userListHtml}
            </ul>
        </body>
        </html>
    `);
});

// POST Route: Receives the data when you click "Save"
app.post('/add', async (req, res) => {
    try {
        await User.create({
            name: req.body.name,
            role: req.body.role
        });
        // After saving, go back to the home page to see the new list
        res.redirect('/');
    } catch (error) {
        res.send("Error saving data: " + error.message);
    }
});

// Start the Server
app.listen(3000, () => {
    console.log('------------------------------------------------');
    console.log('🌐 App running at: http://localhost:3000');
    console.log('------------------------------------------------');
});