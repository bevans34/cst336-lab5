import express from 'express';
import mysql from 'mysql2/promise';

const app = express();

app.set('view engine', 'ejs');
app.use(express.static('public'));

//for Express to get values using POST method
app.use(express.urlencoded({extended:true}));

//setting up database connection pool
const pool = mysql.createPool({
    // IMPORTANT self-note. In a real implementation, we would want to keep these fields secret. (not visible on a public github)
    host: "edo4plet5mhv93s3.cbetxkdyhwsb.us-east-1.rds.amazonaws.com",
    user: "pcuxo4jf4n2j8s2e",
    password: "gbslqprom3t8n3yx",
    database: "uoye9fgujzzheqv5",
    connectionLimit: 10,
    waitForConnections: true
});

//routes
app.get('/', async (req, res) => {
    let sql = `SELECT authorId, firstName, lastName
               FROM q_authors
               ORDER BY lastName`;

    const [rows] = await pool.query(sql);

    let sql2 = `SELECT DISTINCT category
               FROM q_quotes
               ORDER BY category`;

    const [rows2] = await pool.query(sql2);

    res.render("index", {"authors": rows, "quotes": rows2});
});

app.get('/searchByKeyword', async (req, res) => {
    let userKeyword = req.query.keyword;
    let sql =  `SELECT quote, authorId, firstName, lastName
                FROM q_quotes
                NATURAL JOIN q_authors
                WHERE quote LIKE ?`;

    let sqlParams = [`%${userKeyword}%`];
    const [rows] = await pool.query(sql, sqlParams);
    res.render("results", {"quotes":rows});
});

app.get('/searchByAuthor', async (req, res) => {
    let userAuthorId = req.query.authorId;
    let sql =  `SELECT authorId, firstName, lastName, quote
                FROM q_quotes
                NATURAL JOIN q_authors
                WHERE authorId = ?`;

    let sqlParams = [userAuthorId];
    const [rows] = await pool.query(sql, sqlParams);
    res.render("results", {"quotes":rows});
});

app.get('/searchByCategory', async (req, res) => {
    let userCategory = req.query.category;
    let sql =  `SELECT authorId, firstName, lastName, quote, category
                FROM q_quotes
                NATURAL JOIN q_authors
                WHERE category = ?`;

    let sqlParams = [userCategory];
    const [rows] = await pool.query(sql, sqlParams);
    console.log({"quotes":rows});
    res.render("results", {"quotes":rows});
});

app.get('/searchByLikes', async (req, res) => {
    let userLikes = [];
    let minLikes = req.query.min;
    let maxLikes = req.query.max;
    let sql =  `SELECT authorId, firstName, lastName, quote, likes
                FROM q_quotes
                NATURAL JOIN q_authors
                WHERE likes BETWEEN ? AND ?`;

    userLikes.push(minLikes);
    userLikes.push(maxLikes);
    let sqlParams = userLikes;
    console.log(sqlParams);
    const [rows] = await pool.query(sql, sqlParams);
    //console.log({"quotes": rows});
    res.render("results", {"quotes":rows});
});

app.get('/api/author/:id', async (req, res) => {
    let authorId = req.params.id;
    let sql = `SELECT *
               FROM q_authors
               WHERE authorId = ?`;

    const [rows] = await pool.query(sql, [authorId]);
    res.send(rows);
});

app.get("/dbTest", async(req, res) => {
   try {
        const [rows] = await pool.query("SELECT CURDATE()");
        res.send(rows);
    } catch (err) {
        console.error("Database error:", err);
        res.status(500).send("Database error");
    }
}); //dbTest

app.listen(3000, ()=>{
    console.log("Express server running");
})