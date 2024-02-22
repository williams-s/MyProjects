import java.awt.Font;
import java.awt.FontMetrics;
import java.awt.event.ActionEvent;
import java.awt.event.KeyEvent;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.util.ArrayList;
import java.util.Arrays;

import javax.swing.JLabel;
import javax.swing.JOptionPane;
import javax.swing.JPasswordField;
import javax.swing.JTextArea;
import javax.swing.JTextField;



public class Inscription extends Account {

    Font fontInfos = new Font(Account.font.getName(), Font.ITALIC, 10);
    int lengthTelephone = 0;
    static int code;
    FontMetrics fontMetricsInfos = getFontMetrics(fontInfos);
    int hauteurInfos = fontMetricsInfos.getHeight();

    String numeros = "";

    static final int HEIGHT = Fenetre.HEIGHT*42/100;
    int hauteurChamps = champMDP.getHeight();
    JLabel register = Page.register; 

    JTextArea passwordBis = new JTextArea("*Confirmer Password : ");
    JPasswordField mdpBis = new JPasswordField();

    JTextArea user = new JTextArea("*Username : ");
    JTextField userInput = new JTextField();
    //JTextArea isMail = new JTextArea();

    JTextArea adresse = new JTextArea("Adresse : ");
    JTextField adresseInput = new JTextField();

    JTextArea telephone = new JTextArea("*Telephone : +33 ");
    JTextField telephoneInput = new JTextField();

 

    Inscription(int width) {
        super(width,HEIGHT);
        this.stayConnect.setVisible(false);
        this.mdpForgot.setVisible(false);
        this.inscrire.setText("Confirmer l'inscription");
        this.connect.setText("Se connecter a un compte existant");
        int hauteur = champUser.getHeight() + champMDP.getHeight() + tickness;
        int bordureWidth = this.getWidth() - tickness*2;
        int bordureHeight =hauteurTexte + tickness; 
        
        this.add(new ChampsConnexion(passwordBis, mdpBis, width, hauteurTexte)).setBounds(tickness, hauteur, bordureWidth, bordureHeight);;
        hauteur += hauteurChamps;

        this.add(new ChampsConnexion(user, userInput,width , hauteurTexte)).setBounds(tickness, hauteur, bordureWidth,bordureHeight);
        hauteur += hauteurChamps;

        this.add(new ChampsConnexion(adresse, adresseInput, width, hauteurTexte)).setBounds(tickness, hauteur, bordureWidth, bordureHeight);
        hauteur += hauteurChamps;
        this.add(new ChampsConnexion(telephone, telephoneInput, width, hauteurTexte)).setBounds(tickness, hauteur, bordureWidth, bordureHeight);
        this.remove(stayConnect);
        this.remove(mdpForgot);
        this.add(inscrire);
        this.add(connect);
        this.add(quitter);
        mailInput.addKeyListener(this);
        telephoneInput.addKeyListener(this);
        telephoneInput.setDocument(new LimitJTextField(13)); 
        double codeDouble = Math.random();
        codeDouble = codeDouble*9999;
        //System.out.println((int)codeDouble);
        code = completeCode((int)codeDouble);

    }


    void addBaseDonnees() {
        try {                                                         
            //Class.forName("com.mysql.cj.jdbc.Driver");
            Connection conn = App.connectBDD(); 
            //Statement stmt = conn.createStatement();
            PreparedStatement prepare = conn.prepareStatement("Insert into login(mail,password,username,adresse,telephone) values (?,?,?,?,?)");
            prepare.setString(1, mailInput.getText());
            prepare.setString(2, String.valueOf(mdp.getPassword()));
            prepare.setString(3, userInput.getText());
            prepare.setString(4, adresseInput.getText());
            prepare.setString(5, "+33 " + telephoneInput.getText());
            prepare.executeUpdate();
            conn.close();
        }
        catch(Exception e ) {
            if (e.getMessage().substring(0,15).equals("Duplicate entry"))
            JOptionPane.showMessageDialog(f, "Ce mail appartient deja à un compte existant !","Erreur",JOptionPane.ERROR_MESSAGE);
            else {
                System.err.println(e);
            }
        }
    }


    static boolean verifMail(String mailText){
        //String mailText = mailInput.getText();
       if(!mailText.matches( "([^.@]+)(\\.[^.@]+)*@([^.@]+\\.)+([^.@]+)" ) )
            return false;
        else {
            return true;
        }
    }


    boolean verifMdp(){
        //System.out.println(Arrays.toString(mdp.getPassword()) + " = " + Arrays.toString(mdpBis.getPassword()));
        return (Arrays.toString(mdp.getPassword()).equals(Arrays.toString(mdpBis.getPassword())));
    }
    
   static boolean verifNumero(String str) {
        if (str.matches("[0-9]*") && (!str.isEmpty()) && (str.length() == 9) ) {

            return true;
        }
        return false;
    }

    String sansEspace(String s){
        int lgth = s.length();
        String res ="";
        for (int i = 0; i < lgth ; i++) {
            if (s.charAt(i) != ' ' ) {
                res += String.valueOf(s.charAt(i));
            }
        }
        return res;
    }

    void verifInfos() {

    }
    void espaceNumeros() {

        String tel = telephoneInput.getText();
   
            if (tel.length() == 1)
                telephoneInput.setText(tel+ " ");
            if (tel.length() == 4 || tel.length() == 7 || tel.length() == 10) {
                telephoneInput.setText(tel+ " ");
            }
    }

    @Override
    public void keyTyped(KeyEvent e) {
        if (e.getSource() == telephoneInput) {
            char c = e.getKeyChar();
            if ( ((c < '0') || (c > '9')) && (c != KeyEvent.VK_BACK_SPACE)) {
                e.consume();  // ignore event
            }
            else{
                int lgt = telephoneInput.getText().length();
                if (lgt >= lengthTelephone) {
                    espaceNumeros();
                }
                lengthTelephone = telephoneInput.getText().length();
            }
        }
    }
        

    @Override
    public void keyPressed(KeyEvent e) {

    }

    @Override
    public void keyReleased(KeyEvent e) {

    }

    //@Override
    public void actionPerformed(ActionEvent e) {
        if (e.getSource() == connect) {
            cardLayout.show(register, "acc");
            register.setSize(register.getWidth(), (hauteurTexte*2)+Account.tickness*3 + Account.BOUTONHEIGHT + hauteurTexte + 130);
        }
        if(e.getSource() == quitter) {
            f.dispose();
        }
        if(e.getSource() == inscrire) {
            //if (Arrays.toString(mdp.getPassword()).length() < 7 ) JOptionPane.showMessageDialog(f, "Le mot de passe doit faire au moins 7 caractères","Erreur de Mot de Passe",JOptionPane.WARNING_MESSAGE); 
            ArrayList<String> champs = new ArrayList<String>();
            Boolean num = verifNumero(sansEspace(telephoneInput.getText()));
            Boolean passWord = verifMdp();
            Boolean maiBoolean = verifMail(this.mailInput.getText());
            Boolean isInscrit = true;



            if (mailInput.getText().isBlank() || mdp.getPassword().length == 0 || userInput.getText().isBlank()) {JOptionPane.showMessageDialog(f, "Certains champs sont incorrects, veuillez recommencer");isInscrit = false;}
            if (!num) {champs.add("Numéro de téléphone"); isInscrit = false;}
            if (!maiBoolean) {champs.add("Adresse mail"); isInscrit = false;}
            if (!passWord) {JOptionPane.showMessageDialog(f,"Les mots de passe ne sont pas les mêmes, veuillez recommencer !","Erreur d'inscription",JOptionPane.WARNING_MESSAGE); isInscrit = false;}
            if (!champs.isEmpty()) {JOptionPane.showMessageDialog(f,"Le(s) champ(s) : " + champs.toString() + " sont erroné(s), veuillez le(s) modifier. ","Erreur d'inscription",JOptionPane.WARNING_MESSAGE); isInscrit = false;}
    

            if(isInscrit)
                try {
                Connection conn = App.connectBDD();
                PreparedStatement preparedStatement = conn.prepareStatement("Select username from login where mail = ?");
                preparedStatement.setString(1, mailInput.getText());
                ResultSet res = preparedStatement.executeQuery();
                res.next();
                res.getString("username");
                JOptionPane.showMessageDialog(f, "Ce mail est deja associé à un compte !","Erreur",JOptionPane.ERROR_MESSAGE);
                //Page.allAdresse.setVisible(true);
                isInscrit = false;
            } catch (Exception exepeex) {

            }

            if (isInscrit) {
                Mail.send("techcarepoo@gmail.com", "ydzb dawd mllz dtpu", mailInput.getText(), "Code de verification TechCare", "Cher " + userInput.getText() +",\nVoici le code verification temporaire afin de confirmer votre inscription à TechCare\n\nCode de verification : " + String.valueOf(code) + "\nMerci de faire confiance à TechCare !\n\nCordialement,\nL'équipe TechCare");
                String x = JOptionPane.showInputDialog("Veuillez rentrer le code de validation envoyé par mail : ");
                if (Integer.parseInt(x) == code) {
                    Mail.send("techcarepoo@gmail.com", "ydzb dawd mllz dtpu", mailInput.getText(), "Confirmation d'inscription", "Cher " + userInput.getText() + ",\n" + "Nous sommes ravis de vous informer que votre inscription à TechCare a été réussie ! Bienvenue dans notre communauté.\n\nVoici un récapitulatif de vos informations d'inscription : \nNom d'utilisateur : " + userInput.getText() + "\nAdresse e-mail : " + mailInput.getText() + "\n\nN'hésitez pas à explorer notre plateforme et à profiter de tous les avantages qu'elle offre.\n\nMerci de faire partie de TechCare !\n\nCordialement,\nL'équipe TechCare");
                    addBaseDonnees();
                    cardLayout.show(register, "acc");
                    register.setSize(register.getWidth(), (hauteurTexte*2)+Account.tickness*3 + Account.BOUTONHEIGHT + hauteurTexte + 130);
                }
                else {
                    JOptionPane.showMessageDialog(f, "Le code rentré est incorrect, réessayer","Erreur de verification",JOptionPane.ERROR_MESSAGE);
                }
            }
        }
    }
    
    

}
