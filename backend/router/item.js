const express = require('express');
const router = express.Router();
const User = require('../models/User');
const authMiddleware = require('../middleware/authMiddleware');
const Item = require('../models/Item');

// create an item

router.post('/', authMiddleware, async (req, res) => {
    try {
        const userId = req.user.id;
        const {itemName, Description, type, Location, date,contactInfo} = req.body;

        if(!itemName || !Description || !type || !Location || !date || !contactInfo){
            return res.status(400).json({ success: false, message: "Please enter all fields" });
        }

        const user = await User.findById(userId);

        if(!user){
            return res.status(400).json({ success: false, message: "User does not exist" });
        }

        const item = await Item.create({
            userId,
            itemName,
            Description,
            type,
            Location,
            date,
            contactInfo
        });

        return res.status(200).json({ success: true, message: "Item created successfully", item });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
    // res.json({success: true, user: req.user });
});

// / to get all the items

router.get('/', authMiddleware, async (req, res) => {
    try {
        const items = await Item.find();
        if(!items){
            return res.status(400).json({ success: false, message: "No items found" });
        }
        return res.status(200).json({ success: true, items : items });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
});

// /:id to fing an item by id

router.get("/search",authMiddleware, async (req, res) => {
    try {
        const {itemName} = req.query;

        if(!itemName){
            return res.status(404).json({
                success : false,
                message : "Please provide the itemName first"
            })
        }

        const item = await Item.findOne({
            itemName
        });

        if(!item){
            return res.status(404).json({
                success : false,
                message : "Did not got any items"
            })
        }

        return res.status(200).json({
            success : true,
            message : "Item fetched successfully",
            data : item
        })
    } catch (error) {
        console.log("Internal server error : ",error);
        return res.status(500).json({
            success : false,
            message : "Internal server error"
        })
    }
})

// get item by /:id

router.get("/:id",authMiddleware, async (req,res)=>{
    try {
        const {id} = req.params;

        if(!id){
            return res.status(404).json({
                success : false,
                message : "Please provide the id first"
            })
        }

        const item  = await Item.findById({
            _id : id
        });

        if(!item){
            return res.status(404).json({
                success : false,
                message : "Did not got any items"
            })
        }

        return res.status(200).json({
            success : true,
            message : "item fetched successfully",
            data : item
        })
    } catch (error) {
        console.log("Internal server error : ",error);
        return res.status(500).json({
            success : false,
            message : "Internal server error"
        })
    }
})

// update bbok details

router.put("/:id", async (req,res)=>{
    try {
        const userId = req.user.id;
        const {id} = req.params;

        if(!id){
            return res.status(404).json({
                success : false,
                message : "Please provide the id first"
            })
        }

        const user = await User.findById(userId);

        if(!user){
            return res.status(401).json({
                success : false,
                message : "Please authenticate first"
            })
        }

        const item  = await Item.findById({
            _id : id
        });

        if(!item){
            return res.status(404).json({
                success : false,
                message : "Did not got any items"
            })
        }

        const newitem = await items.findByIdAndUpdate({
            _id : id
        }, {
            $set : req.body
        }, {
            new : true,
        });

        return res.status(200).json({
            success : true,
            message : "item updated successfully",
            data : newitem
        })
    }catch(error){
        console.log("Internal server error : ",error);
        return res.status(500).json({
            success : false,
            message : "Internal server error"
        })
    }
})

// /:id delete an item by id

router.delete("/:id", async (req,res)=>{
    try {
        const userId = req.user.id;
        const {id} = req.params;

        if(!id){
            return res.status(404).json({
                success : false,
                message : "Please provide the id first"
            })
        }

        const user = await User.findById(userId);

        if(!user){
            return res.status(401).json({
                success : false,
                message : "Please authenticate first"
            })
        }

        const item  = await Item.findById({
            _id : id
        });

        if(!item){
            return res.status(404).json({
                success : false,
                message : "Did not got any item"
            })
        }

        const newItem = await Item.findByIdAndDelete({
            _id : id
        });

        return res.status(200).json({
            success : true,
            message : "Item deleted successfully",
            data : newItem
        })
    }catch(error){
        console.log("Internal server error : ",error);
        return res.status(500).json({
            success : false,
            message : "Internal server error"
        })
    }
})

module.exports = router;