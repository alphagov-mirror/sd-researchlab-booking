import RegToken from '../../models/RegToken';
import moment from 'moment';

export const addNewRegLink = async ({ userId, regToken }) => {
  try {
    const newRegLink = await new RegToken({
      userId,
      regToken
    }).save();

    return newRegLink;
  } catch (error) {
    console.log(error);
    return { error };
  }
};

export const removeAllRegLinks = async ({ userId }) => {
  console.log(userId);
  try {
    const delRegLinks = await RegToken.deleteMany({ userId });
    console.log(delRegLinks);
    return true;
  } catch (error) {
    return false;
  }
};

export const getRegLink = async ({ regToken }) => {
  // console.log(regToken);
  try {
    const regTokenFull = await RegToken.findOne({ regToken });
    // console.log(regTokenFull);
    return regTokenFull;
  } catch (error) {
    return error;
  }
};

export const checkRegLink = async (regLinkId) => {
  const regToken = await RegToken.findById(regLinkId);
  // console.log(regToken);
  const nowT = moment();
  // console.log(nowT);
  const regLinkDate = moment(moment(regToken.createdAt).format());
  // console.log(regLinkDate);
  // console.log(nowT.diff(regLinkDate, 'minutes'));
  if (nowT.diff(regLinkDate, 'minutes') > 60) {
    return true;
  }
  return false;
};
