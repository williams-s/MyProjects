public class Humidite extends Temperatures {
    
    static final int BORNEINF = 42;
    static TemperaturePanel panelHumi = new TemperaturePanel("Taux d'humiditié en %",BORNEINF);
    Humidite(String str) {
        super(str,"Humidité","%",panelHumi);
    }
}
