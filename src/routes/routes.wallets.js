module.exports = app =>{

    const wallets = require("../controllers/controller.wallets");
    const verifyToken = require('../middlewares/verify_jwt');


    app.get('/wallets/:id', verifyToken, wallets.getAll);

    app.get('/wallet/:id', verifyToken, wallets.getOne);

    app.post('/wallet', verifyToken, wallets.create);

    app.put('/wallet/:id', verifyToken, wallets.update)

    app.delete('/wallet/:id', verifyToken, wallets.delete)
    
}