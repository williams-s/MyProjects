package MyProjects.FlappyBird;
import java.awt.CardLayout;
import java.awt.Container;

import javax.sound.sampled.Clip;
import javax.swing.JFrame;

public class Fenetre extends JFrame{
    

    static JFrame f = new JFrame("Flappy Bird");
    static int hauteurTitle = 0;
    static CardLayout cardLayout = new CardLayout();
    static Container container;
    static Clip musicMenu; 

    Fenetre() {
        hauteurTitle = f.getHeight();
        f.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
        f.setVisible(true);
        f.setPreferredSize(Interfacee.dimension);
        container = f.getContentPane();
        container.setLayout(cardLayout);
        container.setFocusable(true);
        container.add("Start", new Start());
        cardLayout.show(container,"Start");
        f.pack();
        musicMenu = Musique.play("./Musique/22-Title-Theme-_-Mario-Kart-64-_Test-Wii-Theme_.wav", true, -30.0f);
        f.setResizable(false);
        f.setLocationRelativeTo(null);
  
    }
    Fenetre(String musicPath,String title) {
        f.setTitle(title);
        hauteurTitle = f.getHeight();
        f.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
        f.setVisible(true);
        //f.setPreferredSize(Interfacee.dimension);
        container = f.getContentPane();
        container.setLayout(cardLayout);
        container.setFocusable(true);
    }
    
}
