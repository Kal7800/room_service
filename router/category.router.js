const express = require('express');
const router = express.Router();
const categoryService = require('./../service/service.category');
const validatorHandler = require('./../middleware/validator.handler');
const {getCategory} = require('./../schema/category.schema');
const serviceCategory = new categoryService();


router.get('/',async (req,res,next)=>{
    try {
    const data = await serviceCategory.find();
    res.json(data);
    } catch (error) {
        next(error);
    }
})

router.get('/:id',
validatorHandler(getCategory, 'params'),
 async (req,res,next)=>{
    try {
        const {id} = req.params;
        const data = await serviceCategory.findOne(id);
        res.json(data);
    } catch (error) {
        res.statusCode(404).json({
            message: error.message
        })
        next(error)
    }
})

module.exports = router;