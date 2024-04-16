package MyProjects.FlappyBird;
import javax.swing.JPanel;
import javax.swing.JTextArea;
import javax.swing.Timer;
import java.awt.Color;
import java.awt.Dimension;
import java.awt.Font;
import java.awt.Graphics;
import java.awt.Toolkit;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;
import java.awt.event.KeyEvent;
import java.awt.event.KeyListener;


public class Interfacee extends JPanel implements KeyListener,ActionListener{

    static Font font = new Font("Fira Code", Font.BOLD, 50);
    static Dimension dimension = Toolkit.getDefaultToolkit().getScreenSize();
    static final int WIDTH = (int)dimension.getWidth();
    static final int HEIGHT = (int)dimension.getHeight() - Fenetre.hauteurTitle +7;
    Timer timer;
    //Timer rejouer;
    int move = WIDTH-500;
    int down = (HEIGHT - 50)/2;
    int h1 = 400;
    int h2 = 600;
    static final int distance_pipes = 300;
    static final int gap = 200;
    static final int begin = 100;
    static final int largPipe = 100;
    boolean firstPipe = true;
    boolean alive = true;
    int score = 0;
    JTextArea textArea = new JTextArea(String.valueOf(score));
    Bouton rematch = new Bouton(100, 50, "Rejouer", Color.WHITE, Color.BLACK);
    Bouton home = new Bouton(100, 50, "Menu Principal", Color.WHITE, Color.BLACK);

    Interfacee(){
        
        setPreferredSize(dimension);
        setLayout(null);
        setBackground(Color.WHITE);
        textArea.setEditable(false);
        textArea.setFont(font);

        add(textArea).setBounds(0, 0, getFontMetrics(font).stringWidth(String.valueOf(score)), getFontMetrics(font).getHeight());

        timer = new Timer(1, new ActionListener() {

            @Override
            public void actionPerformed(ActionEvent e) {
                down += 5;
                move -= 5;
                repaint();
                collision();

            }
            
        });
        addKeyListener(this);
        setFocusable(true);
        requestFocusInWindow(); 
        timer.start();

    }
         
    void start() {
            timer.start();
        }

    void replay() {
        rematch.setVisible(false);
        home.setVisible(false);
        h1 = 400;
        h2 = 600;
        move = WIDTH-500;
        down = (HEIGHT - 50)/2;
        firstPipe = true;
        alive = true;
        score = 0;
        textArea.setText("0");
        //addKeyListener(this);
        setFocusable(true);
        requestFocusInWindow();
        start();
    }

    boolean verif(){
        if (move == begin) return true;

        for (int i = 1; i < 101 ;i++) {
            if (move == begin - i) {
                return true;
            }
        }
        return false; 
    }


    void collision() {
        if((verif()) && ((down > h2) || (down < h1))) {
            timer.stop();
            alive = false;
        }
        if (down < 0 || down > HEIGHT) {
            timer.stop();
            alive = false;
        }
        if(!alive) {
            Musique.play("./Musique/game-over.wav", false, -50.0f);
            repaint();
            Start.musicJeu.stop();
            add(rematch).setBounds((WIDTH-450)/2,(HEIGHT-50)/2,450,50);
            add(home).setBounds(rematch.getX(), rematch.getY() + rematch.getHeight()*2, 450, 50);
            rematch.setVisible(true);
            home.setVisible(true);
            rematch.addActionListener(this);
            home.addActionListener(this);
/*             try {
                FileWriter fileWriter = new FileWriter("./HiScore.txt");
                FileReader fileReader = new FileReader("./HiScore.txt");
                BufferedReader br = new BufferedReader(fileReader);
                String res = br.readLine(); 
                String hi_Score = "";
                if (res != null) {
                    hi_Score = res;
                }
                else{
                    hi_Score = "0";
                    BufferedWriter bw = new BufferedWriter(fileWriter);
                    bw.write(hi_Score);
                    bw.flush();
                    bw.close();
                }
                if (score > Integer.parseInt(hi_Score)) {
                    FileWriter fileW = new FileWriter("./HiScore.txt");
                    BufferedWriter bw = new BufferedWriter(fileW);
                    bw.write(String.valueOf(score));
                    bw.flush();
                    fileW.close();
                }
                
                fileReader.close();
                fileWriter.close();
            } catch (IOException e) {
                System.err.println(e);
            } */
        }
    }


    int generePipes(Graphics g,int move){
        if (move < 0 ) {
            move = WIDTH-300;
            h1 = (int)(Math.random()*(HEIGHT-gap)) + 10;
            h2 = h1 + gap;
            score++;
            Musique.play("./Musique/piece.wav", false, -60.0f);
            textArea.setText(String.valueOf(score));
            add(textArea).setBounds(0, 0, getFontMetrics(font).stringWidth(String.valueOf(score)), getFontMetrics(font).getHeight());;
            
        }
        return move;
    }


    @Override
    protected void paintComponent(Graphics g) {
        if(alive) {
            super.paintComponent(g);
            g.setColor(Color.RED);
            g.fillRect(begin, down, 50, 50);
            g.setColor(Color.GREEN);
            g.fillRect(move, 0,100 , h1);
            g.fillRect(move, h2,100 , h2+HEIGHT);    
            move = generePipes(g,move);
        }
        else {
            g.setColor(getBackground());
            g.fillRect(0, 0, WIDTH, HEIGHT);
        }
    }



    @Override
    public void keyTyped(KeyEvent e) {
        // Ignorer keyTyped pour la barre d'espace
    }

    @Override
    public void keyPressed(KeyEvent e) {
        if(alive) {
            if (e.getKeyCode() == KeyEvent.VK_SPACE) {
                Musique.play("./Musique/saut.wav", false,-58.0f);
                down -= 130;
                repaint();
            }
        }
    }

    @Override
    public void keyReleased(KeyEvent e) {
        // Ignorer keyReleased pour la barre d'espace
    }

    @Override
    public void actionPerformed(ActionEvent e) {
        if (e.getSource() == rematch) {
            Musique.restart(Start.musicJeu);
            replay();
        }
        if(e.getSource() == home) {
            Fenetre.cardLayout.previous(Fenetre.container);
            Musique.restart(Fenetre.musicMenu);
        }
    }
}