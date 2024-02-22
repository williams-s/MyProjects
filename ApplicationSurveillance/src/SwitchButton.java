import java.awt.Color;
import java.awt.Component;
import java.awt.Cursor;
import java.awt.Graphics;
import java.awt.Graphics2D;
import java.awt.RenderingHints;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;
import java.awt.event.MouseEvent;
import java.awt.event.MouseListener;

import javax.swing.Timer;


public class SwitchButton extends Component implements MouseListener {
    
    Timer timer;
    int width = 75;
    int height = 25;
    int mouvement = 10;
    int coord;
    boolean select = false;

    public boolean isSelect() {
        return select;
    }

    public void setSelect(boolean select) {
        this.select = select;
    }

    SwitchButton() {
        this.setBackground(Fenetre.blue);
        this.setForeground(Color.WHITE);
        this.setCursor(new Cursor(Cursor.HAND_CURSOR));
         timer = new Timer(1, new ActionListener() {

            @Override
            public void actionPerformed(ActionEvent e) {
                if (select){
                    int fin = width - height + 2;
                    if (coord < fin) {
                        coord += mouvement; 
                        repaint();
                    }
                    else {
                        coord = fin;
                        repaint();
                    }
                }
                else {
                    int fin = 2;
                    if(coord>fin) {
                        coord -= mouvement;
                        repaint();
                    }
                    else {
                        coord = fin;
                        repaint();
                    }
                }
            }
        });
        addMouseListener(this);
    }

    @Override
    public void paint(Graphics graphics) {
        Graphics2D g = (Graphics2D)graphics;
        g.setRenderingHint(RenderingHints.KEY_ANTIALIASING, RenderingHints.VALUE_ANTIALIAS_ON);
        if (!select) {
            g.setColor(Color.GRAY);
        }
        else {
            g.setColor(getBackground());
        };
        g.fillRoundRect(0, 0, width, height,25,25);
        g.setColor(getForeground());
        g.fillOval(coord, 2, height-4, height-4);
        super.paint(graphics);
    }

    @Override
    public void mouseClicked(MouseEvent e) {
        select = !select;
        timer.start();
    }

    @Override
    public void mousePressed(MouseEvent e) {

    }

    @Override
    public void mouseReleased(MouseEvent e) {

    }

    @Override
    public void mouseEntered(MouseEvent e) {

    }

    @Override
    public void mouseExited(MouseEvent e) {

    }

}


