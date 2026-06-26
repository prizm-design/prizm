package design.prizm.fx.controls;

import javafx.scene.Node;
import javafx.scene.control.Label;
import javafx.scene.layout.VBox;

/**
 * A PRIZM form field — a label, a control, optional hint, and optional error,
 * stacked. No stock JavaFX control maps to this, so it's a small composite over
 * {@link VBox} (like {@link PrizmCard}). It pairs the label with the control via
 * {@link Label#setLabelFor} so a click on the label focuses the control.
 *
 * <p>Unlike the web {@code Field}, this carries no validation engine — Base UI's
 * {@code validate} / {@code validationMode} are a web concern. Drive the error
 * line yourself with {@link #setError(String)} (passing {@code null} clears it).
 * Mirrors {@code Field} + {@code FieldLabel} + {@code FieldControl} +
 * {@code FieldDescription} + {@code FieldError} in {@code components/ui/field.tsx}.
 */
public class PrizmField extends VBox {

    private final PrizmLabel label = new PrizmLabel();
    private final Label description = new Label();
    private final Label error = new Label();
    private Node control;

    public PrizmField() {
        getStyleClass().add("prizm-field");
        setSpacing(6);
        description.getStyleClass().add("prizm-field__description");
        description.setWrapText(true);
        error.getStyleClass().add("prizm-field__error");
        error.setWrapText(true);
        rebuild();
    }

    public PrizmField(String labelText) {
        this();
        setLabel(labelText);
    }

    public PrizmField(String labelText, Node control) {
        this(labelText);
        setControl(control);
    }

    public void setLabel(String text) {
        label.setText(text);
    }

    /** Set (or replace) the control this field wraps. Pairs it with the label. */
    public void setControl(Node control) {
        this.control = control;
        if (control != null) {
            label.setLabelFor(control);
        }
        rebuild();
    }

    /** Helper / hint text below the control. Pass {@code null} or "" to hide it. */
    public void setDescription(String text) {
        description.setText(text == null ? "" : text);
        rebuild();
    }

    /** Validation error below the field. Pass {@code null} or "" to clear it. */
    public void setError(String message) {
        error.setText(message == null ? "" : message);
        rebuild();
    }

    public PrizmLabel labelNode() {
        return label;
    }

    private boolean shown(Label node) {
        return !node.getText().isEmpty();
    }

    /** Rebuild the stack in canonical order: label, control, description, error. */
    private void rebuild() {
        getChildren().clear();
        getChildren().add(label);
        if (control != null) {
            getChildren().add(control);
        }
        if (shown(description)) {
            getChildren().add(description);
        }
        if (shown(error)) {
            getChildren().add(error);
        }
    }
}
