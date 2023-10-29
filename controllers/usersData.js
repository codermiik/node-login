const express = require('express');
const db = require('../dbconfig');
const app = express();


exports.usersData= (req,res)=>{

    const query = 'SELECT id, name, email FROM uesrs';
  
    db.query(query, (err, results) => {
        if (err) {
          console.error('Error executing query: ' + err);
        return;
        }
    
        // Render the 'usersData' view and pass the user data
        console.log(results)
        res.render('usersData', { results: results } );
      });
    
  }
  