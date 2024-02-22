import java.awt.BorderLayout;
import java.awt.CardLayout;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;

import javax.swing.ImageIcon;
import javax.swing.JPanel;

public class Capteurs extends JPanel implements ActionListener {
    
    Menuhome menuhome = new Menuhome();
    Bouton temperatures = new Bouton(400, 380,new ImageIcon("./images/Temperature.png"));
    Bouton humidite = new Bouton(400, 380, new ImageIcon("./images/humidite.jpg"));
    TexteBoutique txt = new TexteBoutique("Capteur de temperature");
    TexteBoutique txt2 = new TexteBoutique("Capteur d'humidité");
    CardLayout cardLayoutF = Fenetre.cardLayout;

    Capteurs() {
        setLayout(null);
        setBackground(Fenetre.BG);
        JPanel panelTemp = new JPanel();
        panelTemp.setBackground(Fenetre.BG);
        panelTemp.setLayout(new BorderLayout());
        JPanel panel = new JPanel();
        panel.setBackground(getBackground());
        panel.add(txt);
        panelTemp.add(panel,BorderLayout.NORTH);
        panelTemp.add(temperatures,BorderLayout.SOUTH);


        JPanel panelHumi = new JPanel();
        panelHumi.setLayout(new BorderLayout());
        JPanel panel2 = new JPanel();
        panel2.add(txt2);
        panel2.setBackground(getBackground());
        panelHumi.add(panel2,BorderLayout.NORTH);
        panelHumi.add(humidite,BorderLayout.SOUTH);

        menuhome.addMenuHome(this);
        int width = getFontMetrics(TexteBoutique.font).stringWidth(txt.getText()) + 10;
        int height = temperatures.height + getFontMetrics(TexteBoutique.font).getHeight() + 10  ;
        add(panelTemp).setBounds((Fenetre.WIDTH + Menuhome.WIDTH) / 3 - width/2 , (Fenetre.HEIGHT - height)/2  ,width,height );
        add(panelHumi).setBounds((Fenetre.WIDTH + Menuhome.WIDTH)*13/20 - width/2, panelTemp.getY(), width, height);
        temperatures.setBorder(Account.contour);
        humidite.setBorder(Account.contour);
        //add(txt).setBounds(panelTemp.getX(), 500, 500, 100);
        temperatures.addActionListener(this);
        humidite.addActionListener(this);
    }

    @Override
    public void actionPerformed(ActionEvent e) {
        if(e.getSource() == temperatures) {
            cardLayoutF.show(Fenetre.container, "Temperatures");
        }
        if(e.getSource() == humidite) {
            cardLayoutF.show(Fenetre.container, "Humidite");
        }
    }
}
