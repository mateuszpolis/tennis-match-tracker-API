import nodemailer from "nodemailer";
import dotenv from "dotenv";

export default class MailService {
  private transporter;
  private user;
  private pass;
  private host;
  private port;

  private style = `
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Oswald:wght@400;700&display=swap');

    body {
      font-family: "Oswald", sans-serif;
      font-size: 16px;
      color: #333;
      margin: 0;
      padding: 5px;
    }
    h1, h2 {
      color: #3d348b;
    }
    ul {
      list-style-type: none;
      padding: 0;
    }
    li {
      margin-bottom: 10px;
    }
    header {
      text-align: center;
      margin-bottom: 20px;
    }
    footer {
      text-align: center;
      padding: 20px;
      background-color: #f4f4f4;
      border-top: 1px solid #ddd;
      font-size: 14px;
      color: #666;
    }
    footer a {
      color: #3d348b;
      text-decoration: none;
      margin: 0 10px;
    }
    footer a:hover {
      text-decoration: underline;
    }
    .footer-links {
      margin-top: 10px;
      display: flex;
      justify-content: center;
      gap: 20px;
    }
    .footer-links img {
      vertical-align: middle;
      margin-left: 5px;
    }
    .light-text {
      color: #666;
    }
  </style>
`;

  constructor() {
    dotenv.config();

    this.user = process.env.EMAIL_USER as string;
    this.pass = process.env.EMAIL_PASS as string;
    this.host = process.env.EMAIL_HOST as string;
    this.port = process.env.EMAIL_PORT as string;

    try {
      this.transporter = nodemailer.createTransport({
        host: this.host,
        port: parseInt(this.port),
        // secure: false,
        auth: {
          user: this.user,
          pass: this.pass,
        },
      });
    } catch (err) {
      throw new Error("Error creating transporter");
    }
  }

  private getStyledHtml(content: string): string {
    return `${this.style}
      <div>
        <header>
          <h1>Tennis Tournament Manager</h1>          
        </header>
        ${content}
        <footer>
          <p>© 2024 Mateusz Polis</p>
          
        </footer>
      </div>`;
  }

  public sendPasswordChangedEmail = async (email: string) => {
    await this.transporter.sendMail({
      from: "Tennis Tournament Manager <noreply@ttm.pl>",
      to: email,
      subject: "Your password has been changed",
      text: "Your password has been changed",
      html: this.getStyledHtml("<p>Your password has been changed</p>"),
    });
  };

  public async sendResetPasswordEmail(email: string, token: string) {
    const resetPasswordLink = `http://localhost:3000/reset-password/${token}`;
    const html = `
      <p>Click the link to reset your password:</p>
      <a href="${resetPasswordLink}">Reset password</a>
    `;

    await this.transporter.sendMail({
      from: "Tennis Tournament Manager <noreply@ttm.pl>",
      to: email,
      subject: "Reset your password",
      text: "Click the link to reset your password",
      html: this.getStyledHtml(html),
    });
  }

  public async sendConfirmationEmail(email: string, token: string) {
    const confirmationLink = `http://localhost:3000/confirm-email/${token}`;
    const html = `
      <p>Click the link to confirm your email:</p>
      <a href="${confirmationLink}">Confirm email</a>
    `;

    await this.transporter.sendMail({
      from: "Tennis Tournament Manager <noreply@ttm.pl>",
      to: email,
      subject: "Confirm your email",
      text: "Click the link to confirm your email",
      html: this.getStyledHtml(html),
    });
  }
}
