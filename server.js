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
    ssl: { rejectUnauthorized: false } // Obligatoire pour Railway/Postgres
});

// Route pour servir ta page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'echostar.html'));
});

// Route pour récupérer les commentaires
app.get('/comments', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM comments ORDER BY created_at DESC');
        res.json(result.rows);
    } catch (err) {
        console.error("Erreur GET:", err);
        res.status(500).json(err);
    }
});

// Route pour poster un commentaire
app.post('/comments', async (req, res) => {
    try {
        const { pseudo, content } = req.body;
        await pool.query('INSERT INTO comments (pseudo, content) VALUES ($1, $2)', [pseudo, content]);
        res.json({ status: 'ok' });
    } catch (err) {
        console.error("Erreur POST:", err);
        res.status(500).json(err);
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Serveur lancé sur le port ${PORT}`));
