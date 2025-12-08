export const jobAcceptedTemplate = (
  name: string,
  jobTitle: string,
  reason?: string | null
) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Application Accepted</title>
</head>
<body style="background:#f4f4f4;padding:20px;font-family:Arial, sans-serif;">
  <table width="100%" style="max-width:600px;margin:auto;background:#ffffff;border-radius:12px;padding:30px;box-shadow:0 4px 10px rgba(0,0,0,0.05);">
    <tr>
      <td style="text-align:center;">
        <h2 style="color:#16a34a;">🎉 Congratulations!</h2>

        <p style="color:#444;font-size:16px;line-height:1.6;">
          Hello <strong>${name}</strong>,<br><br>
          We are pleased to inform you that your application for 
          <strong>${jobTitle}</strong> has been 
          <strong style="color:#16a34a;">accepted</strong>.
        </p>

        ${
          reason
            ? `
        <div style="
          background:#e0f7ec;
          color:#065f46;
          padding:15px;
          border-radius:8px;
          margin:20px 0;
          font-size:15px;
        ">
          <strong>Additional Notes:</strong><br>${reason}
        </div>
        `
            : ''
        }

        <p style="color:#555;font-size:14px;">
          Our team will contact you soon with the next steps.
        </p>

        <p style="color:#777;font-size:13px;margin-top:20px;">
          Best regards,<br><strong>Your Company</strong>
        </p>
      </td>
    </tr>
  </table>

  <p style="text-align:center;font-size:12px;color:#aaa;margin-top:20px;">
    © ${new Date().getFullYear()} Your Company. All rights reserved.
  </p>
</body>
</html>
`;
