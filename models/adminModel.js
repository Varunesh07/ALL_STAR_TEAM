const db = require('../config/db')

async function createTableAdmin(){
    try {
        const createQuery = `
        CREATE TABLE IF NOT EXISTS Admin (
            UserName VARCHAR(30) PRIMARY KEY, 
            Password VARCHAR(100) NOT NULL
        );
    `;
    await db.execute(createQuery);
    console.log("Table created successfully!");

    const [rows] = await db.execute("SELECT COUNT(*) as count FROM Admin;");
    if(rows[0].count === 0){
        console.log("Empty!!");
        
    }
            
    } catch (error) {
        console.log(error);
    }
}

module.exports = {createTableAdmin};