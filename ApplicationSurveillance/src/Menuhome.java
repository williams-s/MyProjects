import java.awt.CardLayout;
import java.awt.Color;
import java.awt.Font;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;
import java.io.File;
import java.text.SimpleDateFormat;
import java.util.Date;
import javax.swing.Timer;
import javax.swing.ImageIcon;
import javax.swing.JFrame;
import javax.swing.JLabel;
import javax.swing.JPanel;
import javax.swing.JScrollPane;

public class Menuhome extends JScrollPane implements ActionListener {
 

    SimpleDateFormat s = new SimpleDateFormat("dd/MM/yyyy HH:mm:ss");
    Date date =new Date();
    String[] yesNo_options = {"Oui","Non"};
    static JFrame f = Fenetre.f;
    ImageIcon techCare_Img = new ImageIcon("./images/cle.png"); 
      

    Font font = new Font(Account.font.getName(), Font.BOLD, 30);
    static final int WIDTH = Fenetre.WIDTH /8;
    static final int HEIGHT = Fenetre.HEIGHT / 8;
    static CardLayout cardLayout = Fenetre.cardLayout;
    static final int HEIGHT_BOUTON = 210; 
    static final int HEIGHT_BOUTON_TOP = 100 ;

    int y = 0;
    //static final int WIDTH_BOUTON = 100;
    String[] bienvenue = {"Bonjour","Bonsoir"};
    JLabel dateHeure = new JLabel();
    

    

    JLabel nbPanier = new JLabel("0");
    int techCareWidth = techCare_Img.getIconWidth();
    Bouton techCare = new Bouton(techCare_Img.getIconWidth(), techCare_Img.getIconHeight(), techCare_Img,Fenetre.BG);
    Bouton panier = new Bouton(WIDTH,Fenetre.HEIGHT/9,"0",Fenetre.BG,Fenetre.blue,new ImageIcon("./images/panier.png"));
    Bouton deconnexion = new Bouton(WIDTH, HEIGHT_BOUTON, "Se deconnecter", Fenetre.BG, Fenetre.blue,new Font(font.getName(),Font.BOLD,20));
    Bouton camera = new Bouton(WIDTH, HEIGHT_BOUTON,"Cameras",Fenetre.BG,Fenetre.blue,font);
    Bouton capteur = new Bouton(WIDTH, HEIGHT_BOUTON,"Capteurs",Fenetre.BG,Fenetre.blue,font);
    Bouton boutique = new Bouton(WIDTH, HEIGHT_BOUTON, "Boutique", Fenetre.BG, Fenetre.blue, font);
    Bouton compte = new Bouton(WIDTH, HEIGHT_BOUTON, "Compte", Fenetre.BG, Fenetre.blue, font);

    int size = HEIGHT_BOUTON;
    

    Menuhome()
 {
        

 }
    private Menuhome(int x, int y, int width,int height){
        dateHeure.setFont(font);
        dateHeure.setBackground(Fenetre.BG);
        dateHeure.setForeground(Color.YELLOW);

        size = panier.getIcon().getIconHeight();
        this.y = y;
        if (y == 0) {
        size = 0;
        //size = addBouton(deconnexion, size);
        this.add(dateHeure).setBounds(techCare.getWidth() +30 ,0, Fenetre.WIDTH*2/3 ,panier.getIcon().getIconHeight());
        //addBouton(panier,Fenetre.WIDTH- (WIDTH*5/2));
        nbPanier.setFont(font);
        nbPanier.setForeground(Fenetre.blue);
        //add(nbPanier).setBounds(panier.getX()+panier.getWidth(), 0, 20, panier.getHeight());

        
        panier.setFont(Account.font);
        }
        else {
            size = 5;
            size = addBouton(camera, size);
            size = addBouton(capteur, size);
            size = addBouton(boutique, size);
            size = addBouton(compte, size);
            this.add(deconnexion).setBounds(0, compte.getY() + compte.getHeight(), WIDTH , Fenetre.HEIGHT - (4*HEIGHT_BOUTON) - techCare_Img.getIconHeight()*9/5 );
            deconnexion.addActionListener(this);
        }
        this.setBounds(x, y, width, height);
        this.setVisible(true);
        this.setBackground(Fenetre.BG);
        this.setLayout(null);
        Timer timer = new Timer(1000, new ActionListener() {

            @Override
            public void actionPerformed(ActionEvent e) {
            date = new Date();
            if (s.format(date).substring(11).startsWith("2")) //A patir de 20h l'appli écrit bonsoir au lieu de bonjour 
            dateHeure.setText(bienvenue[1] + " " + Page.username + ", nous sommes le : " + s.format(date));
            else dateHeure.setText(bienvenue[0] + " " + Page.username + ", nous sommes le : " + s.format(date));
            }
            
        });
        timer.start();
        setBorder(Account.contour);
        

    }

    public void changePanier(int nb) {
        panier.setText(String.valueOf(nb));
    }
    

    private int addBouton(Bouton bouton, int size){
        if ( y == 0 ) 
        
        {
            if (bouton.getIcon() != null) this.add(bouton).setBounds(size, 0, WIDTH, bouton.getIcon().getIconHeight());
            else this.add(bouton).setBounds(size, 0, WIDTH, HEIGHT_BOUTON_TOP);
            size += bouton.getWidth();
        }
        else {
            this.add(bouton).setBounds(0,size,WIDTH,HEIGHT_BOUTON);
            size += HEIGHT_BOUTON;
        }
        bouton.addActionListener(this);
        return size;
    }

    void addMenuHome(JPanel jPanel) {
        jPanel.add(techCare).setBounds(0, 0, WIDTH, panier.getIcon().getIconHeight());

        techCare.addActionListener(this);
        jPanel.add(new Menuhome(WIDTH, 0, Fenetre.WIDTH*3/4, panier.getIcon().getIconHeight() ));
        jPanel.add(new Menuhome(0, techCare_Img.getIconHeight(), techCare.getWidth(), Fenetre.HEIGHT - techCare_Img.getIconHeight() ));
    }

    void addMenuHomeFrame(JFrame frame) {
         frame.add(techCare).setBounds(0, 0, WIDTH, panier.getIcon().getIconHeight());

        techCare.addActionListener(this);
        frame.add(new Menuhome(WIDTH, 0, Fenetre.WIDTH  - techCare.getWidth(), panier.getIcon().getIconHeight() ));
        frame.add(new Menuhome(0, techCare_Img.getIconHeight(), techCare.getWidth(), Fenetre.HEIGHT - techCare_Img.getIconHeight() ));
    }


    @Override
    public void actionPerformed(ActionEvent e) {
        
       if(e.getSource() == deconnexion) {
        Page.register.setVisible(true);
        File file = new File("./texteConnection/stayConnect.txt");
        file.delete();
        try {
            file.createNewFile();
        }catch(Exception e2) {}
         cardLayout.show(Fenetre.container,"Page");
        }
        if(e.getSource() == techCare) {
            cardLayout.show(Fenetre.container, "HomePage");
        }
        if(e.getSource() == camera) {
            cardLayout.show(Fenetre.container, "Camera");
        }
        if(e.getSource() == compte) {
            cardLayout.show(Fenetre.container, "Compte");
        }
        if(e.getSource() == capteur) {
            cardLayout.show(Fenetre.container, "Capteurs");
        }
        if(e.getSource() == boutique) {
            cardLayout.show(Fenetre.container, "Boutique");
        }
    }

    



}
