const modeluser = require('../models/models.users');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const jwt = require('jsonwebtoken');
const config = require('../config/config.jwt')
const config_rstpwd = require('../config/config.rstpwd')
const nodemailer =  require('nodemailer')

// GET ALL USERS
exports.getAll = (req, res) => {
    modeluser.find((err, data) => {
        if (err) {
            res.status(500).send({
                message: err.message || "Server error getting all users"
            });
        }
        else{
            res.status(200).send(data);
        }
    })
};

// GET A SINGLE USER
exports.getOne = (req, res) => {

    if(!req.params.id){
        res.status(400).send({
            message: "Error: user id not sprecified"
        });
    }

    modeluser.findById( req.params.id, (err, data) => {
        if (err) {
            res.status(500).send({
                message: err.message || "Server error getting user"
            });
        }
        else{
            res.status(200).send(data);
        }
    })
};

// CREATE NEW USER
exports.create = (req, res) => {

    if(!req.body.username){
        res.status(400).send({
            message: "Username is missing"
        });
    }
    if(!req.body.email){
        res.status(400).send({
            message: "Email is missing"
        });
    }
    if(!req.body.password){
        res.status(400).send({
            message: "Password is missing"
        });
    }

    modeluser.find( {email:req.body.email}, (err, data) => {
        if (err) {
            res.status(500).send({
                message: err.message || "Server error getting user"
            });
        }
        else{
            if (data.length > 0) {
                res.status(400).send({
                    message: "Email is already registered"
                });
            }
        }
    })

    const pwd_hash = bcrypt.hashSync(req.body.password, saltRounds);

    const user = new modeluser({
		username: req.body.username,
		email: req.body.email,
        password: pwd_hash,
        createdAt: new Date(),
        updatedAt: new Date()
	});

    user.save((err,data) => {
        if (err) {
            res.status(500).send({
                message: err.message || "Server error creating user"
            });
        }
        else{
            
            const token = jwt.sign({id: user._id}, config.secret, {
                expiresIn: 86400
                // 1 DAY IN SEC = 60sec * 60min * 24h
            });

            res.set('user_id', user._id)
            res.set('access-token', token);

            res.status(200).send({
                message: "user created succesfully",
                user_id: user._id,
                auth: true,
                token
            });
        }
    })
};

//UPDATE A USER
exports.update = (req, res) => {

    req.body.updatedAt = new Date();

    if(!req.params.id){
        res.status(400).send({
            message: "Error: user id not sprecified"
        });
    }

    bcrypt.compare(req.body.password, req.body.pwd, function(err, auth){
        if (auth == true) {
            
            modeluser.updateOne({ _id: req.params.id }, { 
                username: req.body.username,
                email: req.body.email,
                updatedAt: req.body.updatedAt}, (err,data) => {

                if (err) {
                    res.status(500).send({
                        message: err.message || "Server error updating user"
                    });
                }
                else{
                    modeluser.findById( req.params.id, (err, data) => {
                        if (err) {
                            res.status(500).send({
                                message: err.message || "Server error getting user"
                            });
                        }
                        else{
                            res.status(200).send(data);
                        }
                    })
                }
            });
        }
        else {
            res.status(400).send({
                message: "Error: password incorrect"
            }); 
        }
    })
};

// CHANGE PASSWORD
exports.updatepwd = (req, res) => {

    req.body.updatedAt = new Date();

    if(!req.params.id){
        res.status(400).send({
            message: "Error: user id not specified"
        });
    }
    if(!req.body.oldpwd || !req.body.newpwd || !req.body.pwd){
        res.status(400).send({
            message: "Error: arguments missing"
        });
    }

    bcrypt.compare(req.body.oldpwd, req.body.pwd, function(err, auth){
        if (auth == true) {
            
            req.body.password = bcrypt.hashSync(req.body.newpwd, saltRounds)
            
            modeluser.updateOne({ _id: req.params.id }, { 
                password: req.body.password,
                updatedAt: new Date()}, (err,data) => {

                if (err) {
                    res.status(500).send({
                        message: err.message || "Server error updating user"
                    });
                }
                else{
                    modeluser.findById( req.params.id, (err, data) => {
                        if (err) {
                            res.status(500).send({
                                message: err.message || "Server error getting user"
                            });
                        }
                        else{
                            res.status(200).send(data);
                        }
                    })
                }
            });
        }
        else {
            res.status(400).send({
                message: "Error: password incorrect"
            }); 
        }
    })
};

// DELETE USER
exports.delete = (req, res) => {

    if(!req.params.id){
        res.status(400).send({
            message: "Error: user id not sprecified"
        });
    }   

    modeluser.findByIdAndDelete( req.params.id, (err, data) => {
        if (err) {
            res.status(500).send({
                message: err.message || "Server error deleting user"
            });
        }
        else{
            res.status(200).send({
                message: "user deleted succesfully",
                user_deleted: req.params.userId
            });
        }
    })
};

// SIGN IN USER
exports.signin = (req, res) => {

    if(!req.body.email){
        res.status(400).send({
            message: "Email is missing"
        });
    }
    if(!req.body.password){
        res.status(400).send({
            message: "Password is missing"
        });
    }

    modeluser.findOne({email: req.body.email}, (err, data) =>{     
        if (err) {
            res.status(500).send({
                message: err.message || "email is not register"
            });
        }
        else{

            bcrypt.compare(req.body.password, data.password, function(err, auth) {
                
                if (auth === false) {
                    return res.status(401).send({
                        message: "password or email incorrect",
                        auth: false, 
                        token: null
                    });
                }
                    // GENERATE TOKEN
                    const token = jwt.sign({id: data.id}, config.secret, {
                        expiresIn: 86400
                        // 1 DAY IN SEC = 60sec * 60min * 24h
                    })
                    res.set('access-token', token);
                    res.set('user_id',data.id)

                    res.status(200).send({
                        message: "Great to have you back:)",
                        auth: true,
                        token,
                        user_id: data.id,
                    }); 
            });            
        }
    });
};

// FROGOT PASSWORD
exports.forgotpwd = (req, res) => {
    
    if(!req.body.email){
        res.status(400).send({
            message: "Email is missing"
        });
    }

    modeluser.find( {email:req.body.email}, (err, data) => {
        if (err) {
            res.status(500).send({
                message: err.message || "Server error getting user"
            });
        }
        else{
            if (data.length == 0) {
                res.status(400).send({
                    message: "Email is not registered"
                });
            }
            const id = data[0]._id
            const token = jwt.sign({id}, config_rstpwd.secret, {
                expiresIn: 900
                // 15 MIN IN SEC = 60sec * 15min
            });

            const transporter = nodemailer.createTransport({
                service: 'gmail',
                auth:{
                    user: 'tosochoman@gmail.com',
                    pass: 'nbtmthyqherwmnms'
                }
            })

            const link = `http://localhost:4200/reset-password;id=${id};token=${token}`

            const mailOptions = {
                to: req.body.email,
                subject: 'Recuperar contraseña Biyuyo',
                text: link
            }
             transporter.sendMail(mailOptions,(err, data) => {
                if(err){
                    res.status(500).send({
                        message: err.message || "Server error sending email"
                    });
                }
                else{
                    res.status(200).send({
                        message: 'Password reset link has been sent to your email, It expires in 15 minutes'
                    })
                }
             })

        }
    })
    
};

// RESET PASSWORD
exports.resetpwd = (req, res) => {

    if(!req.body.password){
        res.status(400).send({
            message: "Error: password is not specified"
        });
    }

    req.body.password = bcrypt.hashSync(req.body.password, saltRounds)
            
            modeluser.updateOne({ _id: req.params.id }, { 
                password: req.body.password,
                updatedAt: new Date()}, (err,data) => {

                if (err) {
                    res.status(500).send({
                        message: err.message || "Server error updating user"
                    });
                }
                else{
                    res.status(200).send({
                        message: "password reseted succesfully",
                    });
                }
            });
};