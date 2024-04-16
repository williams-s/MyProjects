package MyProjects.FlappyBird;
import java.awt.Color;
import java.awt.Dimension;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;
import java.awt.event.MouseAdapter;
import java.awt.event.MouseEvent;

import javax.swing.JButton;



public class Bouton extends JButton{
    
    int width;
    int height;
    boolean flag = false;

    Bouton(int w, int h){
        width = w;
        height = h;
        setPreferredSize(new Dimension(w, h));
    }

    Bouton(int carre,Color bg, Color fg,String txt){
        this(carre, carre);
        setBackground(bg);
        setForeground(fg);
        addMouseListener(new MouseAdapter() {
            @Override
               public void mousePressed(MouseEvent e) {
                  if (e.getButton() == MouseEvent.BUTTON3) {
                     //System.out.println("Right Button Pressed");
                     if (!flag) {
                        setBackground(Color.RED);
                     }
                     else {
                        setBackground(Color.CYAN);
                     }
                     flag = !flag;
                  }
               }
        });
        addActionListener(new ActionListener() {

            @Override
            public void actionPerformed(ActionEvent e) {
                setEnabled(false);
                setBackground(Color.WHITE);
                setText(txt);
            }
            
        });
    }

    Bouton(int w,int h,String txt, Color bg, Color fg) {
        setPreferredSize(new Dimension(w, h));
        setText(txt);
        setBackground(bg);
        setForeground(fg);
    }
}
