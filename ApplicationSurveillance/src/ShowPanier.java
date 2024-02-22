import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;

import javax.swing.ImageIcon;
import javax.swing.Timer;

public class ShowPanier extends CameraShop{
    
    static Timer timer;
    ShowPanier(TexteBoutique ezvizTxt, TexteBoutique netatoTxt, TexteBoutique reolinkTxt, Bouton ezvizBouton,Bouton netatoBouton, Bouton reolinkBouton, String prix1, String prix2, String prix3,ImageIcon d1,ImageIcon d2,ImageIcon d3) {
        super(ezvizTxt, netatoTxt, reolinkTxt, ezvizBouton, netatoBouton, reolinkBouton, prix1, prix2, prix3,d1,d2,d3);
        removeAll();
        menuhome.addMenuHome(this);
        add(panier);
        remove(appareil1);
        timer = new Timer(3000, new ActionListener() {

            @Override
            public void actionPerformed(ActionEvent e) {
            }
            
        });
    }



  


    public void actionPerformed(ActionEvent e) {
        //int x = 200;
        //int y = 200;
       // for(int i = 0; i < achats.size();i++) {
            //afficheAchats(splitListeAchats(achats, 0),x,y);
           // y += 150;
        //}
    }


    
        
    
    
}
