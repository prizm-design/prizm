package design.prizm.fx.controls;

import javafx.scene.control.TextField;

/**
 * A PRIZM-styled single-line text input. Thin subclass of {@link TextField};
 * styling comes from the {@code .text-field} rules in {@code prizm.css}.
 * Mirrors the React {@code Input} ({@code components/ui/input.tsx}).
 */
public class PrizmInput extends TextField {

    public PrizmInput() {
        super();
    }

    public PrizmInput(String text) {
        super(text);
    }

    public PrizmInput(String text, String promptText) {
        super(text);
        setPromptText(promptText);
    }
}
