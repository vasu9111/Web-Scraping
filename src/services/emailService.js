import nodemailer from 'nodemailer';


const transporter = nodemailer.createTransport({
  host: 'smtp.ethereal.email',
  port: 587,
  auth: {
      user: 'brandyn.schaden@ethereal.email',
      pass: 'fyF8XPPyG76WjHSCCA'
  }
});


 export const sendPriceChangeEmail = async (product, oldPrice, newPrice) => {
  try {
    const mailOptions = {
      from: 'brandyn.schaden@ethereal.email',
      to: 'vasu@gmail.com', 
      subject: `Price Change Alert: ${product.name}`,
      html: `
        <h2>Price Change Alert!</h2>
        <p>The price of "${product.name}" has changed:</p>
        <p>Old Price: ${oldPrice} ${product.currency}</p>
        <p>New Price: ${newPrice} ${product.currency}</p>
        <p>Source: ${product.source}</p>
        <p>Product URL: <a href="${product.productUrl}">View Product</a></p>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log('Price change notification email sent successfully');
  } catch (err) {
    console.error('Error sending price change email:', err);
    throw err;
  }
}; 
