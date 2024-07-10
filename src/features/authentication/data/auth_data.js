const adminSchema = require('../../users/models/user');
const bcrypt = require('bcrypt');
const { createSecretToken } = require('../../../configs/security');
const mailler = require('../../../helper/mail_sender/mail_sender_helper');
const jwt = require('jsonwebtoken');

class AuthData {
  async login(req, res) {
    try {
      const { email, password } = req.body;
      const user = await adminSchema.findOne({ EMAIL: email });
      if (!user) {
        return res.status(400).json({ message: 'account not found' });
      }

      let validPassword = await bcrypt.compare(password, user.PASSWORD);

      if (!validPassword) {
        return res.status(400).json({ message: 'Password is Wrong' });
      }

      if (!user.verified) {
        await AuthData().sendEmailVerification(user._id, email);
        return res.status(400).json({
          message:
            'Email not verified, Please check your email for verification link',
        });
      }

      const token = createSecretToken(user._id);
      return res.status(200).json({ message: 'Login Success', token });
    } catch (e) {
      return res.status(400).json({ message: `Invalid Credentials ${e}` });
    }
  }

  async register(req, res) {
    try {
      if (!req.body) {
        return res.status(400).json({ message: 'Data is Empty' });
      }

      const { name, email, password, guideApplication, companyGuid, role } =
        req.body;
      const user = await adminSchema.findOne({ EMAIL: email });
      if (user) {
        return res.status(400).json({ message: 'Email already registered' });
      }

      const hashedPassword = await bcrypt.hash(password, 3);
      const newUser = new adminSchema({
        NAME: name,
        EMAIL: email,
        PASSWORD: hashedPassword,
        GUID: guideApplication,
        COMPANY: companyGuid,
        ROLE: role,
      });

      let send = await AuthData.sendEmailVerification(newUser._id, email);
      if (send) {
        await newUser.save();
        return res
          .status(200)
          .json({ message: 'Register Success, Please Verify Your Email' });
      } else {
        return res.status(400).json({ message: 'Failed to send email' });
      }
    } catch (e) {
      return res.status(400).json({ message: ` Try again, ${e}` });
    }
  }

  static async sendEmailVerification(id, email) {
    try {
      const tokenVerify = await createSecretToken(id);
      const url = `${process.env.BASEURL}/auth/verify/${tokenVerify}`;
      await mailler.sendMail({
        from: process.env.EMAIL,
        to: email,
        subject: 'Email Verification',
        html: `<a href = '${url}'>Click here</a> to confirm your email.`,
      });
      return true;
    } catch (e) {
      console.log(e);
      return false;
    }
  }

  async verifyEmail(req, res) {
    try {
      const { token } = req.params;
      if (!token) {
        return res.status(422).json({ message: 'Invalid Token' });
      }
      let payload = jwt.verify(token, process.env.TOKEN_KEY);

      const user = await adminSchema.findOne({ _id: payload.id });
      if (!user) {
        return res.status(400).json({ message: 'User not found' });
      }
      user.verified = true;
      await user.save();
      return res.status(200).json({ message: 'Email Verified' });
    } catch (e) {
      return res.status(500).json({ message: `${e}` });
    }
  }
}

module.exports = new AuthData();
