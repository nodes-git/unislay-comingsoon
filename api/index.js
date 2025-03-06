import express from 'express';
import cors from 'cors';

const app = express();

// Enable CORS
app.use(cors());

// Parse JSON bodies
app.use(express.json());

// API endpoint for email subscription
app.post('/api/subscribe', (req, res) => {
    try {
        const { email } = req.body;
        
        if (!email) {
            return res.status(400).json({ error: 'Email is required' });
        }
        
        // For now, just return success
        res.status(200).json({ success: true, message: 'Subscription successful' });
    } catch (error) {
        console.error('Subscription error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Handle 404
app.use((req, res) => {
    res.status(404).json({ error: 'Not found' });
});

export default app;
