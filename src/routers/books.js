const express = require('express')
const router = express.Router()
const db = require("../../db");

router.get('/', async (req, res) => {
    const type = req.query.type
    const topic = req.query.topic

    let sqlString = 'SELECT * FROM "books"';

    if (type && topic) {
    sqlString += ` WHERE type = '${type}' AND topic = '${topic}';`;
    } else if (type) {
    sqlString += ` WHERE type = '${type}';`;
    } else if (topic) {
    sqlString += ` WHERE topic = '${topic}';`;
    }
    //1. Get data from my database table called books
    const result = await db.query(sqlString)
    //3. send back a response
    res.json({books:result.rows})
})

router.get('/:id', async (req, res) => {
// extract id from the path
const id =  req.params.id
//get data from the table
const result = await db.query(`SELECT * FROM "books" WHERE id = ${id};`)
//send back a response
const book = result.rows[0]
res.json({books:book})

})

router.post('/', async (req,res) => {
    const { title, type, author, topic, publicationDate, pages } = req.body;
    
    const result = await db.query(
        `INSERT INTO "books" (title, type, author, topic, publicationDate, pages) VALUES
          ('${title}', '${type}', '${author}', '${topic}', '${publicationDate}', ${pages}) returning *`
      ) ;

res.json({book: result})
    
})



module.exports = router
