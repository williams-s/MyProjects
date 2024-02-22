import java.awt.CardLayout;
import java.awt.Color;
import java.awt.Dimension;
import java.awt.FlowLayout;
import java.awt.Font;
import java.awt.FontMetrics;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;

import javax.swing.BorderFactory;
import javax.swing.ImageIcon;
import javax.swing.JFormattedTextField;
import javax.swing.JPanel;
import javax.swing.JSpinner;
import javax.swing.SpinnerNumberModel;
import javax.swing.Timer;
import javax.swing.border.Border;
import javax.swing.text.NumberFormatter;


public class Boutique extends JPanel implements ActionListener {
    
    static String getPanierFils = "0"; 
    Bouton panier;
    Bouton chooseCamera;
    Bouton chooseAlarme;
    ImageIcon chooseCamerImageIcon;
    ImageIcon chooseAlarmeImageIcon;
    Border border = BorderFactory.createLineBorder(Fenetre.blue,4);
    Font font = TexteBoutique.font;
    CardLayout cardLayoutF = Fenetre.cardLayout;
    FontMetrics fontMetrics = getFontMetrics(font);
    int hauteurTxt = fontMetrics.getHeight();
    static final int WIDTH_BOUTON = 400;
    static final int HEIGHT_BOUTON = 380;
    TexteBoutique cam = new TexteBoutique("Caméras");
    TexteBoutique alarme = new TexteBoutique("Détecteurs");
    Menuhome menuhome = new Menuhome();
    static Timer timer;



    int q1 = 0;
    int q2 = 0;
    int q3 = 0;

    TexteBoutique prix1;
    TexteBoutique prix2;
    TexteBoutique prix3;

    Bouton appareil1;
    Bouton appareil2;
    Bouton appareil3;
    Bouton viderPanier;

    Bouton panier1 = new Bouton(WIDTH_BOUTON*2/5, HEIGHT_BOUTON/7,"Ajouter au panier");
    Bouton panier2 = new Bouton(WIDTH_BOUTON*2/5, HEIGHT_BOUTON/7,"Ajouter au panier");
    Bouton panier3 = new Bouton(WIDTH_BOUTON*2/5, HEIGHT_BOUTON/7,"Ajouter au panier");
    
    JSpinner qte1 = new JSpinner(new SpinnerNumberModel(1, 1, 10, 1)); 
    JSpinner qte2 = new JSpinner(new SpinnerNumberModel(1, 1, 10, 1)); ;
    JSpinner qte3 = new JSpinner(new SpinnerNumberModel(1, 1, 10, 1)); ;

    Font font2 = new Font(font.getName(),Font.BOLD,20);

    JPanel jp = new JPanel();
    CardLayout card = new CardLayout();
    JPanel cardL = new JPanel();
    JPanel description = new JPanel();

    Boutique(TexteBoutique ezvizTxt,TexteBoutique netatoTxt, TexteBoutique reolinkTxt,Bouton ezvizBouton ,Bouton netatoBouton,Bouton reolinkBouton,String prix1,String prix2,String prix3) {
        chooseCamerImageIcon = new ImageIcon("./images/choisirCameras.jpg");
        chooseAlarmeImageIcon = new ImageIcon("./images/choisirDetecteur.jpg");
        chooseCamera = new Bouton(WIDTH_BOUTON,HEIGHT_BOUTON,chooseCamerImageIcon);
        chooseAlarme = new Bouton(WIDTH_BOUTON, HEIGHT_BOUTON,chooseAlarmeImageIcon);
        this.setLayout(null);
        this.setPreferredSize(new Dimension(WIDTH, HEIGHT));
        this.setBackground(Fenetre.BG);
        this.setFocusable(true);
        panier = new Bouton(100,Fenetre.HEIGHT/9,getPanierFils,Fenetre.BG,Fenetre.blue,Account.font,30,new ImageIcon("./images/panier.png"));

        cardL.setLayout(card);
        jp.setLayout(null);
        description.setLayout(new FlowLayout(FlowLayout.LEFT,50,Fenetre.HEIGHT/4));
        
        this.add(chooseCamera).setBounds((Fenetre.WIDTH  + Menuhome.WIDTH )/3 - chooseCamera.width/2  , (Fenetre.HEIGHT - chooseCamera.height)/2, chooseCamera.width, chooseCamera.height);
        this.add(cam).setBounds(chooseCamera.getX() , chooseCamera.getY() - (hauteurTxt + 5) , chooseCamera.getWidth(), hauteurTxt);
        this.add(chooseAlarme).setBounds((Fenetre.WIDTH + Menuhome.WIDTH)*2/3 - chooseAlarme.width/2, (Fenetre.HEIGHT - chooseAlarme.height)/2, WIDTH_BOUTON, HEIGHT_BOUTON);
        this.add(alarme).setBounds(chooseAlarme.getX(),chooseAlarme.getY() - (hauteurTxt + 5),WIDTH_BOUTON,hauteurTxt);
        chooseCamera.setBorder(border);
        chooseCamera.addActionListener(this);
        chooseAlarme.setBorder(border);
        chooseAlarme.addActionListener(this);
        menuhome.addMenuHome(this);
        int xpanier = Fenetre.WIDTH*3/4 + menuhome.techCareWidth*2 + Account.tickness;
        
        add(panier).setBounds(xpanier,0,Fenetre.WIDTH - xpanier,panier.getIcon().getIconHeight());



        this.prix1 = new TexteBoutique(prix1);
        this.prix2 = new TexteBoutique(prix2);
        this.prix3 = new TexteBoutique(prix3);

        appareil1 = ezvizBouton;
        appareil2 = reolinkBouton;
        appareil3 = netatoBouton;
        viderPanier = new Bouton(panier2.width+40, 100, "Vider le panier",Fenetre.BG,Color.YELLOW,Account.font,15);
        ezvizTxt.setFont(font2);
        netatoTxt.setFont(font2);
        reolinkTxt.setFont(font2);
        int x = getFontMetrics(font2).getHeight();


        jp.setBackground(getBackground());
        int y = (Fenetre.HEIGHT - HEIGHT_BOUTON)/2;
        jp.add(ezvizBouton).setBounds((Fenetre.WIDTH )/4 - WIDTH_BOUTON/2  , y, WIDTH_BOUTON/2, HEIGHT_BOUTON/2);
        jp.add(netatoBouton).setBounds((Fenetre.WIDTH )*3/4 - WIDTH_BOUTON/2 , y, WIDTH_BOUTON/2, HEIGHT_BOUTON/2);
        int gap = Fenetre.WIDTH / 2 - WIDTH_BOUTON/2;
        jp.add(reolinkBouton).setBounds(gap, y, WIDTH_BOUTON/2, HEIGHT_BOUTON/2);
        jp.add(ezvizTxt).setBounds(ezvizBouton.getX(), ezvizBouton.getY() - (x +10 ), ezvizBouton.getWidth(), x);
        jp.add(netatoTxt).setBounds(netatoBouton.getX(), netatoBouton.getY() - (x + 10), netatoBouton.getWidth(), x);
        jp.add(reolinkTxt).setBounds(reolinkBouton.getX(), reolinkBouton.getY() - (x + 10), reolinkBouton.getWidth(), x); 

        jp.add(viderPanier).setBounds(reolinkBouton.getX(),y + 375 , viderPanier.width, viderPanier.height);
        
        panier.addActionListener(this);    
        ezvizBouton.addActionListener(this);
        netatoBouton.addActionListener(this);
        reolinkBouton.addActionListener(this);
        
        //add(viderPanier).setBounds(x, y, y, gap);
        timer = new Timer(0, new ActionListener() {

            @Override
            public void actionPerformed(ActionEvent e) {
                panier.setText(getPanierFils);
            }
            
        });
        timer.start();;
        description.setBackground(getBackground());
        add(cardL).setBounds(Menuhome.WIDTH, Menuhome.HEIGHT_BOUTON_TOP/2,1500, 1000);;
        cardL.add("jp",jp);
        cardL.add("description",description);
       // description.add(reolinkBouton);
        card.show(cardL, "jp");

        viderPanier.addActionListener(new ActionListener() {

            @Override
            public void actionPerformed(ActionEvent e) {
                getPanierFils = "0";
            }
            
        });
    }

    void addPanier(JSpinner jSpinner , Bouton panier, Bouton appareil,TexteBoutique prix) {
        prix.setFont(font2);
        jp.add(prix).setBounds(appareil.getX(), appareil.getY() + appareil.getHeight() + 10, appareil.getWidth(), panier.height);
        jp.add(panier).setBounds(prix.getX(),prix.getY() + prix.getHeight() + 5,panier.width,panier.height);
        jp.add(jSpinner).setBounds(panier.getX() + panier.getWidth(),panier.getY(),WIDTH_BOUTON/8,panier.getHeight());
        JFormattedTextField textField = ((JSpinner.NumberEditor)jSpinner.getEditor()).getTextField();
        ((NumberFormatter) textField.getFormatter()).setAllowsInvalid(false);
        panier.addActionListener(this);
        panier.setBorder(border);
        jSpinner.setBorder(border);
        appareil.setBorder(border);
    }


    void boolVisible(Boolean bool) {
        qte1.setVisible(bool);
        qte2.setVisible(bool);
        qte3.setVisible(bool);
        panier1.setVisible(bool);
        panier2.setVisible(bool);
        panier3.setVisible(bool);
        

    }




    @Override
    public void actionPerformed(ActionEvent e) {
        //timer.stop();
        //panier.setText(getPanierFils);
        if (e.getSource()==chooseAlarme) {
            cardLayoutF.show(Fenetre.container, "CapteurShop");

        }

        if(e.getSource() == chooseCamera) {
            cardLayoutF.show(Fenetre.container, "CameraShop");


        }
        if (e.getSource() == panier) {
            //cardLayoutF.show(Fenetre.container, "ShowPanier");
        }

       
        
    }




    
    


}
