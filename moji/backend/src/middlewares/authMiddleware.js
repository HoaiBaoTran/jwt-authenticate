import jwt from 'jsonwebtoken';
import User from '../models/User.js'

export const protectedRoute = (req, res, next) => {
    try {
        // get token from header
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(" ")[1];

        if (!token) {
            return res.status(401).json({
                message: 'Cant find access token'
            })
        }

        // validate token
        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, async (err, decodedUser) => {
            if (err) {
                console.log(err);
                return res.status(403).json({
                    message: 'Access token expired or not correct'
                })
            }

            // find user 
            const user = await User.findById(decodedUser.userId).select('-hashedPassword');

            if (!user) {
                return res.status(404).json({
                    message: 'invalid user'
                })
            }

            // return user in req
            req.user = user;
            next();
        })

    } catch (error) {
        console.log('error when validate jwt in authMiddleware', error);
        return res.status(500).json({
            message: 'System error'
        });
    }
}