package design.prizm.fx.controls;

import javafx.geometry.Pos;
import javafx.scene.control.Label;
import javafx.scene.layout.HBox;
import javafx.scene.layout.Priority;
import javafx.scene.layout.Region;
import javafx.scene.layout.VBox;

/**
 * A PRIZM toast — a single transient notification: an optional status dot, a
 * title, a message, and a dismiss control. Composite over {@link HBox}, styled
 * by the {@code .prizm-toast} rules in {@code prizm.css}. Show toasts via
 * {@link PrizmToaster} (which stacks, animates, and auto-dismisses them) rather
 * than placing them by hand.
 *
 * <p>The web uses a lucide icon per type; JavaFX has no icon library, so a small
 * semantic-coloured dot stands in (fits the operator aesthetic). Mirrors the
 * React {@code Toast} ({@code components/ui/toast.tsx}).
 */
public class PrizmToast extends HBox {

    public enum Variant {
        DEFAULT,
        INFO,
        SUCCESS,
        WARNING,
        ERROR
    }

    private final Region dot = new Region();
    private final Label title = new Label();
    private final Label message = new Label();
    private final Label close = new Label("✕");
    private Variant variant = Variant.DEFAULT;
    private Runnable onClose;

    public PrizmToast(Variant variant, String titleText, String messageText) {
        getStyleClass().add("prizm-toast");
        setSpacing(10);
        setAlignment(Pos.TOP_LEFT);

        dot.getStyleClass().add("prizm-toast__dot");

        title.getStyleClass().add("prizm-toast__title");
        title.setWrapText(true);
        message.getStyleClass().add("prizm-toast__message");
        message.setWrapText(true);
        var text = new VBox(2, title, message);
        HBox.setHgrow(text, Priority.ALWAYS);

        close.getStyleClass().add("prizm-toast__close");
        close.setOnMouseClicked(e -> {
            if (onClose != null) {
                onClose.run();
            }
        });

        getChildren().addAll(dot, text, close);

        setVariant(variant);
        setTitle(titleText);
        setMessage(messageText);
    }

    public void setVariant(Variant variant) {
        this.variant = variant == null ? Variant.DEFAULT : variant;
        getStyleClass().removeAll(
            "prizm-toast--info",
            "prizm-toast--success",
            "prizm-toast--warning",
            "prizm-toast--error");
        boolean typed = this.variant != Variant.DEFAULT;
        dot.setManaged(typed);
        dot.setVisible(typed);
        if (typed) {
            getStyleClass().add("prizm-toast--" + this.variant.name().toLowerCase());
        }
    }

    public void setTitle(String text) {
        title.setText(text == null ? "" : text);
        manage(title);
    }

    public void setMessage(String text) {
        message.setText(text == null ? "" : text);
        manage(message);
    }

    /** Called when the dismiss control is clicked (wired by PrizmToaster). */
    void setOnClose(Runnable onClose) {
        this.onClose = onClose;
    }

    private void manage(Label label) {
        boolean shown = !label.getText().isEmpty();
        label.setManaged(shown);
        label.setVisible(shown);
    }
}
