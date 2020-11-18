'use strict'
// -------------------------
// Application Dependencies
// -------------------------
const express = require('express');
const pg = require('pg');
const superagent = require('superagent');
const methodOverride = require('method-override');

// -------------------------
// Environment variables
// -------------------------
require('dotenv').config();
const HP_API_URL = process.env.HP_API_URL;

// -------------------------
// Application Setup
// -------------------------
const app = express();
const PORT = process.env.PORT || 3000;

// Express middleware
// Utilize ExpressJS functionality to parse the body of the request
app.use(express.urlencoded({ extended: true }));

// Application Middleware override
app.use(methodOverride('_method'));

// Specify a directory for static resources
app.use(express.static('./public'));
app.use(express.static('./img'));

// Database Setup

const client = new pg.Client(process.env.DATABASE_URL);
client.on('error', err => console.error(err));

// Set the view engine for server-side templating

app.set('view engine', 'ejs');


// ----------------------
// ------- Routes -------
// ----------------------
app.get('/home',handelHomePage);
app.get('/house_name/Gryffindor',handeGryffindor);
app.get('/house_name/Hufflepuff',handeHufflepuff);
app.get('/house_name/Ravenclaw',handeRavenclaw);
app.get('/house_name/Slytherin',handeSlytherin);
app.post('/my-characters',handelAddingToDatabase);
app.get('/my-characters',handelGettingData);
app.get('/character/:id',handelDeatails);
app.put('/character/:id',handelUpdating);
app.delete('/character/:id',handelDeleting);
app.get('/*',handelError);

// --------------------------------
// ---- Pages Routes functions ----
// --------------------------------

function handelHomePage(req,res){
    res.render('pages/home');
}

// -----------------------------------
// --- CRUD Pages Routes functions ---
// -----------------------------------
function handeGryffindor(req,res){
    let glArr = [];
superagent.get('http://hp-api.herokuapp.com/api/characters/house/Gryffindor')
.then(data=>{
   data.body.forEach(value=>{
      glArr.push(new Characters(value));
   })
    
    res.render('pages/charPage',{result:glArr});
}).catch(err=>{
    console.log('There is an error '+err);
})
}


function handeHufflepuff(req,res){
    let glArr = [];
superagent.get('http://hp-api.herokuapp.com/api/characters/house/Hufflepuff')
.then(data=>{
   data.body.forEach(value=>{
      glArr.push(new Characters(value));
   })
    
    res.render('pages/charPage',{result:glArr});
}).catch(err=>{
    console.log('There is an error '+err);
})
}

function handeRavenclaw(req,res){
    let glArr = [];
superagent.get('http://hp-api.herokuapp.com/api/characters/house/Ravenclaw')
.then(data=>{
   data.body.forEach(value=>{
      glArr.push(new Characters(value));
   })
    
    res.render('pages/charPage',{result:glArr});
}).catch(err=>{
    console.log('There is an error '+err);
})
}

function handeSlytherin(req,res){
    let glArr = [];
superagent.get('http://hp-api.herokuapp.com/api/characters/house/Slytherin')
.then(data=>{
   data.body.forEach(value=>{
      glArr.push(new Characters(value));
   })
    
    res.render('pages/charPage',{result:glArr});
}).catch(err=>{
    console.log('There is an error '+err);
})
}

function Characters(data){
    this.image = data.image;
    this.name = data.name;
    this.patronus = data.patronus;
    this.alive = data.alive;
}

function handelAddingToDatabase(req,res){
    let sql = 'INSERT INTO users(charname, patronus, alive) VALUES ($1, $2, $3);';
    let values = [req.body.name, req.body.patronus, req.body.alive];
    client.query(sql,values)
    .then(()=>{
        res.redirect('/my-characters');
    }).catch(err=>{
        console.log('There is an error '+err);
    })
}

function handelGettingData(req,res){
    let sql = 'SELECT * FROM users;';
    client.query(sql)
    .then(data=>{
        res.render('pages/favPage',{result:data.rows});
    }).catch(err=>{
        console.log('There is an error '+err);
    })
}

function handelDeatails(req,res){
    let sql = 'SELECT * FROM users WHERE id=$1;';
    let values = [req.params.id];
    client.query(sql,values)
    .then(data=>{
        res.render('pages/details',{result:data.rows[0]});
    }).catch(err=>{
        console.log('There is an error '+err);
    })
}

function handelUpdating(req,res){
    let sql = 'UPDATE users SET charname=$1, patronus=$2, alive=$3 WHERE id=$4;';
    let values = [req.body.name, req.body.patronus, req.body.alive, req.params.id];
    client.query(sql,values)
    .then(()=>{
        res.redirect('/my-characters');
    }).catch(err=>{
        console.log('There is an error '+err);
    })
}


function handelDeleting(req,res){
    let sql = 'DELETE FROM users WHERE id=$1;';
    let values = [req.params.id];
    client.query(sql,values)
    .then(()=>{
        res.redirect('/my-characters');
    }).catch(err=>{
        console.log('There is an error '+err);
    })
}

function handelError(req,res){
    res.status(404).render('pages/error');
}

// Express Runtime
client.connect().then(() => {
    app.listen(PORT, () => console.log(`Listening on port: ${PORT}`));
}).catch(error => console.log(`Could not connect to database\n${error}`));
