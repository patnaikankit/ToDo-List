const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const date = require(__dirname + "/date.js")
const _ = require('lodash');

const app = express();

// let items = ["a","b","c"];
// let workitems = [];

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended : true}));

app.use(express.static('public'));

mongoose.set('strictQuery',false);
mongoose.connect("mongodb://0.0.0.0:27017/todolistDB",function(){
    console.log("Connected to mongoose");
});

const itemSchema = ({
    name: String
})

const Item = mongoose.model("Item",itemSchema);

const item1 = new Item({
    name: "Welcome to your todolist!"
})

const item2 = new Item({
    name: "Hit the + button to add a new item"
})

const item3 = new Item({
    name: "<-- Hit this to delete an item"
})

// item1.save();
// item2.save();
// item3.save();

const defaultItems = [item1, item2, item3];

const listSchema = {
    name: String,
    items: [itemSchema]
}

const List = mongoose.model("List",listSchema);

// Item.insertMany(defaultItems,function(err){
//     if(err){
//         console.log(err);
//     }
//     else{
//         console.log("Items added successfully!");
//     }
// })

app.get("/",function(req,res){
    // let day = date.getDate();
    Item.find({},function(err,foundItems){
        if(foundItems.length === 0){
        Item.insertMany(defaultItems,function(err){
        if(err){
            console.log(err);
        }
        else{
            console.log("Items added successfully!");
        }
    })
        }
        else{
            res.render("list",{listTitle:"Today", newListItem:foundItems});
        }
        // res.render("list",{listTitle:"Today", newListItem:foundItems});
    })
    // res.render("index",{listTitle:"Today", newListItem:items});
});

app.post("/",function(req,res){
    let itemName = req.body.newItem;
    const listName = req.body.list;
    const itemNew = new Item({
        name: itemName
    })
    if(listName === "Today"){
        itemNew.save();
        res.redirect("/");
    }
    else{
        List.findOne({name: listName},function(err,foundList){
            foundList.items.push(itemNew);
            foundList.save();
            res.redirect("/" + listName);
        })
    }
    // if(req.body.list === "Work"){
    //     workitems.push(item);
    //     res.redirect("/work");
    // }
    // else{
    //     items.push(item);
    //     res.redirect("/");
    // }
})

app.post("/delete",function(req,res){
    const checkedItem = req.body.box;
    const listName = req.body.listName;

    if(listName === "Today"){
        Item.findByIdAndRemove(checkedItem,function(err){
            if(err){
                console.log(err);
            }
            else{
                console.log("Deleted Successfully!");
                res.redirect("/");
            }
        })
    }
    else{
        List.findOneAndUpdate({name: listName}, {$pull: {items: {_id: checkedItem}}}, function(err,foundList){
            if(!err){
                res.redirect("/" + listName);
            }
        })
    }

    // Item.findByIdAndRemove(checkedItem,function(err){
    //     if(err){
    //         console.log(err);
    //     }
    //     else{
    //         console.log("Deleted Successfully!");
    //         res.redirect("/");
    //     }
    // })
})

app.get("/:customListName",function(req,res){
    const customListName = _.capitalize(req.params.customListName);

    List.findOne({name: customListName},function(err,foundList){
        if(!err){
            if(!foundList){
                // Create a new list
                const list = new List({
                    name: customListName,
                    items: defaultItems
                })
                list.save()
                res.redirect("/" + customListName);
            }
            else{
                // Show an existing list
                res.render("list",{listTitle: foundList.name, newListItem:foundList.items});
            }
        }
    })
})


app.listen(3000,function(){
    console.log("Server is running on port 3000")
})