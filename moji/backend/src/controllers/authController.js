import bcrypt from 'bcrypt';

export const signUp = async (req, res) => {
    try {
        const { username, password, email, firstName, lastName } = req.body;

        if (!username || !password || !email || !firstName || !lastName) {
            return res.status(400).json({
                message: "Missing username, password, email, firstName, lastName"
            })
        }

        // Check if user exists
        const duplicate = await UserActivation.findOne({ username });

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