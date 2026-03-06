const express = require('express');
const bodyParser = require('body-parser');
const mysql2 = require('mysql2/promise');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(bodyParser.json());

const port = 8000;
let conn;


// ================= CONNECT DATABASE =================

const initDB = async () => {
    conn = await mysql2.createConnection({
        host: 'localhost',
        user: 'root',
        password: 'root',
        database: 'webdb',
        port: 8700
    });

    console.log('Connected to MySQL database');
};


// ================= TEST DATABASE =================

app.get('/testdb', async (req, res) => {
    try {
        const result = await conn.query('SELECT * FROM users');
        res.json(result[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


// ================= GET ALL USERS =================

app.get('/users', async (req, res) => {
    try {
        const results = await conn.query('SELECT * FROM users');
        res.json(results[0]);
    } catch (error) {
        res.status(500).json({
            message: 'Error fetching users'
        });
    }
});


// ================= GET USER BY ID =================

app.get('/users/:id', async (req, res) => {
    try {
        let id = req.params.id;

        const result = await conn.query(
            'SELECT * FROM users WHERE id = ?',
            [id]
        );

        if (result[0].length === 0) {
            return res.status(404).json({
                message: 'User not found'
            });
        }

        res.json(result[0][0]);

    } catch (error) {
        res.status(500).json({
            message: 'Error fetching user'
        });
    }
});


// ================= CREATE USER =================

app.post('/users', async (req, res) => {

    try {

        console.log("DATA FROM FRONTEND :", req.body);

        let { firstname, lastname, age, gender, interests, description } = req.body;

        // ป้องกันค่า null
        if (!firstname || !lastname) {
            return res.status(400).json({
                message: 'Firstname และ Lastname ห้ามว่าง'
            });
        }

        const result = await conn.query(
            `INSERT INTO users 
            (firstname, lastname, age, gender, interests, description) 
            VALUES (?, ?, ?, ?, ?, ?)`,
            [firstname, lastname, age, gender, interests, description]
        );

        res.json({
            message: 'เพิ่มข้อมูลสำเร็จ',
            insertId: result[0].insertId
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: 'Error adding user'
        });
    }
});


// ================= UPDATE USER =================

app.put('/users/:id', async (req, res) => {

    try {

        let id = req.params.id;
        let { firstname, lastname, age, gender, interests, description } = req.body;

        const result = await conn.query(
            `UPDATE users 
            SET firstname=?, lastname=?, age=?, gender=?, interests=?, description=? 
            WHERE id=?`,
            [firstname, lastname, age, gender, interests, description, id]
        );

        res.json({
            message: 'User updated successfully'
        });

    } catch (error) {

        res.status(500).json({
            message: 'Error updating user'
        });

    }

});


// ================= DELETE USER =================

app.delete('/users/:id', async (req, res) => {

    try {

        let id = req.params.id;

        await conn.query(
            'DELETE FROM users WHERE id = ?',
            [id]
        );

        res.json({
            message: 'User deleted successfully'
        });

    } catch (error) {

        res.status(500).json({
            message: 'Error deleting user'
        });

    }

});


// ================= START SERVER =================

app.listen(port, async () => {

    await initDB();

    console.log(`Server running at http://localhost:${port}`);

});
