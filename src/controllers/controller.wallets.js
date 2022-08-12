const modelwallet = require('../models/models.wallets');

// GET ALL THE WALLETS OF A USER
exports.getAll = (req, res) => {

    if(!req.params.id){
        res.status(400).send({
            message: "Error: user id not sprecified"
        });
    }

    modelwallet.find({user_id: req.params.id},(err, data) => {
        if (err) {
            res.status(500).send({
                message: err.message || "Server error getting all user's wallets"
            });
        }
        else{
            res.status(200).send(data);
        }
    })
};

// GET A WALLET
exports.getOne = (req, res) => {

    if(!req.params.id){
        res.status(400).send({
            message: "Error: user id not sprecified"
        });
    }

    modelwallet.findById( req.params.id, (err, data) => {
        if (err) {
            res.status(500).send({
                message: err.message || "Server error getting wallet"
            });
        }
        else{
            res.status(200).send(data);
        }
    })
};

// CREATE WALLET
exports.create = (req, res) => {

    if(!req.body.name){
        res.status(400).send({
            message: "Name is missing"
        });
    }
    if(!req.body.user_id){
        res.status(400).send({
            message: "User_id is missing"
        });
    }

    if(!req.body.type){
        res.status(400).send({
            message: "type is missing"
        });
    }

    const wallet = new modelwallet({
		name: req.body.name,
		user_id: req.body.user_id,
        type: req.body.type,
        createdAt: new Date(),
        updatedAt: new Date(),
        initial_amount: req.body.initial_amount,
        total_amount: req.body.total_amount
	})

    wallet.save((err,data) => {
        if (err) {
            res.status(500).send({
                message: err.message || "Server error creating wallet"
            });
        }
        else{
            res.status(200).send(data);
        }
    })
};

// UPDATE WALLET
exports.update = (req, res) => {

    req.body.updatedAt = new Date();

    if(!req.params.id){
        res.status(400).send({
            message: "Error: wallet id not sprecified"
        });
    }

    modelwallet.findByIdAndUpdate(req.params.id , { 
                        name: req.body.name,
                        // type: req.body.type,
                        updatedAt: req.body.updatedAt,
                        initial_amount: req.body.initial_amount,
                        total_amount: req.body.total_amount
                        }, (err,data) => {
        if (err) {
            res.status(500).send({
                message: err.message || "Server error updating wallet"
            });
        }
        else{   
            res.status(200).send(data);  
        }
    });
};

// DELETE WALLET   
exports.delete = (req, res) => {

    if(!req.params.id){
        res.status(400).send({
            message: "Error: wallet id not sprecified"
        });
    }   

    modelwallet.findByIdAndDelete( req.params.id, (err, data) => {
        if (err) {
            res.status(500).send({
                message: err.message || "Server error deleting wallet"
            });
        }
        else{
            res.status(200).send({
                message: "wallet deleted succesfully",
                wallet_deleted: req.params.userId
            });
        }
    })
};