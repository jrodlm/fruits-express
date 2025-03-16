//  Dependency Imports 
const express = require('express')
const dotenv = require('dotenv')
dotenv.config() // create the process .env object, and puts all of our .env file key:value pairs into that process.env object
const mongoose = require('mongoose')
const app = express()
const PORT = process.env.PORT || 4000
const Fruit = require('./models/fruit')
const methodOverride = require('method-override')
const morgan = require('morgan')
const path = require("path");

//DATABASE CONNECTION
mongoose.connect(process.env.MONGODB_URI)
mongoose.connection.on("connected", () => {
    console.log(`connected to mongodb ${mongoose.connection.name}`)
})

// MIDDLEWARE 
app.use(express.urlencoded({ extended: false }))
app.use(methodOverride("_method"))
app.use(morgan("dev"))

// new code below this line
app.use(express.static(path.join(__dirname, "public")));

// new code above this line
app.get("/", async (req, res) => {
  res.render("home.ejs");
});


// ROUTES // 
// I.N.D.U.C.E.S 

// ROOT/HOME
app.get('/', async (req, res) => {
    res.render('home.ejs')
})

// INDEX
app.get('/fruits', async (req, res) => {
    const allFruits = await Fruit.find()
    console.log(allFruits)
    res.render('fruits/index.ejs', {
        allFruits: allFruits
    })
})


//NEW
app.get('/fruits/new', (req, res) => {
    res.render('fruits/new.ejs')
})

// DELETE
app.delete("/fruits/:fruitId", async (req, res) => {
    await Fruit.findByIdAndDelete(req.params.fruitId);
    res.redirect("/fruits");
  });
  
  

// UPDATE
// server.js

app.put("/fruits/:fruitId", async (req, res) => {
    // Handle the 'isReadyToEat' checkbox data
    if (req.body.isReadyToEat === "on") {
      req.body.isReadyToEat = true;
    } else {
      req.body.isReadyToEat = false;
    }
    
    // Update the fruit in the database
    await Fruit.findByIdAndUpdate(req.params.fruitId, req.body);
  
    // Redirect to the fruit's show page to see the updates
    res.redirect(`/fruits/${req.params.fruitId}`);
  });
  


// CREATE 
app.post('/fruits', async (req, res) => {
    if (req.body.isReadyToEat === 'on') {
        req.body.isReadyToEat = true;
    } else {
        req.body.isReadyToEat = false;
    }
    await Fruit.create(req.body)
    console.log(req.body)
    res.redirect('/fruits')
})

// EDIT
// GET localhost:3000/fruits/:fruitId/edit
app.get("/fruits/:fruitId/edit", async (req, res) => {
    const foundFruit = await Fruit.findById(req.params.fruitId);
    res.render("fruits/edit.ejs", {
      fruit: foundFruit,
    });
  });
  
  
  

// SHOW
app.get('/fruits/:fruitId', async (req, res) => {
    const foundFruit = await Fruit.findById(req.params.fruitId)
    res.render('fruits/show.ejs', {
        foundFruit: foundFruit
    })
})



app.listen(PORT, () => {
    console.log(`listening on port: ${PORT}`)
})