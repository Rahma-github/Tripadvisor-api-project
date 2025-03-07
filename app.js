const express = require('express');
const mongoose = require('mongoose');
const path = require("path");
const cors=require('cors');
const { log } = require('console');

require('dotenv').config()

const PORT=process.env.PORT;
const URL=process.env.MONGODB_URI.replace('<db_password>',process.env.MONGODB_PASSWORD);

const app = express();
app.use(express.json());
app.use(cors());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

//routes
app.use('/api/auth',require('./routes/auth'));
app.use('/api/reviews',require('./routes/review'));
app.use("/api/trips", require("./routes/trip"));
app.use("/api/attractives", require("./routes/attractive"));
app.use("/api/flights", require("./routes/flight"));

app.use("/api/destination", require("./routes/destination"));
app.use("/api/feature", require("./routes/feature"));
app.use("/api/hotel", require("./routes/hotel"));
app.use("/api/users", require('./routes/user'));



app.use((err,req,res,next)=>{
    console.log(err);
    
    res.status(err.status || 500).json({
        message:err.message
    })
})

// connect moongose
mongoose.connect(URL).then(()=>{
    console.log('connected to db')
    app.listen(PORT,()=>{
        console.log(`server is running on port ${PORT}`);
    })
}).catch(err=>{
    console.log(err);
})





