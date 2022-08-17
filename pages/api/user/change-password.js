import { getSession } from "next-auth/client";
import connect from "../../../mongodb/lib/conn";
import User from "../../../mongodb/models/User";

export default async function handler(req, res) {
  if (req.method !== 'PATCH') {
    return;
  }

  const session = await getSession({ req: req });
  if (!session) {
    res.status(401).json({
      message: 'Not authenticated!'
    });
    return;
  }
  const userEmail = session.user.email;
  const oldPassword = req.body.oldPassword;
  const newPassword = req.body.newPassword;

  if (oldPassword === newPassword) {
    res.status(400).json({
      message: 'Old Password and new password are same!'
    })
    return;
  }
  await connect();
  const user = await User.findOne({ email: userEmail });
  if (!user) {
    res.status(404).json({
      message: 'User Not found!'
    })
    return;
  }

  if (user.password !== oldPassword) {
    res.status(403).json({
      message: 'Invalid Password!'
    })
    return;
  }

  user.password = newPassword;
  await user.save();
  res.status(200).json({
    success: true,
    message: 'Password Changed successfully!'
  })
}