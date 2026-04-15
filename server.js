const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

app.get('/comments', async (req, res) => {
    const result = await pool.query('SELECT * FROM comments ORDER BY created_at DESC');
    res.json(result.rows);
});

app.post('/comments', async (req, res) => {
    const { pseudo, content } = req.body;
    await pool.query('INSERT INTO comments (pseudo, content) VALUES ($1, $2)', [pseudo, content]);
    res.json({ status: 'ok' });
});

app.listen(process.env.PORT || 3000);
