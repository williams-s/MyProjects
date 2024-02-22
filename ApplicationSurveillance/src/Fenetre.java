import javax.swing.ImageIcon;
import javax.swing.JFrame;
import java.awt.CardLayout;
import java.awt.Color;
import java.awt.Container;
import java.awt.Dimension;

public class Fenetre extends JFrame {

    static JFrame f = new JFrame("TechCare"); 
    static Color BG = Color.BLACK; 
    static Color blue = Account.bleu;
    static Dimension dimension = java.awt.Toolkit.getDefaultToolkit().getScreenSize();
    public static final int HEIGHT = (int)dimension.getHeight();
    public static final int WIDTH = (int)dimension.getWidth();

    
    static ImageIcon ezviz = new ImageIcon("./images/cameraEzviz.png");
    static ImageIcon netato = new ImageIcon("./images/cameraNetato.jpg");
    static ImageIcon reolink = new ImageIcon("./images/reolink.jpg");
    static Bouton ezvizBouton = new Bouton(Boutique.WIDTH_BOUTON,Boutique.HEIGHT_BOUTON,ezviz);
    static Bouton netatoBouton = new Bouton(Boutique.WIDTH_BOUTON,Boutique.HEIGHT_BOUTON,netato);
    static Bouton reolinkBouton = new Bouton(Boutique.WIDTH_BOUTON,Boutique.HEIGHT_BOUTON,reolink);
    static TexteBoutique ezvizTxt = new TexteBoutique("EZVIZ BC1-B3");
    static TexteBoutique netatoTxt = new TexteBoutique("Netatmo Caméra");
    static TexteBoutique reolinkTxt = new TexteBoutique("Reolink 4K Caméra");

    ImageIcon blink = new ImageIcon("./images/Blink.jpg");
    ImageIcon sebson = new ImageIcon("./images/SEBSON.jpg");
    ImageIcon thermoPro = new ImageIcon("./images/ThermoPro.jpg");
    
   // Menuhome menuhome =new Menuhome();
    Page page = new Page();
    Camera cameras = new Camera();
    Boutique boutique = new Boutique(ezvizTxt, netatoTxt,  reolinkTxt, ezvizBouton , netatoBouton, reolinkBouton, "", "", "");
    static CardLayout cardLayout = new CardLayout();
    static Container container;
    Account account;
    Fenetre(){
        
        //Page page = new Page();
        f.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
        f.setVisible(true);
        
        f.setBackground(BG);
        f.add(page);
        f.setResizable(false);
        
        f.pack();
        page.chargeBarre();
        //f.add(new Menuhome());
        
        f.setLocationRelativeTo(null);
        //f.add(page);
       
        container = f.getContentPane();
        
        

        //cameras.addCamera(new Camera("SDB"));
        container.setLayout(cardLayout);
        container.add("Page",page);
        container.add("Boutique",boutique);
        //container.add("HomePage",new HomePage());
        container.add("Camera", new Camera());
        container.add("Capteurs", new Capteurs());
        container.add("Temperatures",new Temperatures("T en °C","Temperatures","°C",new TemperaturePanel("T en °C", 20)));
        container.add("Humidite",new Humidite("Humidité en %"));
        container.add("CapteurShop",new CapteurShop(new TexteBoutique("SEBSON Detecteur de mouvement"), new TexteBoutique("Blink Video Doorbell"), new TexteBoutique("ThermoPro TP50"), new Bouton(Boutique.WIDTH_BOUTON, Boutique.HEIGHT_BOUTON, sebson), new Bouton(Boutique.WIDTH_BOUTON, Boutique.HEIGHT_BOUTON, blink), new Bouton(Boutique.WIDTH_BOUTON, Boutique.HEIGHT_BOUTON, thermoPro),"17,99€","69,99€","11,99€",new ImageIcon("./images/descSebson.png"),new ImageIcon("./images/descBlink.png"),new ImageIcon("./images/descThermo.png")));
        container.add("CameraShop",new CameraShop(ezvizTxt, netatoTxt, reolinkTxt, ezvizBouton, netatoBouton, reolinkBouton,"279,99€","179,99€","299,99€",new ImageIcon("./images/descEz.png"),new ImageIcon("./images/descReo.png"),new ImageIcon("./images/descNet.png")));
        //container.add("ShowPanier",new ShowPanier(new TexteBoutique(""), new TexteBoutique(), new TexteBoutique(), new Bouton(10,10 ), new Bouton(10,10 ), new Bouton(10,10 ),"279,99€","179,99€","299,99€"));
        //container.add("Compte",new Compte());
        cardLayout.show(container, "Page");
        //cardLayout.show(f.getContentPane(), "Account");

        page.enter();
    }

}
