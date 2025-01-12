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
const ambulances = [
    { id: 1, name: "City Ambulance", phone: "123-456-7890", location: "Downtown" },
    { id: 2, name: "Rapid Response", phone: "987-654-3210", location: "Uptown" },
];

app.get("/api/ambulances", (req, res) => {
    res.json(ambulances);
});
