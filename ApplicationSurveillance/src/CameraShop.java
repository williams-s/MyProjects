import java.awt.Image;
import java.awt.event.ActionEvent;
import java.text.NumberFormat;
import java.util.ArrayList;
import javax.swing.Box;
import javax.swing.BoxLayout;
import javax.swing.ImageIcon;
import javax.swing.JLabel;
import javax.swing.JPanel;
import javax.swing.JScrollPane;
import javax.swing.JSpinner;

public class CameraShop extends Boutique {

    
    TexteBoutique txt1;
    TexteBoutique txt2;
    TexteBoutique txt3;

    Bouton retour;

    static ArrayList<String> achats = new ArrayList<String>();
    
    NumberFormat s = NumberFormat.getIntegerInstance();

    Box box = new Box(BoxLayout.Y_AXIS);
    JLabel desc1;
    JLabel desc2;
    JLabel desc3;

    //Menuhome menuhome = HomePage.menuhome;

    CameraShop(TexteBoutique ezvizTxt,TexteBoutique netatoTxt, TexteBoutique reolinkTxt,Bouton ezvizBouton ,Bouton netatoBouton,Bouton reolinkBouton,String prix1,String prix2,String prix3,ImageIcon d1,ImageIcon d2,ImageIcon d3) {
        super(ezvizTxt, netatoTxt,  reolinkTxt, ezvizBouton , netatoBouton, reolinkBouton, prix1, prix2, prix3);
        card.show(cardL,"jp");
        txt1 = ezvizTxt;
        txt2 = reolinkTxt;
        txt3 = netatoTxt;
        desc1 = new JLabel(d1);
        desc2 = new JLabel(d2);
        desc3 = new JLabel(d3);
        addPanier(qte1, panier1, ezvizBouton,this.prix1);
        addPanier(qte2, panier2, reolinkBouton,this.prix2);
        addPanier(qte3, panier3, netatoBouton,this.prix3);       
        remove(alarme);
        remove(cam);
        remove(chooseCamera);
        remove(chooseAlarme);
        retour = new Bouton(200, 100,"Retour",Fenetre.BG,Fenetre.blue);
        retour.addActionListener(this);
    }


    public void actualisePanier(JSpinner jSpinner,Bouton addPanier,Bouton appareil,TexteBoutique txt){
        int taillePanier = Integer.parseInt(panier.getText());
        taillePanier += Integer.parseInt(jSpinner.getValue().toString());
        panier.setText(String.valueOf(taillePanier));
        Boutique.getPanierFils = String.valueOf(taillePanier);

        achats.add(appareil.getIcon().toString() + "§" + txt.getText() + "§" + jSpinner.getValue());
    }


    @Override
    public void actionPerformed(ActionEvent e) {
        //card.show(cardL,"jp");
        
        if(e.getSource() == panier1) {
            actualisePanier(qte1, panier1,appareil1,txt1);   
            //    b nn bremove(appareil1);
        }
        if (e.getSource() == panier2) {
            System.out.println(txt2.getText());        
            actualisePanier(qte2, panier2,appareil2,txt2);
        }
        if (e.getSource() == panier3) {
            actualisePanier(qte3, panier3,appareil3,txt3);
        }

        if (e.getSource() == panier) {
            cardLayoutF.show(Fenetre.container, "ShowPanier");
        }
        if (e.getSource() == appareil1) {
            afficheDescription(appareil1, desc1);
        }
        if (e.getSource() == appareil2) {
            afficheDescription(appareil2, desc2);
        }
        if (e.getSource() == appareil3) {
            afficheDescription(appareil3, desc3);
        }
        if (e.getSource() == retour) {
            goBack(appareil1, desc1);
            goBack(appareil2, desc2);
            goBack(appareil3, desc3);
        }
       // ShowPanier.timer.start();
       // System.out.println(achats.toString());
       //box.add(afficheAchats(splitListeAchats(achats, achats.size()-1),Menuhome.WIDTH,100,this));    
       JScrollPane jScrollPane = new JScrollPane();
       jScrollPane.setViewportView(box);
       //box.setBackground(Fenetre.BG);
       jScrollPane.getViewport().setBackground(Fenetre.BG);
       jScrollPane.getViewport().setForeground(Account.bleu);
      // this.add(jScrollPane).setBounds(Menuhome.WIDTH, Menuhome.HEIGHT_BOUTON_TOP, Fenetre.WIDTH-Menuhome.WIDTH, Fenetre.HEIGHT- Menuhome.HEIGHT_BOUTON_TOP);
    }


    void afficheDescription(Bouton appareil,JLabel txt) {

        description.add(appareil);
        ImageIcon im = (ImageIcon)txt.getIcon();
        im.setImage(im.getImage().getScaledInstance(500, 500, Image.SCALE_SMOOTH));
        //System.out.println(im.getIconHeight());
        description.add(txt);
        description.add(retour);
        card.show(cardL, "description");

    }

    void goBack(Bouton appareil,JLabel txt) {
        int x = 0;
        int y = (Fenetre.HEIGHT - HEIGHT_BOUTON)/2;
        if (appareil == appareil1) {
            x = (Fenetre.WIDTH )/4 - WIDTH_BOUTON/2;
        }
        if (appareil == appareil2) {
            x = Fenetre.WIDTH / 2 - WIDTH_BOUTON/2;
        }
        if (appareil == appareil3) {
            x =(Fenetre.WIDTH )*3/4 - WIDTH_BOUTON/2;
        }
        jp.add(appareil).setBounds(x, y, WIDTH_BOUTON/2, HEIGHT_BOUTON/2);
        description.remove(txt);
        card.show(cardL, "jp");
    }

    
   String[] splitListeAchats(ArrayList<String> l, int i) {
        if (i < l.size()) {
            return l.get(i).split("§");
        }
        return new String[1];
    }


     Box afficheAchats(String[] tab,int x, int y,JPanel panel) {
        ImageIcon img = new ImageIcon(tab[0]);
        String nom = tab[1];
        String qte = tab[2];
        JScrollPane scrollPane = new JScrollPane();
        //scrollPane.setLayout(null);
        Box box = new Box(BoxLayout.X_AXIS);
        JLabel nomJLabel = new JLabel(nom);
        nomJLabel.setForeground(Account.bleu);
        JLabel qteJLabel = new JLabel(qte);
        qteJLabel.setForeground(Account.bleu);
        box.add(new JLabel(img));
        box.add(Box.createGlue());
        box.add(nomJLabel);
        box.add(Box.createGlue());
        box.add(qteJLabel);
        scrollPane.setViewportView(box);
        scrollPane.setBackground(Fenetre.BG);
        scrollPane.setForeground(Account.bleu);
        panel.add(scrollPane);
        scrollPane.setFocusable(true);
        scrollPane.setBounds(x,y,Fenetre.WIDTH - Menuhome.WIDTH,img.getIconHeight());
        return box;
        //System.out.println(box.toString());
/*         System.out.println(img);
        System.out.println(nom);
        System.out.println(qte); */
            
    }

}
