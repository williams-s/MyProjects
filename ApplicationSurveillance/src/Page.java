import java.awt.CardLayout;
import java.awt.Color;
import java.awt.Dimension;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;
import java.io.BufferedReader;
import java.io.FileReader;
import java.util.ArrayList;

import javax.swing.BorderFactory;
import javax.swing.ImageIcon;
import javax.swing.JFrame;
import javax.swing.JLabel;
import javax.swing.JOptionPane;
import javax.swing.JPanel;
import javax.swing.JProgressBar;

public class Page extends JPanel implements ActionListener{
    JProgressBar progressBar = new JProgressBar();
    JFrame f = Fenetre.f;
    Color BG = Fenetre.BG;
    static CardLayout cardLayout = new CardLayout();
    CardLayout cardLayoutF = Fenetre.cardLayout;
    static final int HEIGHT = Fenetre.HEIGHT;
    static final int WIDTH = Fenetre.WIDTH;
    static JLabel techCare = new JLabel(new ImageIcon("./images/TechCareTransparent.png"));
    static JLabel register = new JLabel();
    int hauteurTexte = getFontMetrics(Account.font).getHeight();
    Account acc = new Account(WIDTH*2/3,(hauteurTexte*2)+Account.tickness*3 + Account.BOUTONHEIGHT + hauteurTexte+ 130);
    Inscription ins = new Inscription(WIDTH*2/3);
    
    static String mail;
    static String password;
    static String username;
    static String adresse;
    static String telephone;

    

    //static Bouton allAdresse = new Bouton(70, 70,"SURPRISE");
    ArrayList<String> emails = new ArrayList<String>();
    Page() {

        this.setLayout(null);
        this.setPreferredSize(new Dimension(WIDTH, HEIGHT));
        this.setBackground(BG);
        this.setFocusable(true);
        //this.add(new Menuhome());

        progressBar.setSize(techCare.getIcon().getIconWidth(), 30);
        
        this.add(techCare).setBounds((WIDTH - techCare.getIcon().getIconWidth())/2 ,(HEIGHT /4) -(techCare.getIcon().getIconHeight()/2) ,techCare.getIcon().getIconWidth(),techCare.getIcon().getIconHeight());
        this.add(progressBar).setBounds((WIDTH - progressBar.getWidth()*2)/2, techCare.getIcon().getIconHeight() + techCare.getY() + 150, progressBar.getWidth()*2, progressBar.getHeight()*2);

        progressBar.setValue(0);    //Initialise la barre a 0%
        progressBar.setStringPainted(false); //Rend invisinle le pourcentage de la barre  

        progressBar.setBackground(BG);
        progressBar.setForeground(Account.bleu);
        progressBar.setBorder(BorderFactory.createLineBorder(Color.yellow,1));

        //this.add(allAdresse).setBounds(100, 100, 150, 70);


        //allAdresse.setVisible(false);
      
       // allAdresse.addActionListener(this);
        


    }

    boolean isStayConnected() {
      try {
          FileReader fileReader = new FileReader("./texteConnection/stayConnect.txt");
          BufferedReader bufferedReader = new BufferedReader(fileReader);
          String mail = bufferedReader.readLine();
          String password = bufferedReader.readLine();
          Page.mail = mail;
          Page.password = password;
          fileReader.close();
          bufferedReader.close();
          return (!(mail.isEmpty()) && !(password.isEmpty()));
      } catch (Exception e) {
        System.err.println(e);
        return false;
      }




    }


    void enter() {

        //progressBar.setVisible(false);
        register.setLayout(cardLayout);
        register.add("acc",acc); 
        register.add("ins",ins);
        this.add(register).setBounds((WIDTH-acc.getWidth())/2, techCare.getY() + techCare.getHeight() +30   , acc.getWidth(), acc.getHeight());
        if (isStayConnected()) {
          register.setVisible(false);
          Fenetre.container.add("HomePage", new HomePage());
          cardLayoutF.show(Fenetre.container, "HomePage");
          Fenetre.container.add("Compte",new Compte());
        }
         
        else {
          
          cardLayout.show(register, "acc");}  
    }




   public void chargeBarre()
    {
      int i=0; 
      while(i <= 100)
      {
        // remplit la barre
        progressBar.setValue(i);  
        i = i + 10;  
        try
        {
          // retarder le thread 
          Thread.sleep(100);
        }
        catch(Exception e){}
      }
      progressBar.setVisible(false);
    }


    @Override
    protected void paintComponent(java.awt.Graphics g1) {
        super.paintComponent(g1);

    }

    @Override
    public void actionPerformed(ActionEvent e) {
  }
}
