var express = require('express');
var router = express.Router();
router.post('/add', function(req, res, next) {
    useData.addUser(req.body , function(err , data){
       res.sendDbData(err,  data);
    });
});
exports.router = router;
exports.__path = '/server/user';
