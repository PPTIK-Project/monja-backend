const AdminSchema = require('../models/user');
const AuthData = require('../../authentication/data/auth_data');

class AdminData {
    async getProfile(req, res) {
        try {
            console.log(req.userId)
            const user = await AdminSchema.findById(req.userId);
            res.status(200).json({data : user});
        } catch (e) {
            res.status(400).json({message: `Invalid Credentials ${e}`});
        }
    }

    async updateProfile(req, res) {
        try {
            const {name, email, guideApplication, companyGuid, role} = req.body;
            const user = await AdminSchema.findById(req.userId);
            if (!user) {
                return res.status(400).json({message: "account not found"});
            }

            let message = "Profile Updated";
            if(email !== user.EMAIL){
                const emailExist = await AdminSchema.findOne({EMAIL: email});
                if (emailExist) {
                    return res.status(400).json({message: "Email already registered"});
                }
                console.log("email changed, and send email verification")
                message = "Profile Updated, Please Verify Your Email";
                user.EMAIL = email;
                user.verified = false;
                await AuthData.sendEmailVerification(user._id, email);
            }
            user.NAME = name;
            user.GUID = guideApplication;
            user.COMPANY = companyGuid;
            user.ROLE = role;
            await user.save();
            res.status(200).json({message});
        } catch (e) {
            res.status(400).json({message: `Invalid Credentials ${e}`});
        }
    }
}

module.exports = new AdminData();
