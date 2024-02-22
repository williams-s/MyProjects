import java.awt.Color;
import java.awt.Font;
import java.awt.FontMetrics;

import javax.swing.JTextPane;
import javax.swing.text.SimpleAttributeSet;
import javax.swing.text.StyleConstants;
import javax.swing.text.StyledDocument;


public class TexteBoutique extends JTextPane {
    
    static Font font = new Font(Account.font.getName(),Font.BOLD,40);
    FontMetrics fontMetrics = getFontMetrics(font);
    int hauteurTxt = fontMetrics.getHeight();
    TexteBoutique() {
        this.setFont(font);
        this.setBackground(Fenetre.BG);
        this.setEditable(false);
        this.setForeground(Color.YELLOW);
        StyledDocument documentStyle = this.getStyledDocument();
        SimpleAttributeSet centerAttribute = new SimpleAttributeSet();
        StyleConstants.setAlignment(centerAttribute, StyleConstants.ALIGN_CENTER);
        documentStyle.setParagraphAttributes(0, documentStyle.getLength(), centerAttribute, false);
        this.setFocusable(false);
        this.setBorder(null);
    }

    TexteBoutique(String text){
        this();
        this.setText(text);
    }
}
