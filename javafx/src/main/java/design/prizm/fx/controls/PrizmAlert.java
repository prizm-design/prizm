package design.prizm.fx.controls;

import javafx.scene.Node;
import javafx.scene.control.Label;
import javafx.scene.layout.HBox;
import javafx.scene.layout.Priority;
import javafx.scene.layout.StackPane;
import javafx.scene.layout.VBox;

/**
 * A PRIZM inline message block — an optional icon, a title, and a description,
 * in one of five status variants. No stock JavaFX control maps to this, so it's
 * a composite over {@link HBox} (like {@link PrizmCard}), styled by the
 * {@code .prizm-alert} rules in {@code prizm.css}.
 *
 * <p>Each variant tints the background and border and colours the whole text,
 * mirroring the web. JavaFX CSS can't alpha-mix a looked-up colour, so the
 * tints are precomputed (status colour composited over the theme background) as
 * {@code -color-<status>-subtle} / {@code -color-<status>-border} tokens by the
 * theme generator. Mirrors {@code Alert} + {@code AlertTitle} +
 * {@code AlertDescription} in {@code components/ui/alert.tsx}.
 */
public class PrizmAlert extends HBox {

    public enum Variant {
        DEFAULT,
        INFO,
        SUCCESS,
        WARNING,
        DANGER
    }

    private final StackPane iconBox = new StackPane();
    private final Label title = new Label();
    private final Label body = new Label();
    private Variant variant = Variant.DEFAULT;

    public PrizmAlert() {
        getStyleClass().add("prizm-alert");
        setSpacing(10);

        iconBox.getStyleClass().add("prizm-alert__icon");
        showIcon(false);

        title.getStyleClass().add("prizm-alert__title");
        title.setWrapText(true);
        body.getStyleClass().add("prizm-alert__body");
        body.setWrapText(true);

        var textCol = new VBox(2, title, body);
        HBox.setHgrow(textCol, Priority.ALWAYS);
        getChildren().addAll(iconBox, textCol);

        setTitle(null);
        setBody(null);
        applyVariant();
    }

    public PrizmAlert(Variant variant, String titleText, String bodyText) {
        this();
        setVariant(variant);
        setTitle(titleText);
        setBody(bodyText);
    }

    public void setVariant(Variant variant) {
        this.variant = variant == null ? Variant.DEFAULT : variant;
        applyVariant();
    }

    public void setTitle(String text) {
        title.setText(text == null ? "" : text);
        manage(title);
    }

    public void setBody(String text) {
        body.setText(text == null ? "" : text);
        manage(body);
    }

    /** Optional leading icon. Pass {@code null} to remove it. Colour it yourself. */
    public void setIcon(Node icon) {
        iconBox.getChildren().clear();
        if (icon != null) {
            iconBox.getChildren().add(icon);
        }
        showIcon(icon != null);
    }

    private void showIcon(boolean visible) {
        iconBox.setManaged(visible);
        iconBox.setVisible(visible);
    }

    private void manage(Label label) {
        boolean shown = !label.getText().isEmpty();
        label.setManaged(shown);
        label.setVisible(shown);
    }

    private void applyVariant() {
        getStyleClass().removeAll(
            "prizm-alert--info",
            "prizm-alert--success",
            "prizm-alert--warning",
            "prizm-alert--danger");
        if (variant != Variant.DEFAULT) {
            getStyleClass().add("prizm-alert--" + variant.name().toLowerCase());
        }
    }
}
