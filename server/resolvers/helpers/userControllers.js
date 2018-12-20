import User from '../../models/User';

export const getUserById = async (_id) => {
  const resUser = await User.findById(_id);
  return resUser;
};

export const addNewUser = async ({
  firstName,
  lastName,
  email,
  phone,
  password
}) => {
  try {
    const newUser = await new User({
      firstName,
      lastName,
      email,
      phone,
      password
    }).save();
    return newUser;
  } catch (error) {
    // console.log('errorr', error);
    return { error };
  }
};

export const checkVerification = async (_id) => {
  try {
    const userVeri = await User.findById(_id);
    if (userVeri.isVerified) {
      return true;
    }
  } catch (error) {
    console.log(error);
    return false;
  }
};

export const updateVerification = async (_id, tf) => {
  try {
    const upVeri = await User.findByIdAndUpdate(_id, {
      $set: { isVerified: tf }
    });
    return upVeri;
  } catch (error) {
    return error;
  }
};
