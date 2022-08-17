import connect from "../../../mongodb/lib/conn";
import User from "../../../mongodb/models/User"

export default async function handler(req, res) {
  const { name, email, password } = req.body;
  await connect();
  if (req.method === 'POST') {
    try {
      if (!name || !email || !email.includes('@') || !password || password.trim().length < 7) {
        return res.status(422).json({ message: 'Invalid input - password should also be atleast 7 characters long.' });
      }
      const userExist = await User.findOne({ email: email });
      if (userExist) {
        res.status(409).json({ success: false, message: "User already exists" });
      } else {
        let user;
        if (req.body.phone) {
          user = await User.create({
            name: name,
            email: email,
            phone: req.body.phone,
            password: password
          });
        } else {
          user = await User.create({
            name: name,
            email: email,
            password: password
          });
        }
        res.status(201).json({ success: true, data: user });
      }
    } catch (error) {
      console.log(error);
      res.status(400).json({ success: false, message: error.message });
    }
  } else {
    res.status(404).json({ success: false, message: "method not allowed" });
  }
}