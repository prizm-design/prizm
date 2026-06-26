package design.prizm.fx.controls;

import javafx.scene.control.Label;

/**
 * A PRIZM inline code token. Thin subclass of {@link Label} — monospace, on a
 * muted bordered chip — styled by the {@code .prizm-code} rules in
 * {@code prizm.css}. For a multi-line code block, put monospace text in a styled
 * region; this is the inline form. Mirrors the React {@code Code}
 * ({@code components/ui/code.tsx}).
 */
public class PrizmCode extends Label {

    public PrizmCode() {
        init();
    }

    public PrizmCode(String text) {
        super(text);
        init();
    }

    private void init() {
        getStyleClass().add("prizm-code");
    }
}
