package design.prizm.fx.controls;

import javafx.animation.FadeTransition;
import javafx.animation.PauseTransition;
import javafx.animation.TranslateTransition;
import javafx.geometry.Insets;
import javafx.geometry.Pos;
import javafx.scene.layout.Region;
import javafx.scene.layout.StackPane;
import javafx.scene.layout.VBox;
import javafx.util.Duration;

/**
 * Manages {@link PrizmToast}s for a host {@link StackPane}: a bottom-right
 * overlay stack into which toasts slide + fade, auto-dismissing after a timeout.
 * The web equivalent is the {@code toast} singleton + {@code ToastProvider};
 * here it's an instance bound to a host (no global state), which suits JavaFX.
 *
 * <p>The overlay sizes to its content and is {@code pickOnBounds=false}, so empty
 * areas pass clicks through to the app underneath. Construct one per host (e.g.
 * your scene root wrapped in a StackPane) and call {@link #show}.
 */
public class PrizmToaster {

    private static final Duration ANIM = Duration.millis(200);
    private static final Duration DEFAULT_TIMEOUT = Duration.seconds(5);

    private final VBox stack = new VBox(8);

    public PrizmToaster(StackPane host) {
        stack.getStyleClass().add("prizm-toaster");
        stack.setAlignment(Pos.BOTTOM_RIGHT);
        stack.setPadding(new Insets(16));
        stack.setPickOnBounds(false);
        stack.setMaxSize(Region.USE_PREF_SIZE, Region.USE_PREF_SIZE);
        StackPane.setAlignment(stack, Pos.BOTTOM_RIGHT);
        host.getChildren().add(stack);
    }

    public PrizmToast show(PrizmToast.Variant variant, String title, String message) {
        return show(variant, title, message, DEFAULT_TIMEOUT);
    }

    /** Show a toast; auto-dismisses after {@code timeout} (pass null / zero to keep it). */
    public PrizmToast show(PrizmToast.Variant variant, String title, String message, Duration timeout) {
        var toast = new PrizmToast(variant, title, message);
        toast.setMaxWidth(360);
        toast.setOnClose(() -> dismiss(toast));
        stack.getChildren().add(toast);

        toast.setOpacity(0);
        toast.setTranslateY(8);
        var fade = new FadeTransition(ANIM, toast);
        fade.setToValue(1);
        var slide = new TranslateTransition(ANIM, toast);
        slide.setToY(0);
        fade.play();
        slide.play();

        if (timeout != null && timeout.greaterThan(Duration.ZERO)) {
            var pause = new PauseTransition(timeout);
            pause.setOnFinished(e -> dismiss(toast));
            pause.play();
        }
        return toast;
    }

    public void dismiss(PrizmToast toast) {
        if (!stack.getChildren().contains(toast)) {
            return;
        }
        var fade = new FadeTransition(ANIM, toast);
        fade.setToValue(0);
        var slide = new TranslateTransition(ANIM, toast);
        slide.setToY(8);
        fade.setOnFinished(e -> stack.getChildren().remove(toast));
        fade.play();
        slide.play();
    }
}
