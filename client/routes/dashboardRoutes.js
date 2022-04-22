const express = require('express');
const router = express.Router();
const api_calls = require("../../api/middleware/api_calls");

router.get('/', (req, res, next) => {
    const options = {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'authorization': 'bearer ' + req.cookies.access_token
        }
    };
    api_calls.make_API_call('http://localhost:80/projectRoutes/load_data', options)
        .then(response => {
            let result = JSON.parse(response);
            console.log(result.data);
            res.render('dashboard', { Dashboard_state: 'active', load_data: result.data });
            next();
        })
        .catch(error => {
            console.log(error);
        })
})

router.get('/:project_name/configurations', (req, res, next)=>{
    res.render('configurations');
});

router.get('/:project_name/start', (req, res, next)=>{
    res.render('start');
});

router.get('/:project_name/result', (req, res, next)=>{
    res.render('result');
});


module.exports = router;