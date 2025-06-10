const twilio = require('twilio');

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;

const client = new twilio(accountSid, authToken);

const sendLowStockAlert = (phoneNumber, itemName, remainingStock) => {
    const message = `Alert: The stock for ${itemName} is low. Only ${remainingStock} items remaining. Please restock soon.`;

    return client.messages
        .create({
            body: message,
            from: process.env.TWILIO_PHONE_NUMBER,
            to: phoneNumber,
        })
        .then(response => {
            console.log(`Message sent successfully: ${response.sid}`);
            return response;
        })
        .catch(error => {
            console.error(`Failed to send SMS: ${error.message}`);
            throw error;
        });
};

module.exports = sendLowStockAlert;
