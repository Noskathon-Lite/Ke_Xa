const express = require("express");
const app = express();
const PORT = 5000;

// Middleware to parse JSON requests
app.use(express.json());

// Sample route
app.get("/", (req, res) => {
    res.send("Health Safety App API is running!");
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
