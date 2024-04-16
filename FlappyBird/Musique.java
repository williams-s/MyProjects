package MyProjects.FlappyBird;
import java.io.File;

import javax.sound.sampled.AudioInputStream;
import javax.sound.sampled.AudioSystem;
import javax.sound.sampled.Clip;
import javax.sound.sampled.FloatControl;

public class Musique {
 
    
    public static Clip play(String path,Boolean loop,Float gain){
        try {
            
            File file = new File(path);
            AudioInputStream audioInput = AudioSystem.getAudioInputStream(file);
            Clip clip = AudioSystem.getClip();
            clip.open(audioInput);
            FloatControl gainControl = 
            (FloatControl) clip.getControl(FloatControl.Type.MASTER_GAIN);
            gainControl.setValue(gain); // Reduce volume by 10 decibels.
            //clip.start();
            if (loop) clip.loop(Clip.LOOP_CONTINUOUSLY);
            clip.start();
            return clip;

        } catch (Exception e) {
            System.err.println(e);
            return null;
        }
        
    }

    static void restart(Clip clip) {
        clip.setFramePosition(0);
        clip.start();
    }

    
}
