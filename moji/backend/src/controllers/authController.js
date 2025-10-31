import bcrypt from 'bcrypt';
import User from "../models/User.js"
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import Session from '../models/Session.js';

const ACCESS_TOKEN_TTL = '30m';
const REFRESH_TOKEN_TTL = 14 * 24 * 60 * 60 * 1000; // 14 days in milliseconds

export const signUp = async (req, res) => {
    try {
        const { username, password, email, firstName, lastName } = req.body;

        if (!username || !password || !email || !firstName || !lastName) {
            return res.status(400).json({
                message: "Missing username, password, email, firstName, lastName"
            })
        }

        // Check if user exists
        const duplicate = await User.findOne({ username });

        if (duplicate) {
            return res.status(409).json({
                message: "user already exists"
            })
        }

        // encrypt password
        const hashedPassword = await bcrypt.hash(password, 10);

        // create new user
        await User.create({
            username,
            hashedPassword,
            email,
            displayName: `${firstName} ${lastName}`
        })

        // return
        return res.sendStatus(204);

    } catch (error) {
        console.error('Error when signUp', error);
        return res.status(500).json({
            message: 'System error'
        })
    }
}

export const signIn = async (req, res) => {
    try {
        // Get input
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({
                message: "Missing username or password"
            })
        }

        // Get hashedPassword in db and compare password from input
        const user = await User.findOne({ username });

        if (!user) {
            return res.status(401).json({
                message: "username or password is incorrect"
            })
        }

        // validate password
        const passwordCorrect = await bcrypt.compare(password, user.hashedPassword);
        if (!passwordCorrect) {
            return res.status(401).json({
                message: "username or password is incorrect"
            })
        }

        // create accessToken with JWT
        const accessToken = jwt.sign({ userId: user._id }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: ACCESS_TOKEN_TTL })

        // create refreshToken
        const refreshToken = crypto.randomBytes(64).toString('hex');

        // create new session to save refreshToken
        await Session.create({
            userId: user._id,
            refreshToken,
            expiresAt: new Date(Date.now() + REFRESH_TOKEN_TTL),
        });

        // return refreshToken in cookie
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: 'none',
            maxAge: REFRESH_TOKEN_TTL
        });

        // return accessToken in res
        return res.status(200).json({
            message: `User ${user.displayName} logged in`,
            accessToken
        })

    } catch (error) {
        console.log("Error when sign in", error);
        return res.status(500).json({
            message: "System error"
        })
    }
}

export const signOut = async (req, res) => {
    try {
        // Get refresh token from cookie
        const token = req.cookies?.refreshToken;

        if (token) {
            // delete refresh token from session
            await Session.deleteOne({
                refreshToken: token
            });

            // delete cookie
            req.clearCookie('refreshToken');
        }
        return res.status(204);

    } catch (error) {
        console.log("Error when sign out", error);
        return res.status(500).json({
            message: "System error"
        })
    }
}