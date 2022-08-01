const express = require('express')
const router = express.Router()
const db = require("../../db");


router.get('/', async (req, res) => {
    const type = req.query.type;
    let sqlString = 'SELECT * FROM "pets"';
    if (type) {
    sqlString += ` WHERE type = '${type}';`;
    }
    //2. send back a response
    const result = await db.query(sqlString)
    //3. send back a response
    res.json({pets:result.rows})
    
})

router.get("/:id", async (req,res) => {
    // extract id from the path
    const id =  req.params.id
        //get data from the table
    const result = await db.query(`SELECT * FROM "pets" WHERE id = ${id};`)
    //send back a response
    const pet = result.rows[0]
    res.json({pet:pet})

})

router.post("/", async (req,res) => { 
    const result = await db.query(
        `INSERT INTO "pets" (name, age, type, breed, microchip) VALUES
          ('Ollie', '8', 'cat', 'tabby', 'true' ) returning *`
      ) ;

res.json({pet: result.rows[0]})
})

router.put("/:id", async (req,res) => {
    const id = req.params.id;
    const { name, age, type, breed, microchip } = req.body;

    const query =
    "UPDATE pets set name = $1, age = $2, type = $3, breed = $4, microchip = $5 WHERE id = $6 returning *";

    const values = [name, age, type, breed, microchip, id];
    const update = await db.query(query, values);
    
    res.json({ pet: update.rows[0] });

})

router.delete("/:id", async (req, res) => {
    const id = req.params.id
    const query = "DELETE from pets WHERE id = $1 returning *"
    const remove = await db.query(query, [id])

    res.json({ pet: remove })
})


module.exports = router

