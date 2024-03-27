const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

// Configuration
const windowSize = 10;
let storedNumbers = [];

// Middleware
app.use(bodyParser.json());

// Route for handling requests to "/numbers/:numberid"
app.get('/numbers/:numberid', async (req, res) => {
    const { numberid } = req.params;

    // Fetch numbers from third-party server based on numberid
    try {
        const response = await axios.get(`http://20.244.56.144/test/primes`);
        const numbers = response.data.numbers;

        // Filter out duplicates and ensure uniqueness
        const uniqueNumbers = Array.from(new Set(numbers));

        // Update storedNumbers array
        storedNumbers = [...storedNumbers, ...uniqueNumbers];
        if (storedNumbers.length > windowSize) {
            storedNumbers = storedNumbers.slice(-windowSize);
        }

        // Calculate average of numbers matching window size
        const avg = calculateAverage(storedNumbers);

        // Prepare response
        const responseObj = {
            windowPrevState: [],
            windowCurrState: storedNumbers,
            numbers: uniqueNumbers,
            avg
        };

        res.json(responseObj);
    } catch (error) {
        console.error('Error fetching numbers:', error.message);
        res.status(500).send('Internal Server Error');
    }
});

// Function to calculate average of an array of numbers
function calculateAverage(numbers) {
    if (numbers.length === 0) return 0;
    const sum = numbers.reduce((acc, curr) => acc + curr, 0);
    return sum / numbers.length;
}

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
