import java.awt.Font;
import java.awt.FontMetrics;

import javax.swing.JFormattedTextField;
import javax.swing.JPanel;
import javax.swing.JSpinner;
import javax.swing.JTextArea;
import javax.swing.JTextField;
import javax.swing.text.NumberFormatter;

public class ChampsConnexion extends JPanel {
    


    ChampsConnexion(JTextArea area,JTextField textField,int width,int hauteurTexte ) {
        FontMetrics fontMetrics = getFontMetrics(Account.font); 
        area.setFont(Account.font);
        textField.setFont(Account.font);
        area.setFocusable(false);
        //textField.setFocusable(false);
        this.setVisible(true);
        this.setLayout(null);
        this.setFocusable(false);
        this.setSize(width,hauteurTexte);
        this.add(area).setBounds(0, 1, fontMetrics.stringWidth(area.getText()), hauteurTexte);
        this.add(textField).setBounds(area.getWidth() ,1, width- area.getWidth() - Account.tickness*2, hauteurTexte);
    }   

    ChampsConnexion(JTextArea area,JTextField textField,int width,int hauteurTexte,Font font){
        area.setFont(font);
        textField.setFont(font);
        area.setFocusable(false);
        this.setVisible(true);
        this.setLayout(null);
        this.setFocusable(false);
        this.setSize(width,hauteurTexte);
        FontMetrics fontMetrics = getFontMetrics(font);
        this.add(area).setBounds(0, 1, fontMetrics.stringWidth(area.getText()), hauteurTexte);
        this.add(textField).setBounds(area.getWidth() ,1, width- area.getWidth() - Account.tickness*2, hauteurTexte);
    }

    ChampsConnexion(JTextArea area,JSpinner jSpinner,int width,int hauteurTexte,Font font){
        area.setFont(font);
        area.setFocusable(false);
        this.setVisible(true);
        this.setLayout(null);
        this.setFocusable(false);
        this.setSize(width,hauteurTexte);
        FontMetrics fontMetrics = getFontMetrics(font);
        this.add(area).setBounds(0, 1, fontMetrics.stringWidth(area.getText()), hauteurTexte);
        this.add(jSpinner).setBounds(area.getWidth(), 1, 50, hauteurTexte);
        JFormattedTextField textField = ((JSpinner.NumberEditor)jSpinner.getEditor()).getTextField();
        ((NumberFormatter) textField.getFormatter()).setAllowsInvalid(false);
    }
    
    ChampsConnexion(JTextArea area,JSpinner jSpinner,JSpinner jSpinner2,int width,int hauteurTexte,Font font){
        this(area, jSpinner, width, hauteurTexte, font);
        this.add(jSpinner2).setBounds(jSpinner.getX() + jSpinner.getWidth(), 1, 50, hauteurTexte);
            JFormattedTextField textField = ((JSpinner.NumberEditor)jSpinner2.getEditor()).getTextField();
        ((NumberFormatter) textField.getFormatter()).setAllowsInvalid(false);
    }
}
