const express = require('express');
const app = express()
const productRouter = require('./api/routes/products');
const orderRouter = require('./api/routes/orders');
const morgan = require('morgan');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const port = process.env.PORT || 6000;

//middleware
app.use(morgan('dev'))
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true}))
 
// parse application/json
app.use(bodyParser.json())

app.use((req,res,next)=>{
    res.header('Access-Control-Allow-Origin',"*");
    res.header('Access-Control-Allow-Headers','Origin,X-Requested-With,Content-Type,Accept,Authorization');

    if(req.method === "OPTION"){
        res.header('Access-Control-Allow-Methods','GET,POST,DELETE,PUT,PATCH');
        return res.status(200).json({});
    }
    next();
})

//connect to mongodb
mongoose.connect(`mongodb://naywin:naywin23@cluster0-shard-00-00-urly7.mongodb.net:27017,cluster0-shard-00-01-urly7.mongodb.net:27017,cluster0-shard-00-02-urly7.mongodb.net:27017/node-rest-shop?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin&retryWrites=true&w=majority`, { useUnifiedTopology: true ,useNewUrlParser: true})
.then(data=>{
    console.log('connect success')
})
.catch(err=>console.log(err));
//Handling Route Request
app.use('/products',productRouter);
app.use('/orders',orderRouter)



//Handling error
app.use((req,res,next)=>{
    let error = new Error('Not Found');
    error.status = 404;
    next(error);
})
app.use((error,req,res,next)=>{
    res.status(error.status|| 500);
    res.json({
        error:error.message
    })
})

app.listen(port,(req,res)=>{
    console.log(`Your App is running at ${port}`);
})

