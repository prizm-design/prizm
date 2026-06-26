package design.prizm.fx.controls;

import javafx.scene.control.Hyperlink;

/**
 * A PRIZM hyperlink. Thin subclass of {@link Hyperlink}, restyled to accent text
 * with underline-on-hover and no focus border, via the {@code .prizm-link} rules
 * in {@code prizm.css}. Wire navigation with {@code setOnAction(...)}. Mirrors
 * the React {@code Link} ({@code components/ui/link.tsx}).
 */
public class PrizmLink extends Hyperlink {

    public PrizmLink() {
        init();
    }

    public PrizmLink(String text) {
        super(text);
        init();
    }

    private void init() {
        getStyleClass().add("prizm-link");
    }
}
