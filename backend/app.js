const http = require('http');
const bodyparser =require('body-parser');
const cors = require('cors');
var mongoose = require('mongoose');

const port =3000;

var url = "mongodb://localhost:27017/vayuz";

const path = require('path');
const express = require('express');
const app= express();
app.use(cors());
app.use(bodyparser.json());

const emps = [
    {name:'Ram',id:'1',email:'ram@gmail.com',password:'1234',location:'New delhi'},
    {name:'rahul',id:'2',email:'rahul@gmail.com',password:'3456',location:'Noida'}
]

// app.use('/public', express.static(''./node/firstpage.html'))


// app.get('/',function(req,res){
    
//     res.sendFile(path.join(__dirname + '/firstpage.html'));

// });
var MySchema =mongoose.model('Test',{FullName:String,
    Email:String,
    Location:String,
    Password:String,
});


mongoose.connect(url,{useNewUrlParser:true},{useUnifiedTopology :true});
mongoose.connection.on('error', console.error.bind(console, 'MongoDB connection error:'));

app.get('/employees',(req,res)=>{
//   return  res.json({Result:emps});
MySchema.find().then(result => {
    console.log(result);
    return  res.json(result);
  
});
});

app.post('/employees',(req,res)=>{
    // let emp =req.body;
    // emps.push(emp);
    // res.json({Result:'Post successfully'});
    
    var post=new MySchema({
        FullName:req.body.FullName,
        Email:req.body.Email,
        Location:req.body.Location,
        Password:req.body.Password,
        
    })
    post.save();
    
    res.status(201).json({mesasage:"Message posted "});
});

// app.delete('/employees',(req,res)=>{
//     let emp=req.body;
//     for(let e of emps)
//     {
//         if(e.name===emp.name)
//         {
//             emps.splice(emps.indexOf(emp),1);
//             break;
//         }
//     }
//     res.json({Result:"successfully deleted"});
// })

app.listen(8080,function(){
console.log("Server is listening at port 8080");
});
