const http = require('http');
const bodyparser =require('body-parser');
const cors = require('cors');
var mongoose = require('mongoose');
var multer =require("multer");
var nodemailer=require("nodemailer");


const port =8080;

var url = "mongodb://localhost:27017/vayuz";

const path = require('path');
const express = require('express');
const app= express();
app.use(cors());
app.use(bodyparser.json());
app.use("/images",express.static(path.join("./Images")))
app.use(express.static(path.join(__dirname + "/dist")))

const MIME_TYPE_MAP={
    'image/png':'png',
    'image/jpeg':'png',
    'image/jpg':'jpg',
}

const storage =multer.diskStorage({
    destination:(req,file,cb)=>{
        const inValid=MIME_TYPE_MAP[file.mimetype];
        let error= new Error("Invalid Extension");
        if(inValid){
            error=null;
        }
        cb(error,"./Images");
    },
    filename:(req,file,cb)=>{
        const name=file.originalname.toLowerCase().split(' ').join('-');
        const ext=MIME_TYPE_MAP[file.mimetype];
        cb(null,name + '-' + Date.now()+ '.'+ ext)
    }
});

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
    imagePath:String,
    Music:Boolean,
    Travel:Boolean,
    Technology:Boolean,
    Entertainment:Boolean
});


mongoose.connect(url,{useNewUrlParser:true},{useUnifiedTopology :true});
mongoose.connection.on('error', console.error.bind(console, 'MongoDB connection error:'));

app.get('*',(req,res)=>{
    //   return  res.json({Result:emps});
    
        
        return  res.render(path.join(__dirname + "/dist/task/index.html"));
      
    });
    
    

app.get('/employees',(req,res)=>{
//   return  res.json({Result:emps});
MySchema.find().then(result => {
    
    return  res.json(result);
  
});
});

app.put('/employees',function(req,res){
    let emp = req.body;
    console.log("To be updated: ",emp);
    Emp.updateOne({_id: ObjectId(emp._id)},{$set: {Entertainment:emp.Entertainment,Technology: emp.Technology, Travel: emp.Travel, Music: emp.Music}})
        .then((result)=>{
            console.log(result);
            res.json({result: 'successfully updated.'});
        });
    });

app.post('/employees',multer({storage:storage}).single("Image"),(req,res)=>{
    // let emp =req.body;
    // emps.push(emp);
    // res.json({Result:'Post successfully'});
    const imgurl=req.protocol + '://' + req.get("host");

    //Email otp
    const output=`
    <p>Hello ${req.body.FullName}</p>
    <p> 1111 is your otp</p>
    `;

    let transporter = nodemailer.createTransport({
        host: "mail.google.com",
        service:"Gmail",
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
          user: 'ayushpuri13@gmail.com', // generated ethereal user
          pass: '' // generated ethereal password
        },
        tls:{
            rejectUnauthorized:false
        }
      });
    
      // send mail with defined transport object
      let info = {
        from: '"Vayuz Technology" <ayush.vayuz@gmail.com>', // sender address
        to: req.body.Email, // list of receivers
        subject: "Verificaion Mail", // Subject line
        text: "Hello world?", // plain text body
        html: output // html body
      };

      transporter.sendMail(info, function(error, info){
        if(error)
            return console.log(error);
      });
    
      console.log("Message sent: %s", info.messageId);
      // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
    
      // Preview only available when sending through an Ethereal account
      console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
      // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
    
    

    
    
    var post=new MySchema({
        FullName:req.body.FullName,
        Email:req.body.Email,
        Location:req.body.Location,
        Password:req.body.Password,
        imagePath:imgurl + "/images/" + req.file.filename,
        Music:req.body.Music,
        Entertainment:req.body.Entertainment,
        Travel:req.body.Travel,
        Technology:req.body.Technology
        
    })
    post.save().then(created=>{
    
    res.status(201).json({
        mesasage:"Message posted ",                 
        response:{imagePath:created.imagePath,
                  FullName:req.body.FullName,
                  Email:req.body.Email,
                  Location:req.body.Location,
                   Password:req.body.Password,
                  imagePath:imgurl + "/images/" + req.file.filename,
                   Music:req.body.Music,
                  Entertainment:req.body.Entertainment,
                  Travel:req.body.Travel,
                  Technology:req.body.Technology
        

        
        },
        
                  
});

});
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

app.listen(port,function(){
console.log("Server is listening at port 8080");
});
