module.exports = app =>{

    const users = require("../controllers/controller.users");
    const verifyToken = require('../middlewares/verify_jwt');
    const verifyToken_rstpwd = require('../middlewares/verify_jwt.rstpwd');

    // app.get('/users', users.getAll);

    app.get('/user/:id', verifyToken, users.getOne);
    
    app.post('/user', users.create)

    app.put('/user/:id', verifyToken, users.update)

    app.put('/userpwd/:id', verifyToken, users.updatepwd)

    app.delete('/user/:id', verifyToken, users.delete)

    app.post('/signin', users.signin)
    
    app.post('/forgot-password', users.forgotpwd)

    app.put('/reset-password/:id', verifyToken_rstpwd, users.resetpwd)
}