const express = require('express');
const db = require('../dbconfig');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs')
const cookieParser = require('cookie-parser');


const app = express();
app.use(cookieParser());

exports.register=(req , res)=>{
    console.log(req.body);

    const {name, email, password, passwordConfirm} =req.body;

    db.query('SELECT email FROM uesrs WHERE email =?',[email], async(error, results)=>{
        if(error){
            console.log(error);
        }

        if(results.length>0){
            return res.render('register',{
                failure:"This email is already registered"
            })
        }else if(password !== passwordConfirm){
            return res.render('register',{
                failure:"passwords do not match"
        });
      }

      let hashedPassword = await bcrypt.hash(password, 8);
      console.log(hashedPassword);

      db.query('INSERT INTO uesrs SET ?', {name:name, email:email, password:hashedPassword }, (error, results)=>{
        if (error){
            console.log(error);
        }else{
            console.log(results)
            return res.render('register',{
                success:"User registered successfully"
        })
       }
      })

    });
  
}


//login handler
exports.login = (req, res) => {
  const { email, password } = req.body;

  db.query('SELECT * FROM uesrs  WHERE email = ?', [email], async (error, results) => {
    if (error) {
      console.log(error);
    }

    if (results.length === 0) {
      return res.render('login', {
        wrongDetails: 'Email is incorrect',
      });
    }

    const user = results[0];
    const isPasswordValid = await bcrypt.compare(password, user.password);

       if (isPasswordValid) {
        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
        expiresIn:"1h",
    
      });
        res.cookie('jwt', token, {
        httpOnly: true, 
      });

      res.redirect('/'); 
    } else {
      return res.render('login', {
        wrongDetails: 'Password is incorrect',
      });
    }
  });
};

/*
exports.userProfile = (req, res) => {
      
    const token = req.cookies.jwt;
 
  
    if (!token) {
        return res.redirect('/login');
    }
  
      jwt.verify(token, process.env.JWT_SECRET, (err, decodedToken) => {
      if (err) {
        console.log(err);
          return res.redirect('/login');
      }

      console.log('Decoded Token:', decodedToken);
  
      const userId = decodedToken.id;
  
      db.query('SELECT * FROM uesrs WHERE id = ?', [userId], (error, results) => {
        if (error) {
          console.log(error);
          return res.redirect('/login');
        }
        
        res.render('userProfile', {
          user: results[0], // Assuming that the user information is in the first result
        });
      });
    });
  
};
*/








