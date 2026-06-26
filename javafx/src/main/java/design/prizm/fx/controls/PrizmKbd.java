package design.prizm.fx.controls;

import javafx.scene.control.Label;

/**
 * A PRIZM keyboard key indicator. Thin subclass of {@link Label} — monospace, on
 * a muted key-cap chip — styled by the {@code .prizm-kbd} rules in
 * {@code prizm.css}. Mirrors the React {@code Kbd} ({@code components/ui/kbd.tsx}).
 */
public class PrizmKbd extends Label {

    public PrizmKbd() {
        init();
    }

    public PrizmKbd(String text) {
        super(text);
        init();
    }

    private void init() {
        getStyleClass().add("prizm-kbd");
    }
}
