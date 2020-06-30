const express = require('express');
const router = express.Router();
const Order = require('../models/order');
const Product = require('../models/product');


router.get('/',(req,res)=>{
   Order.find()
   .populate('product','title')
   .then(data=>{
       res.json({
           count:data.length,
           orders:data.map(doc=>{
               return {
                   product:doc.product,
                   quantity:doc.quantity,
                   _id: doc._id,
                   request:{
                       type:"GET",
                       url:"http://localhost:6000/orders/"+doc._id
                   }
               }
           })
       })
   })
   .catch(err=>{
       res.status(500).json(err);
   })
})

router.post('/',(req,res)=>{
    Product.findById(req.body.productId)
    .then(product=>{
        if(!porduct){
            res.status(500).json({
                message:"Porduct not Found"
            })
        }
            const order = new Order({
                product:req.body.productId,
                quantity:req.body.quantity
            });
            order.save()
            .then(data=>{
                res.status(200).json({
                    message:"data add Successfully!",
                    ordered:data,
                    request:{
                        type:"GET",
                        url:"http://localhost:6000/orders/"
                    }
                })
            })
    })
    .catch(err=>{
        res.status(500).json(err);
    })
    
})

router.get('/:orderId',(req,res)=>{
    Order.findById(req.params.orderId)
    .populate('product')
    .select('product quantity _id')
    .then(data=>{
        res.status(200).json({
           data,
           request:{
               type:"GET",
               url:"http://localhost:6000/orders/"
           }
        })
    })
})

router.delete('/:orderId',(req,res)=>{
    Order.findByIdAndDelete(req.params.orderId)
    .then(data=>{
        res.status(200).json({
            message:"Delete Successfully!",
            request:{
                type:"GET",
                url:"http://localhost:6000/orders/"
            }
        })
    })
})


module.exports = router;