package design.prizm.fx.controls;

import javafx.geometry.Pos;
import javafx.scene.Node;
import javafx.scene.control.Label;
import javafx.scene.layout.StackPane;
import javafx.scene.layout.VBox;

/**
 * A PRIZM placeholder for an empty content region — an optional icon in a
 * muted circle, a title, an optional description, and an optional action.
 * Centred. No stock JavaFX control maps to this, so it's a composite over
 * {@link VBox} (like {@link PrizmCard}), styled by the {@code .prizm-empty-state}
 * rules in {@code prizm.css}. Mirrors the React {@code EmptyState}
 * ({@code components/ui/empty-state.tsx}).
 */
public class PrizmEmptyState extends VBox {

    private final StackPane iconBox = new StackPane();
    private final Label title = new Label();
    private final Label description = new Label();
    private Node action;

    public PrizmEmptyState() {
        getStyleClass().add("prizm-empty-state");
        setAlignment(Pos.CENTER);
        setSpacing(8);

        iconBox.getStyleClass().add("prizm-empty-state__icon");
        showIcon(false);
        title.getStyleClass().add("prizm-empty-state__title");
        description.getStyleClass().add("prizm-empty-state__description");
        description.setWrapText(true);
        description.setMaxWidth(280);

        setDescription(null);
        rebuild();
    }

    public PrizmEmptyState(String titleText) {
        this();
        setTitle(titleText);
    }

    public void setTitle(String text) {
        title.setText(text == null ? "" : text);
    }

    public void setDescription(String text) {
        description.setText(text == null ? "" : text);
        rebuild();
    }

    /** Optional leading icon, shown in a muted circle. Pass {@code null} to remove. */
    public void setIcon(Node icon) {
        iconBox.getChildren().clear();
        if (icon != null) {
            iconBox.getChildren().add(icon);
        }
        showIcon(icon != null);
        rebuild();
    }

    /** Optional action below the text (e.g. a PrizmButton). Pass {@code null} to remove. */
    public void setAction(Node action) {
        this.action = action;
        rebuild();
    }

    private void showIcon(boolean visible) {
        iconBox.setManaged(visible);
        iconBox.setVisible(visible);
    }

    private void rebuild() {
        getChildren().clear();
        if (iconBox.isVisible()) {
            getChildren().add(iconBox);
        }
        getChildren().add(title);
        if (!description.getText().isEmpty()) {
            getChildren().add(description);
        }
        if (action != null) {
            getChildren().add(action);
        }
    }
}
