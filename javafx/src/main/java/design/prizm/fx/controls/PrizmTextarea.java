package design.prizm.fx.controls;

import javafx.scene.control.TextArea;

/**
 * A PRIZM-styled multi-line text input. Thin subclass of {@link TextArea};
 * styling comes from the {@code .text-area} rules in {@code prizm.css}.
 * Mirrors the React {@code Textarea} ({@code components/ui/textarea.tsx}).
 */
public class PrizmTextarea extends TextArea {

    public PrizmTextarea() {
        super();
    }

    public PrizmTextarea(String text) {
        super(text);
    }

    public PrizmTextarea(String text, String promptText) {
        super(text);
        setPromptText(promptText);
    }
}
