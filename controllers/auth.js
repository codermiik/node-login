const mysql = require('mysql');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs')



const db=mysql.createConnection({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE
 })


 //register page handler

exports.register=(req , res)=>{
    console.log(req.body);

  /*  const name = req.body.name;
    const email = req.body.email;
    const password = req.body.password;
    const passwordConfirm = req.body.passwordConfirm; */
    

         //or you can destructure

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
       // expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRES * 24 * 60 * 60 * 1000), // Cookie expiration time
        httpOnly: true, // 
      });

      res.render('./index'); 
    } else {
      return res.render('login', {
        wrongDetails: 'Password is incorrect',
      });
    }
  });
};







