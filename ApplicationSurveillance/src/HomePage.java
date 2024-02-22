import java.awt.CardLayout;
import java.awt.Color;
import java.awt.Dimension;
import java.awt.Font;
import java.awt.FontMetrics;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;

import javax.swing.BorderFactory;
import javax.swing.ImageIcon;
import javax.swing.JFrame;
import javax.swing.JLabel;
import javax.swing.JPanel;
import javax.swing.border.Border;

public class HomePage extends JPanel  {
    

JFrame f = Fenetre.f;
    Color BG = Fenetre.BG;
    static CardLayout cardLayout = new CardLayout();
    static final int HEIGHT = Fenetre.HEIGHT;
    static final int WIDTH = Fenetre.WIDTH;
    ImageIcon maison = new ImageIcon("./images/Maison.jpg");
    JLabel maisonJLabel = new JLabel(maison);
    JLabel infra = new JLabel("VOTRE INFRASTRUCTURE ");
    static Border border = BorderFactory.createLineBorder(Fenetre.blue,Account.tickness);
    Font font = new Font(Account.font.getName(),Font.BOLD,44);
    FontMetrics fontMetrics = getFontMetrics(font);
    int hauteurTxt = fontMetrics.getHeight();
    static Menuhome menuhome = new Menuhome();
    HomePage() {
        this.setLayout(null);
        this.setPreferredSize(new Dimension(WIDTH, HEIGHT));
        this.setBackground(BG);
        this.setFocusable(true);
        menuhome.addMenuHome(this);
        infra.setFont(font);
        infra.setForeground(Color.yellow);
        this.add(maisonJLabel).setBounds(Fenetre.WIDTH /2 +Menuhome.WIDTH*2/5 - maison.getIconWidth()/2, (Fenetre.HEIGHT - maison.getIconHeight())/2, maison.getIconWidth(), maison.getIconHeight());
        this.add(infra).setBounds(maisonJLabel.getX(),maisonJLabel.getY() - hauteurTxt,maisonJLabel.getWidth(),hauteurTxt);
        maisonJLabel.setBorder(border);

        try {
          Connection conn = App.connectBDD(); 
          PreparedStatement prepare = conn.prepareStatement("Select username,adresse,telephone from login where mail = ?");
          prepare.setString(1, Page.mail);
          ResultSet res = prepare.executeQuery();
          res.next();
          Page.username = res.getString("username");
          Page.adresse = res.getString("adresse");
          Page.telephone = res.getString("telephone");
          conn.close();
        }catch(Exception e) {
            System.err.println(e);
        }
        
    }
}
