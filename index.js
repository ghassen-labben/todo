const express = require("express");
const path = require('path');
const port = 80;
const db = require("./config/mongoose");
const Todo = require("./models/todo")
const app = express();


app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded());
app.use(express.static("assets"));




app.get("/", (req, res) => {

    //  console.log('from the get route controller', req.name);
    Todo.find({}, function (err, tasks) {
        if (err) {
            console.log("error in fetching data");
            return;
        }
        return res.render('home', {
            title: "Todo",
            tasks_list: tasks
        });
    })

})

app.post("/createtask", (req, res) => {
    Todo.create({
        description: req.body.description,
        category: req.body.category,
        date: req.body.date,
        name: req.body.name

    }, (err, newTask) => {
        if (err) {
            console.log("error ", err);
            return;
        }

        console.log(`the server running in ${port}`);
        return res.redirect('back');
    })
});






app.post("/delete-tasks", function (req, res) {
    // If user haven't selected any task to delete
    if (req.body.id == undefined) {
        console.log("User haven't selected any task to delete");
        return res.redirect('back');
    }
    // If only one task is to be deleted
    else if (typeof (req.body.id) == 'string') {
        Todo.findByIdAndDelete(req.body.id, function (err) {
            if (err) {
                console.log("error deleting task ");
                return;
            }
            return res.redirect('back');
        });
    }
    // If multiple tasks are to be deleted
    else {
        for (let i of req.body.id) {
            Todo.findByIdAndDelete(i, function (err) {
                if (err) {
                    console.log("error deleting tasks ");
                    return;
                }
            });
        }
        return res.redirect('back');
    }
});








app.listen(port, (err) => {
    if (err)
        console.log('ther is error in starting server');
    console.log(`runnig in port ${port}`);
})