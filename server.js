const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 5000;

app.use(cors({origin:'http://localhost:5173'}));
app.use(express.json());

// Example API endpoint
app.get('/api/message', (req, res) => {
    res.json({ message: 'Hello from the backend!' });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
