import java.awt.Color;
import java.awt.Dimension;
import java.awt.Font;
import javax.swing.Icon;
import javax.swing.ImageIcon;
import javax.swing.JButton;

public class Bouton extends JButton {

    int width;
    int height;
    
    Bouton(int width, int height ) {
        this.width = width;
        this.height = height;
        this.setPreferredSize(new Dimension(this.width, this.height));
        this.setBackground(Color.WHITE);
        this.setLayout(null);


    }

    Bouton(int width, int height, String text){
        this( width,  height);
        this.setText(text);
    }
    Bouton(int width, int height, String text, Font font) {
        this(width, height, text);
        this.setFont(font);
    }

    Bouton(int width, int height, String text, Color background) {
        this(width, height, text);
        this.setBackground(background);
    }

    Bouton(int width,int height, String text, Color bg, Color foreground) {
        this(width, height, text, bg);
        this.setForeground(foreground);
    }
    Bouton(int width,int height, String text, Color bg, Color foreground,Icon icon) {
        this(width, height, text, bg,foreground);
        this.setIcon(icon);
    }

    Bouton(int width, int height,Icon icon){
        this( width,  height);
        this.setIcon(icon);
        
    }

    Bouton(int width, int height, Icon icon, Color background) {
        this(width, height, icon);
        this.setBackground(background);
    }
    
    Bouton(int width, int height,String text, Color bg, Color fg , Font font) {
        this(width, height, text, bg, fg);
        this.setFont(font);
    }

    Bouton(int width, int height,String text, Color bg, Color fg , Font font,int taille) {
        this(width, height, text, bg, fg);
        Font fontbis = new Font(font.getName(),Font.BOLD,taille);
        this.setFont(fontbis);
    }

    Bouton(int width, int height,String text, Color bg, Color fg , Font font,int taille,ImageIcon img) {
        this(width, height, text, bg, fg);
        Font fontbis = new Font(font.getName(),Font.BOLD,taille);
        this.setFont(fontbis);
        this.setIcon(img);
    }

}
