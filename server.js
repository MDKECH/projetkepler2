const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static('.')); 

const pool = new Pool({ 
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
});

// --- ROUTES DE NAVIGATION ---
app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'index.html')));
app.get('/echostar', (req, res) => res.sendFile(path.join(__dirname, 'echostar.html')));
app.get('/nebius', (req, res) => res.sendFile(path.join(__dirname, 'nebius.html')));

// --- ROUTES API ---
app.get('/comments', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM comments ORDER BY created_at DESC');
        res.json(result.rows);
    } catch (err) { res.status(500).json(err); }
});

app.post('/comments', async (req, res) => {
    try {
        const { pseudo, content } = req.body;
        await pool.query('INSERT INTO comments (pseudo, content) VALUES ($1, $2)', [pseudo, content]);
        res.json({ status: 'ok' });
    } catch (err) { res.status(500).json(err); }
});

// --- DÉMARRAGE ---
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`Serveur prêt sur le port ${PORT}`));
