module.exports = app =>{

    const events = require("../controllers/controller.events");
    const verifyToken = require('../middlewares/verify_jwt');


    app.get('/events/:userid', verifyToken, events.getAll);

    app.get('/events_t/:walletid', verifyToken, events.getTotal);

    app.post('/events_i/:walletid', verifyToken, events.getInitial);

    app.post('/events_m/:walletid', verifyToken, events.getOneMonth);

    app.post('/event', verifyToken, events.create);

    app.put('/event/:id', verifyToken, events.update);
    
    app.delete('/event/:id', verifyToken, events.delete);

    app.delete('/events/:walletid', verifyToken, events.deletemany);

    app.delete('/clean_events', events.clean);

    app.post('/events_f', events.createFreq)
    
}