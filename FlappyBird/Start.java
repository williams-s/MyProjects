package MyProjects.FlappyBird;
import java.awt.BorderLayout;
import java.awt.Color;
import java.awt.FlowLayout;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;
import java.io.BufferedReader;
import java.io.FileReader;

import javax.sound.sampled.Clip;
import javax.swing.BorderFactory;
import javax.swing.JButton;
import javax.swing.JPanel;
import javax.swing.JTextArea;

public class Start extends JPanel {
    

    static final int WIDTH = Interfacee.WIDTH;
    static final int HEIGHT = Interfacee.HEIGHT;
    Bouton play = new Bouton(500, 75, "Jouer", Color.WHITE, Color.BLACK);
    Bouton hi_score = new Bouton(500, 75, "Hi-Score (bug d'enregistrement de score atm)", Color.WHITE, Color.BLACK);
    Bouton quit = new Bouton(500, 75, "Quitter", Color.WHITE, Color.BLACK);
    String highS = "0";
    JPanel jp;
    static Clip musicJeu;
    Start() {

        setPreferredSize(Interfacee.dimension);
        setLayout(null);
        jp= new JPanel();
        jp.setBorder(BorderFactory.createLineBorder(Color.RED));
        jp.setLayout(new FlowLayout(FlowLayout.CENTER, 150, 100));
        setBackground(Color.WHITE);
        jp.add(play);
        jp.add(hi_score);
        jp.add(quit);
        add(jp).setBounds((WIDTH-1000)/2,(HEIGHT-700)/2,1000,650);
        jp.setBackground(getBackground());

        play.addActionListener(new ActionListener() { 

            @Override
            public void actionPerformed(ActionEvent e) {
                Fenetre.container.add("Game",new Interfacee());
                Fenetre.cardLayout.show(Fenetre.container, "Game");
                Fenetre.container.getComponent(1).requestFocus();
                Fenetre.musicMenu.stop();
                musicJeu = Musique.play("./Musique/8-bit-background-music-for-arcade-game-come-on-mario-164702.wav",true,-50.0f);
            }
            
        });
        hi_score.addActionListener(new ActionListener() {


            @Override
            public void actionPerformed(ActionEvent e) {

                    try {
                        FileReader fileReader = new FileReader("./HiScore.txt");
                        BufferedReader br = new BufferedReader(fileReader);
                        String res = br.readLine();
                        if (res != null) {
                            highS = res;
                        }
                        JPanel panel = new JPanel();
                        panel.setLayout(new BorderLayout());
                        panel.setBorder(BorderFactory.createLineBorder(Color.RED));
                        panel.setBackground(getBackground());
                        JTextArea area = new JTextArea("Votre Meilleur Score : " + highS);
                        System.out.print(highS);
                        area.setEditable(false);
                        area.setFont(Interfacee.font);
                        panel.add(area,BorderLayout.NORTH);
                        panel.add(new JButton("4545"));
                        int wid = getFontMetrics(area.getFont()).stringWidth(area.getText());
                        add(area).setBounds((WIDTH - wid)/2,500,wid,getFontMetrics(area.getFont()).getHeight());
                        remove(jp);
                        repaint();
                        Bouton back = new Bouton(wid, 75, "Retour", getBackground(),Color.BLACK);
                        add(back).setBounds(area.getX(), area.getY() + 150, wid, 75);
                        back.addActionListener(new ActionListener() {

                            @Override
                            public void actionPerformed(ActionEvent e) {
                                remove(back);
                                remove(area);
                                add(jp);
                                repaint();
                            }
                            
                        });
                        fileReader.close();
                    } catch (Exception e1) {

                    }


                   
                
            }
            
        });
        quit.addActionListener(new ActionListener() {

            @Override
            public void actionPerformed(ActionEvent e) {
                Fenetre.f.dispose();
            }
            
        });
    }

    Start(String musicPath) {
        this();
        musicJeu = Musique.play(musicPath, true, -50.0f);
        play.addActionListener(new ActionListener() {

            @Override
            public void actionPerformed(ActionEvent e) {
                System.out.println(123);
            }
            
        });
    }
}
