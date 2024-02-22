import java.awt.Color;
import java.awt.Font;
import java.awt.FontMetrics;
import java.awt.Graphics;
import java.awt.Graphics2D;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;

import javax.swing.ImageIcon;
import javax.swing.JLabel;
import javax.swing.JPanel;

public class Camera extends JPanel implements ActionListener {
    

    Bouton offBouton = new Bouton(100,100,"Activer toutes les cameras",Fenetre.BG,Color.YELLOW,Account.font,10);
    Boolean on = false;
    String name;
    boolean isActive;
    String emplacement = " ";
    String info = " ";
    JLabel camera;
    ImageIcon panier = new ImageIcon("./images/panier.png");
    int hauteur = panier.getIconHeight()*3/2;
    ImageIcon m = new ImageIcon("./images/maisonPieces.png");
    ImageIcon rec = new ImageIcon("./images/rec.gif");
    SwitchButton switchButton1 = new SwitchButton();
    SwitchButton switchButton2 = new SwitchButton();
    SwitchButton switchButton3 = new SwitchButton();
    SwitchButton switchButton4 = new SwitchButton();
    Font font = new Font(Account.font.getName(),Font.BOLD,40);
    FontMetrics fontMetrics = getFontMetrics(font);
    int hauteurTxt = fontMetrics.getHeight();
    public void setInfo(String info) {
        this.info = info;
    }

    Menuhome menuhome = HomePage.menuhome;

    Camera() {

        JLabel titre = new JLabel("Vos Cameras");
        Font ft = new Font(font.getName(),Font.BOLD,100);
        titre.setForeground(Color.YELLOW);
        titre.setFont(ft);
        FontMetrics fMetrics = getFontMetrics(ft);
        this.setLayout(null);
        this.add(titre).setBounds((Fenetre.WIDTH - m.getIconWidth())/2, hauteur, fMetrics.stringWidth(titre.getText()), fMetrics.getHeight());
        new Menuhome().addMenuHome(this);
        this.setBackground(Fenetre.BG);
        hauteur = panier.getIconHeight()*8;
        hauteur = addCamera(camera, "Salle de bain", hauteur,switchButton1);
        hauteur = addCamera(camera,"Chambre",hauteur,switchButton2);
        hauteur = addCamera(camera,"Salon",hauteur,switchButton3);
        hauteur = addCamera(camera,"Cuisine",hauteur,switchButton4);
        offBouton.addActionListener(this);
    }

    int addCamera(JLabel camera,String nom,int hauteur,SwitchButton sw) {
        //sw = new SwitchButton();
        camera = new JLabel(nom);
        camera.setFont(font);
        camera.setForeground(Fenetre.blue);
        this.name = nom;
        this.add(camera).setBounds(Fenetre.WIDTH -(sw.width*2 + fontMetrics.stringWidth("Salle de bain ")), hauteur, fontMetrics.stringWidth("Salle de bain "), hauteurTxt);
        this.add(sw).setBounds(camera.getX() + camera.getWidth() + 10, camera.getY() + hauteurTxt/3, sw.width, sw.height);
        hauteur += hauteurTxt + 5;
        return hauteur;
    } 

    public void activate() {
        isActive = true;
    }

    public void desactivate() {
        isActive = false;
    }

    public boolean isActive() {
        return isActive;
    }

    @Override
    protected void paintComponent(Graphics g) {
        //this.setBackground(Fenetre.BG);
        super.paintComponent(g);
        Graphics2D g2 = (Graphics2D) g;
        g2.drawImage(m.getImage(),(Fenetre.WIDTH - m.getIconWidth())/2,(Fenetre.HEIGHT - m.getIconHeight())/2,this);
        int x = (Fenetre.WIDTH - m.getIconWidth())/2 + rec.getIconWidth()/4;
        int y = (Fenetre.HEIGHT)/2 - rec.getIconHeight();
        int x2 = x + m.getIconWidth()*17/25;
        int y2 = y + m .getIconHeight()*47/100;

        if (switchButton1.isSelect()) g2.drawImage(rec.getImage(),x ,y, this);

        if (switchButton2.isSelect()) g2.drawImage(rec.getImage(),x2,y, this);

        if (switchButton3.isSelect()) g2.drawImage(rec.getImage(),x,y2, this);

        if (switchButton4.isSelect()) g2.drawImage(rec.getImage(),x2,y2, this);
        
    
        //else {desactivate();}
    
    }

    @Override
    public void actionPerformed(ActionEvent e) {
        if (e.getSource() == offBouton) {
            if(on){
                on = false;
                offBouton.setText("Activer toutes les cameras");
                offBouton.setBackground(Fenetre.BG);
            }
            else {
                on = true;
                offBouton.setText("Desactiver toutes les cameras");
                offBouton.setBackground(Fenetre.blue);

            }
        }
    } 
}
