const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const user = require('../models/usermodel');








exports.register = async (req, res) => {
    try {
        console.log('coned')
        const { username, email, password,discordname } = req.body;

        if (!username || !email || !password || !discordname) {
            return res.status(422).json({ error: "Please fill all the fields" });
        }

        const existingAdmin = await user.findOne({ email: email });

        const existingAdminusername = await user.findOne({ username: username });




        if (existingAdmin && (existingAdmin.email === email )) {
            return res.status(422).json({ error: 'admin Already exists' });
        }

        if (existingAdminusername && (existingAdminusername.username === username )) {
            return res.status(422).json({ error: 'admin Already exists' });
        }
        
        
        else {
            const admin1 = new user({
                username: username,
                email: email,
                password: password,
                discordname:discordname,
                role:'none',
                isApproved: false,
            });

            await admin1.save();

            const data = { username, email, password };

            if (admin1) {
                return res.status(201).json({ message: 'admin Registered Successfully', data });
            }
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
};
exports.signIn = async (req, res) => {
    try {
        const username = req.body.username;
        const password = req.body.password;

        if (!username || !password) {
            return res.status(400).json({ message: 'Please fill all the fields' });
        }

        const response = await user.findOne({ username: username });

        if (!response) {
            return res.status(400).json({ message: "Invalid Credentials" });
        }

       

        const isMatch = await bcrypt.compare(password, response.password);


        if(response.isApproved===false)
        {

            return res.status(500).json({ message: "Your Are Not Approved yet" });

        }
        if (response && response.username === username && isMatch) {
            const token = jwt.sign({ _id: response._id }, process.env.SECRET_KEY);
            console.log('The token is ', token);

            res.cookie('jwtoken', token, {
                expires: new Date(Date.now() + 200000000),
                httpOnly: true
            });

            res.status(201).json({
                message: "You are logged in successfully",
                username: response.username,
                userId: response._id,
            });
        } else {
            res.status(500).json({ message: "Invalid credentials" });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
};

exports.logout = (req, res) => {
    res.clearCookie('jwtoken', { path: '/' });
    res.send('User Logout');
};


exports.getall = async(req, res) => {

    try {
        const allUsers = await user.find({}, 'username'); 
        return res.status(200).json(allUsers);
      } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal Server Error' });
      }
    
   
};


exports.getallusers = async(req, res) => {

    try {
        const allUsers = await user.find(); 
        return res.status(200).json(allUsers);
      } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal Server Error' });
      }
    
   
};



