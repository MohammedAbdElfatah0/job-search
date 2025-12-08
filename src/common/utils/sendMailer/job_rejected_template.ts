export const jobRejectedTemplate = (
  name: string,
  jobTitle: string,
  reason?: string | null
) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Application Status</title>
</head>
<body style="background:#f4f4f4;padding:20px;font-family:Arial, sans-serif;">
  <table width="100%" style="max-width:600px;margin:auto;background:#ffffff;border-radius:12px;padding:30px;box-shadow:0 4px 10px rgba(0,0,0,0.05);">
    <tr>
      <td style="text-align:center;">
        <h2 style="color:#dc2626;">⚠ Application Update</h2>

        <p style="color:#444;font-size:16px;line-height:1.6;">
          Hello <strong>${name}</strong>,<br><br>
          Thank you for applying for the position of <strong>${jobTitle}</strong>.
        </p>

        <p style="color:#555;font-size:15px;line-height:1.6;">
          After review, we regret to inform you that you were 
          <strong style="color:#dc2626;">not selected</strong>.
        </p>

        <div style="
          background:#fef2f2;
          color:#991b1b;
          padding:15px;
          border-radius:8px;
          margin:20px 0;
          font-size:15px;
        ">
          <strong>Reason:</strong><br>
          ${reason ? reason : 'The application did not meet our job requirements at this time.'}
        </div>

        <p style="color:#777;font-size:13px;margin-top:20px;">
          Thank you for your interest.<br>
          <strong>Your Company</strong>
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
