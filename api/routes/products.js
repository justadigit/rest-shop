const express = require('express');
const router = express.Router();
const Product = require('../models/product');


router.get('/',(req,res)=>{
    Product.find()
    .sort({createdAt:-1})
    .select('_id title price')
    .then(data=>{
       res.status(200).json(data);
    })
    .catch(err=>{
        res.json(err);
    })
})

router.post('/',(req,res)=>{
    let product = new Product(req.body);

    product.save()
    .then(data=>{
        res.status(200).json({
            message:"Creating new product",
            createProduct:{
                _id:data._id,
                title:data.title,
                price:data.price,
                request:{
                    type:'GET',
                    url:'http://localhost:6000/products/'+data._id
                }

            }
        });
    })
    .catch(err=>{
        res.status(500).json(err);
    })
})

router.get('/:productId',(req,res)=>{
    let id = req.params.productId;
    Product.findById(id)
    .select('title price _id')
    .then(data=>{
        res.status(200).json({
            product:data,
            request:{
                type:'GET',
                url:"http://localhost:6000/products/"
            }
        });
    })
    .catch(err=>{
        res.status(500).json(err);
    })
})

router.delete('/:productId',(req,res)=>{
   const id = req.params.productId;
   Product.findByIdAndDelete(id)
   .then(data=>{
       res.status(200).json({
           message:"delete Successfully!",
           request:{
               type:"GET",
               url:"http://localhost:6000/products/"
           }
       });
   })
   .catch(err=>{
       res.status(500).json(err);
   })
})

router.patch('/:productId',(req,res)=>{
    const id = req.params.productId;
    Product.findByIdAndUpdate(id,{title:req.body.title,price:req.body.price},(err,doc)=>{
        if(err){
            res.status(500).json(err)
        }else{
            res.status(200).json({
                message:"Updated Successfully!",
                request:{
                    type:"GET",
                    url:"http://localhost:6000/products/"+doc._id
                }
            });
        }
    })
})
module.exports = router;