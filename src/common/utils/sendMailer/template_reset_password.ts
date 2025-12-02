export const resetPasswordTemplate = (otp: string) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Reset Password</title>
</head>
<body style="background:#f4f4f4;padding:20px;font-family:Arial;">
  <table width="100%" style="max-width:600px;margin:auto;background:#ffffff;border-radius:10px;padding:20px;">
    <tr>
      <td style="text-align:center;">
        <h2 style="color:#333;">Reset Your Password</h2>
        <p style="color:#666;font-size:15px;">
          Use this OTP code to reset your password.
        </p>

        <div style="
          background:#e11d48;
          color:white;
          font-size:28px;
          font-weight:bold;
          letter-spacing:6px;
          padding:15px 0;
          border-radius:8px;
          margin:25px 0;
        ">
          ${otp}
        </div>

        <p style="font-size:13px;color:#999;">
          This code will expire in <strong>10 minutes</strong>.
        </p>
      </td>
    </tr>
  </table>

  <p style="text-align:center;font-size:12px;color:#aaa;margin-top:15px;">
    © ${new Date().getFullYear()} Your App. All rights reserved.
  </p>
</body>
</html>
`;
