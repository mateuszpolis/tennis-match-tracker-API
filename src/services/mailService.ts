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
      color: #003566;
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
      color: #003566;
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
      console.error("Error creating transporter: ", err);
      throw new Error("Error creating transporter");
    }
  }

  private getStyledHtml(content: string): string {
    return `${this.style}
      <div>
        <header>
          <h1>Eltimex</h1>
          <img src="https://eltimex-dev.s3.eu-central-1.amazonaws.com/logo512.png" alt="Eltimex logo" 
            width="100" height="100"
          />
        </header>
        ${content}
        <p>Wiadomość wygenerowana automatycznie. Prosimy na nią nie odpowiadać. W razie pytań prosimy o kontakt na adres email lub numer telefonu podany poniżej.</p>
        <footer>
          <p>© 2024 Eltimex. Wszelkie prawa zastrzeżone.</p>
          <div class="footer-links">
            <a href="mailto:Eltimex <noreply@eltimex.pl>">
              Napisz do nas: Eltimex <noreply@eltimex.pl>
            </a>
            <a href="tel:+48609773932">
              Zadzwoń do nas: +48 609 773 932              
            </a>
          </div>
        </footer>
      </div>`;
  }

  public sendPasswordChangedEmail = async (email: string) => {
    await this.transporter.sendMail({
      from: "Eltimex <noreply@eltimex.pl>",
      to: email,
      subject: "Twoje hasło zostało zmienione",
      text: "Twoje hasło zostało zmienione",
      html: this.getStyledHtml("<p>Twoje hasło zostało zmienione</p>"),
    });
  };

  public async sendResetPasswordEmail(email: string, token: string) {
    const resetPasswordLink = `https://eltimex.pl/resetuj-haslo/${token}`;
    const html = `
      <p>Kliknij w link, aby zresetować swoje hasło:</p>
      <a href="${resetPasswordLink}">Zresetuj hasło</a>
    `;

    console.log("Sending email to: ", email);
    await this.transporter.sendMail({
      from: "Eltimex <noreply@eltimex.pl>",
      to: email,
      subject: "Zresetuj swoje hasło",
      text: "Kliknij w link, aby zresetować swoje hasło",
      html: this.getStyledHtml(html),
    });
    console.log("Email sent");
  }

  public async sendConfirmationEmail(email: string, token: string) {
    const confirmationLink = `https://eltimex.pl/potwierdz-email/${token}`;
    const html = `
      <p>Kliknij w link, aby potwierdzić swój email:</p>
      <a href="${confirmationLink}">Potwierdź email</a>
    `;

    await this.transporter.sendMail({
      from: "Eltimex <noreply@eltimex.pl>",
      to: email,
      subject: "Potwierdź swój email",
      text: "Kliknij w link, aby potwierdzić swój email",
      html: this.getStyledHtml(html),
    });
  }
}
