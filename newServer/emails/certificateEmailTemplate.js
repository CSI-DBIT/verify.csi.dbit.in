const { formatDate } = require("../utils");
exports.generateCertificateEmailAllContent = async (
  eventDetails,
  userDetails
) => {
  return {
    html: `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Your Certificate</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            background-color: #f4f4f4;
            margin: 0;
            padding: 0;
          }
    
          .container {
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background: #fff;
            border-radius: 8px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
          }
    
          h1 {
            color: #333;
            font-size: 24px;
            margin-bottom: 20px;
            text-transform: capitalize;
          }
    
          p {
            color: #666;
            font-size: 16px;
            margin-bottom: 20px;
          }
    
          .code {
            background: #f9f9f9;
            padding: 10px;
            border-radius: 4px;
            margin-bottom: 20px;
            background: #f4f4f4;
            font-size: x-large;
            font-weight: bold;
            display: flex;
            justify-content: center;
            align-items: center;
          }
    
          .footer {
            background: #f4f4f4;
            padding: 10px;
            border-radius: 4px;
            text-align: center;
          }
    
          .footer p {
            font-size: 12px;
            color: #888;
            margin: 0;
          }
    
          .footer a {
            color: #3498db;
            text-decoration: none;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>${eventDetails.name} Certificate</h1>
          <p>Dear ${userDetails.name},</p>
          <p>
            Congratulations! You have successfully participated in ${
              eventDetails.name
            } held on ${formatDate(eventDetails.startDate)}.
          </p>
          <p><strong>As promised, here is your unique certificate code:</strong></p>
          <div class="code">
            <p>${userDetails.uniqueCertificateCode}</p>
          </div>
          <p>
            To verify your certificate, please visit
            <a
              href="${process.env.CLIENT_URL}"
              >verify@dev</a
            >
            and enter the provided code.
          </p>
          <p>
            Thank you for your participation and dedication. We hope to see you
            again at our future events.
          </p>
          <div class="footer">
            <p>
              Best regards, <br />
              Verify@dev
            </p>
          </div>
        </div>
      </body>
    </html>    
        `,
  };
};
