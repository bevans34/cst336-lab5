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
app.get('/', (req, res) => {
   res.render("index");
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
    console.log("Express server running")
})