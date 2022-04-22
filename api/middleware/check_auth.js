const jwt = require("jsonwebtoken");
require("dotenv").config();

module.exports = (req, res, next) => {
    const token = req.headers.authorization.split(" ")[1];
    jwt.verify(token, process.env.JWT_KEY, (err, authorizedData) => {
        if (err) {
            res.status(403).json({
                message: "Failed to authorize",
                error: err
            });
        } else {
            res.locals.user = authorizedData; 
            // res.json({
            //     message: 'Successfull log in',
            //     authorizedData
            // });
            next();
        }
    })
}
