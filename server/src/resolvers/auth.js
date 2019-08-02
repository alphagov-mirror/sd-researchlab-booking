import User from '../models/User';

import {
  verifyUserToken,
  createUserToken,
  hashCompare
} from '../utils/cryptoUtils';
import { sendRegMail } from '../services/NotifyMail';

export const getUser = async (token) => {
  // temp just return a user object until we add

  const chkToken = token.split(' ')[1];

  // console.log('chkYoken', chkToken);

  if (!chkToken || chkToken === 'null') {
    console.log('nope');
    return { user: { loggedIn: false } };
  }
  const plainToken = await verifyUserToken(chkToken, '1h');
  console.log('get user', plainToken);
  // return { user: { loggedIn: true } };
};

const authResolvers = {
  Query: {
    registerTokenCheck: async (_, { token }) => {
      console.log('we are here');
      try {
        // decrypt the token
        const regToken = await verifyUserToken(token, 6000000);
        const { verifySuccess, clearToken, error } = regToken;

        if (!verifySuccess) {
          throw new Error(error);
        }
        // get the user
        // update the user? do it in one? findByIdAndUpdate
        const veriUser = await User.findByIdAndUpdate(
          clearToken.id,
          { isVerified: true },
          { new: true }
        );

        const { _id, email } = veriUser;

        // create a new token (with longer expiry.....do wee need this??)
        const veriToken = await createUserToken(
          {
            id: _id,
            email
          },
          '1h'
        );

        console.log('veritoken', veriToken);
        // return
        return {
          success: true,
          token: veriToken.newToken,
          user: veriUser
        };
      } catch (error) {
        return {
          success: false,
          token: null,
          user: null
        };
      }
    }
  },
  Mutation: {
    signInUser: async (_, { email, password }) => {
      // get the user from the db
      try {
        const signin = await User.findOne({ email });

        console.log('user', signin);

        // if they don't exist....need to change this to a generic
        if (!signin) {
          throw new Error('User not found');
        }
        // compare password with hashed password
        // need to change error
        const comparePass = await hashCompare(password, signin.password);
        if (!comparePass) {
          throw new Error('Password does not match');
        }

        let signInToken = await createUserToken(
          {
            id: signin._id,
            email: signin.email
          },
          '1h'
        );

        console.log('siggy', signInToken);

        return {
          success: true,
          token: signInToken.newToken,
          user: signin
        };
      } catch (error) {
        console.log(error);
      }
    },
    registerNewUser: async (
      _,
      { firstName, lastName, email, phone, password }
    ) => {
      // save the user
      try {
        const newUser = await User.create({
          firstName,
          lastName,
          email,
          phone,
          password
        });
        // generate auth (jwt) token for link
        const regToken = await createUserToken(
          {
            id: newUser._id,
            email: newUser.email
          },
          6000000
        );

        const { createSuccess, newToken, error } = regToken;

        // email link to user
        const regMail = await sendRegMail(
          newUser.firstName,
          newUser.lastName,
          newToken
        );

        return {
          success: true,
          user: newUser,
          token: newToken
        };
      } catch (error) {
        console.log(error);
      }
    },
    registerLinkResend: async (_, { id }) => {
      // get the user
      try {
        const user = await User.findById(id);
        if (!user) {
          throw new Error('User does not exist');
        }

        // generate a new token
        const regToken = await createUserToken(
          {
            id: user._id,
            email: user.email
          },
          6000000
        );
        const { createSuccess, newToken, error } = regToken;

        // send email
        const regMail = await sendRegMail(
          user.firstName,
          user.lastName,
          newToken
        );

        return {
          success: true,
          token: newToken,
          user
        };
      } catch (error) {
        console.log(error);
        return error;
      }
    }
  }
};

export default authResolvers;
