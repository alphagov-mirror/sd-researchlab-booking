import { NotifyClient } from 'notifications-node-client';

const notifyClient = new NotifyClient(process.env.NOTIFY_API_KEY);

// tmp email
const tempEmail = 'adrian.durran@digital.cabinet-office.gov.uk';

export const sendRegMail = async (firstName, lastName, regLink) => {
  const hashLink = `${process.env.REGISTER_LINK}?token=${regLink}`;

  try {
    const regMail = await notifyClient.sendEmail(
      process.env.NOTIFY_REG_TEMPLATE_ID,
      tempEmail,
      {
        personalisation: {
          firstName,
          lastName,
          hashLink
        },
        reference: 'test mails'
      }
    );
    return regMail.body;
  } catch (error) {
    console.log(error);
    return { error };
  }
};
