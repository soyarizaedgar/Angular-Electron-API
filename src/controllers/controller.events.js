const modelevent = require('../models/models.events');
const moment = require('moment');
moment().format(); 
const mongoose = require('mongoose');

// GET ALL THE EVENTS OF A USER 
exports.getAll = (req, res) => {

    if(!req.params.userid){
        res.status(400).send({
            message: "Error: user id not sprecified"
        });
    }
    
    modelevent.find({user_id: req.params.userid, original: true, "invesment.status": false}, (err, data) => {
        if (err) {
            res.status(500).send({
                message: err.message || "Server error getting all users movements"
            });
        }
        else{
            res.status(200).send(data);
        }
    })
};  

// GET THE TOTAL AMOUNT
exports.getTotal = (req, res) => {

    if(!req.params.walletid){
        res.status(400).send({
            message: "Error: user id not sprecified"
        });
    }

    const today = new Date()
    const endOfDay = moment(today).endOf('day')
    
    modelevent.find({wallet_id: req.params.walletid, date: {$lte: endOfDay}}, (err, data) => {
        if (err) {
            res.status(500).send({
                message: err.message || "Server error getting all users movements"
            });
        }
        else{
            sum = 0
            data.forEach(element => {
                sum += element.amount
            });
            res.status(200).send({total_amount: sum});
        }
    })
};  

exports.getInitial = (req, res) => {

    if(!req.params.walletid){
        res.status(400).send({
            message: "Error: wallet id not sprecified"
        });
    }

    const date = req.body.date
    const endOfDay = moment(date).endOf('month')
    
    modelevent.find({wallet_id: req.params.walletid, date: {$lte: endOfDay}}, (err, data) => {
        if (err) {
            res.status(500).send({
                message: err.message || "Server error getting all users movements"
            });
        }
        else{
            sum = 0
            data.forEach(element => {
                sum += element.amount
            });
            res.status(200).send({total_amount: sum});
        }
    })
};  

// GET ALL THE EVENTS OF A USER ON A MONTH
exports.getOneMonth = (req, res) => {

    if(!req.params.walletid){
        res.status(400).send({
            message: "Error: wallet id not specified"
        });
    }
    if(!req.body.date){
        res.status(400).send({
            message: "Error: date not specified"
        });
    }

    const date = req.body.date
    const today = new Date()
    
    const startOfmonth = moment(date).startOf('month')
    let endOfdate
    
    if (moment(today).format('YYYY-MM') === moment(date).format('YYYY-MM')) {
        endOfdate = moment(today).endOf('day')
    }
    else{
        endOfdate = moment(date).endOf('month')
    }
    
    modelevent.find({wallet_id: req.params.walletid, date: {$gte: startOfmonth, $lte: endOfdate}},(err, data) => {
        if (err) {
            res.status(500).send({
                message: err.message || "Server error getting the month's movement"
            });
        }
        else{
            res.status(200).send(data);
        }
    })
}; 
 
// GET A EVENT
exports.getOne = (req, res) => {

    if(!req.params.id){
        res.status(400).send({
            message: "Error: movement id not sprecified"
        });
    }

    modelevent.findById( req.params.id, (err, data) => {
        if (err) {
            res.status(500).send({
                message: err.message || "Server error getting movement"
            });
        }
        else{
            res.status(200).send(data);
        }
    })
};

// CREATE EVENT
exports.create = (req, res) => {

    if(!req.body.title){
        res.status(400).send({
            message: "Title is missing"
        });
    }
    if(!req.body.date){
        res.status(400).send({
            message: "Date is missing"
        });
    }
    if(!req.body.user_id){
        res.status(400).send({
            message: "User id is missing"
        });
    }

    const _id = new mongoose.Types.ObjectId()
    let eventsList = []

    const event = new modelevent({
        _id: _id,
		title: req.body.title,
		wallet_id: req.body.wallet_id,
        amount: req.body.amount,
        date: req.body.date,
        user_id: req.body.user_id,
        updatedAt: new Date(),
        allDay: req.body.allDay,
        rrule:req.body.rrule,
        invesment: req.body.invesment,
        event_id: _id,
        original: true
	})
    eventsList.push(event)

    if (event.rrule.count > 1) {
        const count = event.rrule.count 

        for (let i = 1; i < count; i++) {
            const date_ = moment(new Date(event.date)).add(i, 'months');

            const event_copy = new modelevent({
                _id: new mongoose.Types.ObjectId(),
                title: event.title,
                wallet_id: event.wallet_id,
                amount: event.amount,
                date: date_,
                user_id: event.user_id,
                updatedAt: event.updatedAt,
                allDay: event.allDay,
                rrule:event.rrule,
                event_id: event._id,
                original: false,
                invesment: event.invesment,
            })
            eventsList.push(event_copy)
        }
    }

    if (event.rrule.until) {
        const diff = moment(event.rrule.until).diff(moment(event.rrule.dtstart), "months");
        
        for (let i = 1; i < diff + 1; i++) {
            const date_ = moment(new Date(event.date)).add(i, 'months');

            const event_copy = new modelevent({
                _id: new mongoose.Types.ObjectId(),
                title: event.title,
                wallet_id: event.wallet_id,
                amount: event.amount,
                date: date_,
                user_id: event.user_id,
                updatedAt: event.updatedAt,
                allDay: event.allDay,
                rrule:event.rrule,
                event_id: event._id,
                original: false,
                invesment: event.invesment,
            })
            eventsList.push(event_copy)
        }
    }

    if (!event.rrule.count) {
        const currentMonth = moment(event.date).format('M')
        const diff = 13 - currentMonth

        for (let i = 1; i < diff; i++) {
            const date_ = moment(new Date(event.date)).add(i, 'months');

            const event_copy = new modelevent({
                _id: new mongoose.Types.ObjectId(),
                title: event.title,
                wallet_id: event.wallet_id,
                amount: event.amount,
                date: date_,
                user_id: event.user_id,
                updatedAt: event.updatedAt,
                allDay: event.allDay,
                rrule:event.rrule,
                event_id: event._id,
                original: false,
                invesment: event.invesment,
            })
            eventsList.push(event_copy)
        }
    }
    
    eventsList.forEach(event => {
        event.save((err) => {
            if (err) {
                res.status(500).send({
                    message: err.message || "Server error creating event"
                });
            }
        })
    })
    res.status(200).send({message: "Frequent events updated"})
};

// DELETE EVENT  
exports.delete = (req, res) => {

    if(!req.params.id){
        res.status(400).send({
            message: "Error: event id not sprecified"
        });
    }   

    modelevent.deleteMany( {event_id: req.params.id}, (err, data) => {
        if (err) {
            res.status(500).send({
                message: err.message || "Server error deleting event"
            });
        }
        else{
            res.status(200).send({
                message: "event deleted succesfully",
            });
        }
    })
};

exports.deletemany = (req, res) => {

    if(!req.params.walletid){
        res.status(400).send({
            message: "Error: wallet id not specified"
        });
    }   

    modelevent.deleteMany( {wallet_id: req.params.walletid}, (err, data) => {
        if (err) {
            res.status(500).send({
                message: err.message || "Server error deleting wallet's events"
            });
        }
        else{
            res.status(200).send({
                message: "events deleted succesfully",
                wallet_deleted: req.params.userId
            });
        }
    })
};

// CLEAN DB
exports.clean = (req,res) =>{

    const year = new Date().getFullYear()
    const firstDay= moment(year + '-01-01').endOf('day')
    const lastDay = moment(firstDay).endOf('year').subtract(1, 'year')
    const today = new Date()

    if(today >= lastDay && today <= firstDay){
        modelevent.deleteMany( {date: {$lte: lastDay}}, (err, data) => {
            if (err) {
                res.status(500).send({
                    message: err.message || "Server error deleting events"
                });
            }
            else{
                res.status(200).send({
                    message: "events deleted succesfully",
                });
            }
        })
    }
    else{
        const diff_ = moment(moment(today)).endOf('year').diff(today, 'days')
        res.send({
            message: diff_ + " days until new years",
        });
    }
}

// UPDATE EVENT
exports.update = (req, res) => {

    if(!req.params.id){
        res.status(400).send({
            message: "Error: event id not specified"
        });
    }

    modelevent.find({event_id: req.params.id}, (err, data) => {
        if (err) {
            res.status(500).send({
                message: err.message || "Server error getting events"
            });
        }
        else{

            const new_date = new Date(req.body.date)
            
            data.forEach((element,index) => {
               let date_ =  moment(new_date).add(index, 'months')
               modelevent.findByIdAndUpdate(element._id, { 
                    title: req.body.title,
                    amount: req.body.amount,
                    date: date_,
                    updatedAt: new Date(),
                    rrule:req.body.rrule,
                    event_id: req.body.event_id,
                    invesment: req.body.invesment,
                    wallet_id: req.body.wallet_id,
                    }, (err, data =>{
                        if (err) {
                            res.status(500).send({
                                message: err.message || "Server error updating event"
                            });
                        }
                    }))
            });
            res.status(200).send({"message":"event updated"})
            
        }
    })

};

// UPDATE FREQUENTE EVENTS WITHOUT SPECIFIC ENDING DATE
exports.createFreq = (req,res) =>{

    const year = new Date().getFullYear()
    const firstDay= moment(year + '-01-01').endOf('day')
    const lastDay = moment(firstDay).endOf('year').subtract(1, 'year')
    const startOfDec= moment(lastDay).startOf('month')

    const today = new Date()
    
    if(today >= lastDay && today <= firstDay){
        modelevent.find({"rrule.count": null, "rrule.until":null, date:{$gte: startOfDec, $lte: lastDay}}, 
        (err, data) => {
            if (err) {
                res.status(500).send({
                    message: err.message || "Server error getting all users movements"
                });
            } 
            else{
                let eventsList = []

                data.forEach(event => {

                    for (let i = 1; i < 13; i++){
                        const date_ = moment(new Date(event.date)).add(i, 'months');
                        let original_ =  false
                        if (i == 1){original_ = true}

                        const event_copy = new modelevent({
                            _id: new mongoose.Types.ObjectId(),
                            title: event.title,
                            wallet_id: event.wallet_id,
                            amount: event.amount,
                            date: date_,
                            user_id: event.user_id,
                            updatedAt: event.updatedAt,
                            allDay: event.allDay,
                            rrule:event.rrule,
                            event_id: event.event_id,
                            original: original_,
                            invesment: event.invesment,
                        })
                        eventsList.push(event_copy)
                    }
                });

                eventsList.forEach(event => {
                    event.save((err) => {
                        if (err) {
                            res.status(500).send({
                                message: err.message || "Server error creating event"
                            });
                        }
                    })
                })
                res.status(200).send({
                    message: "recurrent events updated succesfully",
                })
            }
        })
    }
}
