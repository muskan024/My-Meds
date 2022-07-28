require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const connection = require("./db");
const userRoutes = require("./routes/users");
const authRoutes = require("./routes/auth");
const mediRoutes = require("./routes/medicines");
const mediRead = require("./routes/read");
const mediDelete = require("./routes/delete");
const mediEdit = require("./routes/editmedi");
const userEdit = require("./routes/useredit");
const passwordResetRoutes = require("./routes/passwordReset");
const sendEmail = require("./utils/sendEmail");


// const mediEditn = require("./routes/editmedin");
const cookieParser = require('cookie-parser')
const Medi = require("./models/medi");
const User = require("./models/user");
const cron = require('node-cron');
var nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'mymedscare@gmail.com',
    pass: 'Mymedscare#1'
  }
});

// database connection
connection();

// middlewares
app.use(express.json());
app.use(cors());
// app.use(cors({credentials:true,origin:'http://localhost:3000',    allowedHeaders: ['Content-Type', 'Authorization'],
// }));

app.use(cookieParser());

// routes
app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/medicines", mediRoutes);
app.use("/api/mediRead", mediRead);
app.use("/api/delete", mediDelete);
app.use("/api/editmedi/", mediEdit);
app.use("/api/edituserdet/", userEdit);
app.use("/api/password-reset", passwordResetRoutes);


var date = new Date();


const port = process.env.PORT || 8080;
app.listen(port, console.log(`Listening on port ${port}...`));


cron.schedule('*/2 * * * *', async function () {
    console.log('---------------------');
    console.log('Running Cron Job');
    const stock = await Medi.find({medicineCount:{$lte:10}});
    
    console.log(stock);
   
    for(let j = 0; j<stock.length; j++){
      let id = stock[j].kid;
      console.log(`id is ${id}`);
     
      console.log("Stock case 1");
      let msg = "Your stock for medicice " + stock[j].medicineName + "is Below 10, Please fill this up";
      console.log(msg);
      console.log(stock[j].medicineName);
      // const user = User.findById(id ,(err,doc)=>{
      //   if(err){
      //     console.log("Yup1");
      //     console.log(err);
      //   }
      //   else{
      //     console.log("Yup2");
      //     console.log(doc);
      //   }
      // });
      // // if(stock[j].medicineCount <=10){
      //   console.log("case 2");
        await sendEmail("kanhaiyabhayana1@gmail.com", "Medicine Stock Down", msg);
      // }
    }
    // if(stock){
    // }
    var date = new Date()
    // var day = date.getDate();
    // var month = date.getMonth() + 1;
    // var year = date.getFullYear();
    // var today = year + "-" + month + "-" + day;
    // console.log(today)
    const medicineTime = await Medi.find().sort({ 'time': 1 });
    for (let i = 0; i < medicineTime.length; i++) {
      if (Number(medicineTime[i].medicineTime.split(":")[0]) === date.getHours() && Number(medicineTime[i].medicineTime.split(":")[1])-date.getMinutes()<= 5 && Number(medicineTime[i].medicineTime.split(":")[1])-date.getMinutes() >= 0) {
        
        // const user = await User.find({_id:medicineTime[i].kid});
        console.log(`Before update ${medicineTime[i]}`);
        var mailOptions = {
          from: '"mymedscare@gmail.com" <no-reply@mymedscare.com>',
          to: 'kanhaiyabhayana1@gmail.com',
          subject: 'MEDICINE REMINDER',
          text: `Reminder For Taking Medicine Scheduled at " + medicineTime[i].medicineTime `,
          html:  "<p>Hey Dear, It's time to take the medicine <b><i>" + medicineTime[i].medicineName +" .</i></b></p><br><br><p>Regards,</p><h3>MyMeds<br>We Care For Your Health!</h3>"
        };
        
        transporter.sendMail(mailOptions, function(error, info){
          if (error) {
            console.log(error);
          } else {
            console.log('Email sent: ' + info.response);
          }
        });
        
      
      }
    }
  });