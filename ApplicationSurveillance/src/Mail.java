import javax.mail.internet.*;
import java.util.Properties;
import javax.mail.*;
 


class Mail {
  public static void send(String from,String pwd,String to,String sub,String msg){
    Properties p = new Properties();
    p.put("mail.smtp.host", "smtp.gmail.com");
    p.put("mail.smtp.socketFactory.port", "465");
    p.put("mail.smtp.socketFactory.class", "javax.net.ssl.SSLSocketFactory");
    p.put("mail.smtp.auth", "true");
    p.put("mail.smtp.port", "465");
    Session s = Session.getDefaultInstance(p,
      new javax.mail.Authenticator() {
      protected PasswordAuthentication getPasswordAuthentication() {
         return new PasswordAuthentication(from, pwd);
      }
    });
    try {
      MimeMessage m = new MimeMessage(s);
      m.addRecipient(Message.RecipientType.TO,new InternetAddress(to));
      m.setSubject(sub);
      m.setText(msg);
      Transport.send(m);
    } catch (MessagingException e) {
      e.printStackTrace();
    }
  }
}
