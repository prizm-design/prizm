package design.prizm.fx.templates;

import design.prizm.fx.PrizmTheme;
import javafx.application.Application;
import javafx.scene.Scene;
import javafx.stage.Stage;

/**
 * Standalone launcher for the {@link PrizmAppShell} template. Run directly to
 * see the C3 thick-client shell full-window; the gallery also offers a "Launch
 * App Shell" button that opens the same shell in a new stage.
 */
public class PrizmAppShellApp extends Application {

    @Override
    public void start(Stage stage) {
        var shell = new PrizmAppShell();
        var scene = new Scene(shell, 1180, 760);
        PrizmTheme.apply(scene, shell.getMode());
        stage.setTitle("PRIZM JavaFX — C3 App Shell");
        stage.setScene(scene);
        stage.show();
    }

    public static void main(String[] args) {
        launch(args);
    }
}
