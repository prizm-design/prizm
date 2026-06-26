package design.prizm.fx.controls;

import javafx.animation.FadeTransition;
import javafx.animation.ScaleTransition;
import javafx.event.EventHandler;
import javafx.geometry.Insets;
import javafx.geometry.Pos;
import javafx.scene.Node;
import javafx.scene.control.Label;
import javafx.scene.input.KeyCode;
import javafx.scene.input.KeyEvent;
import javafx.scene.layout.HBox;
import javafx.scene.layout.Region;
import javafx.scene.layout.StackPane;
import javafx.scene.layout.VBox;
import javafx.scene.shape.SVGPath;
import javafx.util.Duration;

/**
 * A PRIZM modal dialog for focused tasks. Rather than a separate OS window (whose
 * native chrome and square bounds fight a rounded card), this is an in-scene
 * overlay controller — like {@link PrizmSheet} / {@link PrizmCommand}: a scrim
 * plus a centred card with a title, a close ✕, a body, and a footer of action
 * buttons. Styled by the {@code .prizm-dialog} / {@code .prizm-dialog-scrim} rules
 * in {@code prizm.css}.
 *
 * <p>Call {@link #show(StackPane)} with a full-size host (e.g. the scene root
 * wrapped in a StackPane); the scrim, the ✕, {@code Esc}, and {@link #hide()} all
 * dismiss it. Add footer buttons with {@link #addAction}. Mirrors the React
 * {@code Dialog} ({@code components/ui/dialog.tsx}).
 */
public class PrizmDialog {

    private static final Duration DURATION = Duration.millis(150);

    private final Region scrim = new Region();
    private final StackPane card = new StackPane();
    private final VBox content = new VBox();
    private final Label titleLabel = new Label();
    private final VBox bodyBox = new VBox();
    private final HBox buttonBar = new HBox(8);
    private final EventHandler<KeyEvent> escHandler = ev -> {
        if (ev.getCode() == KeyCode.ESCAPE) {
            hide();
        }
    };
    private StackPane host;

    public PrizmDialog() {
        scrim.getStyleClass().add("prizm-dialog-scrim");
        scrim.setOnMouseClicked(e -> hide());

        titleLabel.getStyleClass().add("prizm-dialog__title");
        titleLabel.setWrapText(true);
        bodyBox.getStyleClass().add("prizm-dialog__body");
        buttonBar.getStyleClass().add("prizm-dialog__buttons");
        buttonBar.setAlignment(Pos.CENTER_RIGHT);
        content.getChildren().addAll(titleLabel, bodyBox, buttonBar);

        var closeIcon = new SVGPath();
        closeIcon.setContent("M18 6 L6 18 M6 6 L18 18");
        closeIcon.getStyleClass().add("prizm-dialog__close-icon");
        closeIcon.setScaleX(16.0 / 24.0);
        closeIcon.setScaleY(16.0 / 24.0);
        var closeButton = new StackPane(closeIcon);
        closeButton.getStyleClass().add("prizm-dialog__close");
        // Pin the size, else the StackPane stretches it to fill and the icon
        // ends up centred in the card instead of in the corner.
        closeButton.setMinSize(20, 20);
        closeButton.setPrefSize(20, 20);
        closeButton.setMaxSize(20, 20);
        closeButton.setOnMouseClicked(e -> hide());

        // The ✕ floats in the top-right corner (above the title), like the web.
        card.getStyleClass().add("prizm-dialog");
        card.getChildren().addAll(content, closeButton);
        StackPane.setAlignment(closeButton, Pos.TOP_RIGHT);
        StackPane.setMargin(closeButton, new Insets(14, 14, 0, 0));
        card.setPrefWidth(420);
        card.setMaxSize(420, Region.USE_PREF_SIZE);
        StackPane.setAlignment(card, Pos.CENTER);
    }

    public PrizmDialog(String title, String message) {
        this();
        setTitle(title);
        setBody(message);
    }

    public void setTitle(String title) {
        titleLabel.setText(title);
    }

    /** Set the body as text. */
    public void setBody(String message) {
        var label = new Label(message);
        label.getStyleClass().add("prizm-dialog__message");
        label.setWrapText(true);
        bodyBox.getChildren().setAll(label);
    }

    /** Set the body as an arbitrary node (replaces the text content). */
    public void setBody(Node content) {
        bodyBox.getChildren().setAll(content);
    }

    /** Add a footer action button; {@code action} may be null (just dismisses). */
    public PrizmButton addAction(String text, PrizmButton.Variant variant, Runnable action) {
        var btn = new PrizmButton(text, variant);
        btn.setOnAction(e -> {
            hide();
            if (action != null) {
                action.run();
            }
        });
        buttonBar.getChildren().add(btn);
        return btn;
    }

    public boolean isShowing() {
        return host != null;
    }

    /** Overlay the dialog on the host (a full-size StackPane) and fade/scale it in. */
    public void show(StackPane host) {
        if (this.host != null) {
            return;
        }
        this.host = host;
        host.getChildren().addAll(scrim, card);
        if (host.getScene() != null) {
            host.getScene().addEventFilter(KeyEvent.KEY_PRESSED, escHandler);
        }

        scrim.setOpacity(0);
        var fade = new FadeTransition(DURATION, scrim);
        fade.setFromValue(0);
        fade.setToValue(1);

        card.setScaleX(0.96);
        card.setScaleY(0.96);
        var pop = new ScaleTransition(DURATION, card);
        pop.setToX(1);
        pop.setToY(1);

        fade.play();
        pop.play();
    }

    /** Fade the dialog out and remove it from the host. */
    public void hide() {
        if (host == null) {
            return;
        }
        var current = host;
        host = null;
        if (current.getScene() != null) {
            current.getScene().removeEventFilter(KeyEvent.KEY_PRESSED, escHandler);
        }

        var fade = new FadeTransition(DURATION, scrim);
        fade.setFromValue(1);
        fade.setToValue(0);
        fade.setOnFinished(e -> current.getChildren().removeAll(scrim, card));
        fade.play();
    }
}
