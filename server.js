const express = require("express")
const app = express()
const mongoose = require("mongoose")
const bodyParser = require("body-parser")
// const User = require("./lib/User")

app.use(bodyParser.urlencoded({extended: true}))
mongoose.connect("mongodb+srv://admin:vlOORPu8XLGWAXfa@cluster0.zasob.mongodb.net/Freelance", {useNewUrlParser: true, useUnifiedTopology: true });

app.use(express.static( "public"));
app.use("/css", express.static(__dirname + "public/css"))
app.use("/img", express.static(__dirname + "public/img"))
app.use("/js", express.static(__dirname + "public/js"))

app.set("views", "./views")
app.set("view engine", "ejs")

const usersSchema = {
    login: String,
    password: String,
}
let User = mongoose.model("users", usersSchema)

const workSchema = {
    title: String,
    description: String,
    requiredSkills: String,
    price: String
}
let Work = mongoose.model("works", workSchema)

let isAuthenticated = false;

app.get("/", function (req, res){
    res.render("index", {isAuthenticated: isAuthenticated})
})
app.get("/about-us", function (req, res){
    res.render("index", {isAuthenticated: isAuthenticated})
})
app.get("/find-work", function (req, res){

    Work.find({}, function(err, aplicationsArray) {
        let aplications = [];
        aplicationsArray.forEach(function(aplication) {
            aplications.push(aplication)
        });
        res.render("find_work", {isAuthenticated: isAuthenticated, aplications: aplications})
    });
})
app.get("/add-work", function (req, res){
    res.render("add_work", {isAuthenticated: isAuthenticated})
})
app.get("/login", function (req, res){
    res.render("login", {isAuthenticated: isAuthenticated, isLoginError: false})
})
app.get("/register", function (req, res){
    res.render("register", {isAuthenticated: isAuthenticated, isRegError: false})
})
app.get("/logout", function (req, res){
    isAuthenticated = false;
    res.render("login", {isAuthenticated: isAuthenticated, isLoginError: false})
})
app.get("/profile", function (req,res) {
    res.render("my_jobs", {isAuthenticated: isAuthenticated})
})


app.post("/login", function (req,res){
    let username = req.body.username;
    let password = req.body.password;

    User.findOne({username: username, password: password}, function (err, user) {
        if(err){
            console.log(err)
        }
        if(user) {
            isAuthenticated = true;
            res.redirect("find-work")
        }
        res.render("login", {isAuthenticated: isAuthenticated, isLoginError: true})
    })
})

app.post("/register", function (req, res){
    let user = new User({
        login: req.body.login,
        password: req.body.password
    })
    user.save((err, doc) =>
        {
            if(err) {
                res.render("register", {isAuthenticated: isAuthenticated, isRegError: true})
                console.log(err)
                return;
            }
            res.redirect("/login")
        }
    );

})

app.post("/add-work", function (req, res){
    let work = new Work({
        title: req.body.title,
        description: req.body.description,
        requiredSkills: req.body.requiredSkills,
        price: req.body.price
    })
    work.save();
})





app.listen(3000, function (){
    console.log("server on port 3000")
})