import connect from '../../../mongodb/lib/conn';
import NextAuth from 'next-auth';
import Providers from 'next-auth/providers';
import User from '../../../mongodb/models/User';

export default NextAuth({
  session: {
    jwt: true
  },
  providers: [
    Providers.Credentials({
      async authorize(credentials) {
        await connect();
        const user = await User.findOne({ email: credentials.email });
        if(!user) {
          throw new Error('No User Found');
        }

        if(user.password !== credentials.password){
          throw new Error('Could not log you in!');
        }

        return {
          email: credentials.email
        }

      }
    })
  ]
});