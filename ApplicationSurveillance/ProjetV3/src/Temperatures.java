import java.awt.BorderLayout;
import java.awt.Color;
import java.awt.Graphics;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;
import java.awt.event.ItemEvent;
import java.awt.event.ItemListener;
import java.util.HashMap;
import java.util.Map;
import java.util.Random;

import javax.swing.ImageIcon;
import javax.swing.JButton;
import javax.swing.JComboBox;
import javax.swing.JFrame;
import javax.swing.JLabel;
import javax.swing.JOptionPane;
import javax.swing.JPanel;

public class Temperatures extends JPanel implements ActionListener,ItemListener {
    
    static final int BORNE_INF = 20;
    Bouton detectPhoto;
    ImageIcon detectPhotosIcon;
    JLabel detectJLabel;
    JFrame f = Fenetre.f;
    String mesure = "";
    //private JMenuItem item1, item2, item3, item4, item5, item6, item7;
    JLabel label2;
    Menuhome menuhome = new Menuhome();
    TemperaturePanel panel;   
    //HumiditePanel panelHumi;
    private Map<String, double[]> savedTemperatures;   

    Temperatures (String str,String mesure,String unite, TemperaturePanel jpanel) {
        setLayout(null);
        setBackground(Fenetre.BG);
        menuhome.addMenuHome(this);
        //add(new TemperaturePanel());
        JComboBox<String> barre = new JComboBox<String>();
        label2 = new JLabel();
        this.mesure = mesure;
        barre.setBackground(getBackground());
        barre.setForeground(Color.YELLOW);
        //JMenu barre = new JMenu("barre");
        //barre.add(barre);
        barre.addItem("Choix du jour");

        barre.addItem("Lundi");

        barre.addItem("Mardi");

        barre.addItem("Mercredi");

        barre.addItem("Jeudi");

        barre.addItem("Vendredi");

        barre.addItem("Samedi");

        barre.addItem("Dimanche");

        barre.addItemListener(this);
        barre.setSize(175, Menuhome.HEIGHT_BOUTON_TOP/2);
        int xpanier = Fenetre.WIDTH*3/4 + menuhome.techCareWidth*2 + Account.tickness;
        add(barre).setBounds(xpanier,0,Fenetre.WIDTH - xpanier,barre.getHeight());

        
        panel = jpanel;

        savedTemperatures = new HashMap<>();

        JButton infoButton = new JButton("Afficher Infos");
        infoButton.addActionListener(new ActionListener() {
            @Override
            public void actionPerformed(ActionEvent e) {
                double[] temperatures = panel.getTemperatures();
                int maxIndex = 0;
                int minIndex = 0;

                for (int i = 1; i < temperatures.length; i++) {
                    if (temperatures[i] > temperatures[maxIndex]) {
                        maxIndex = i;
                    }
                    if (temperatures[i] < temperatures[minIndex]) {
                        minIndex = i;
                    }
                }

                int maxTemperature = (int) temperatures[maxIndex] + 1;
                int minTemperature = (int) temperatures[minIndex];

                String tmp = mesure;
                if (mesure.equals("Temperatures")) {
                    tmp = "Temperature";
                }
                JOptionPane.showMessageDialog(panel,
                        tmp + " la plus haute : " + maxTemperature + " " + unite +  " à " + maxIndex + "H" +
                                "\n"+tmp+" la plus basse : " + minTemperature + " " + unite +  " à " + minIndex + "H");
            }
        });

        JPanel buttonPanel = new JPanel();
        buttonPanel.add(infoButton);
        panel.setLayout(new BorderLayout());
        panel.add(buttonPanel,BorderLayout.SOUTH);
        int x = (Fenetre.WIDTH - Menuhome.WIDTH)*3/4;
        int y = Fenetre.HEIGHT*3/4 ;
        add(panel).setBounds((Fenetre.WIDTH - Menuhome.WIDTH )/2 - x/3, (Fenetre.HEIGHT - Menuhome.HEIGHT_BOUTON_TOP/2) / 2 - y/2, x , y);
        panel.setBorder(Account.contour);
        JPanel txtPanel = new JPanel();
        txtPanel.add(label2);
        label2.setFont(Account.font);
        panel.add(txtPanel,BorderLayout.NORTH);
    }

    @Override
    protected void paintComponent(Graphics g) {
        super.paintComponent(g);
        
    }

    @Override
    public void actionPerformed(ActionEvent e) {

    }

    @Override
    public void itemStateChanged(ItemEvent e) {
        if(e.getItem() == "Lundi") {
        label2.setText( mesure + " de Lundi");
            updatePanel("Lundi");
        }
        if(e.getItem() == "Mardi") {
        label2.setText( mesure + " de Mardi");
            updatePanel("Mardi");
        }
        if(e.getItem() == "Mercredi") {
        label2.setText( mesure + " de Mercredi");
            updatePanel("Mercredi");
        }
        if(e.getItem() == "Jeudi") {
        label2.setText( mesure + " de Jeudi");
            updatePanel("Jeudi");
        }
        if(e.getItem() == "Vendredi") {
        label2.setText (mesure + " de Vendredi");
            updatePanel("Vendredi");
        }
        if(e.getItem() == "Samedi") {
        label2.setText( mesure + " de Samedi");
            updatePanel("Samedi");
        }
        if(e.getItem() == "Dimanche") {
        label2.setText( mesure + " de Dimanche");
            updatePanel("Dimanche");
        }

    }




     private void updatePanel(String dayOfWeek) {
        if (!savedTemperatures.containsKey(dayOfWeek)) {
            double[] temperatures = new double[24];
            if (mesure.equals("Temperatures")) {
                 temperatures = randomMesure(BORNE_INF,5);
            }
            if (mesure.equals("Humidité")) {
                temperatures = randomMesure(Humidite.BORNEINF,13);

            }
            savedTemperatures.put(dayOfWeek, temperatures);
        }
        panel.setTemperatures(savedTemperatures.get(dayOfWeek));
        panel.repaint();
    }

    private double[] randomMesure(int borneInf,int variation) {
        double[] temperatures = new double[24];
        Random random = new Random();
        for (int i = 0; i < 24; i++) {
            double temperature = borneInf + random.nextDouble() * variation;
            temperatures[i] = temperature;
        }
        return temperatures;
    }

}
