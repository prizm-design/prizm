package design.prizm.fx.controls;

import javafx.scene.Node;
import javafx.scene.layout.VBox;

/**
 * A PRIZM prose container for long-form text. The web {@code Prose} styles
 * descendant HTML (headings, paragraphs, lists); JavaFX has no HTML, so this is
 * a thin {@link VBox} that stacks {@link PrizmHeading} / {@link PrizmText} (and
 * other nodes) with comfortable paragraph spacing and a reading-width cap.
 * Styled by the {@code .prizm-prose} rules in {@code prizm.css}. Mirrors the
 * React {@code Prose} ({@code components/ui/prose.tsx}).
 */
public class PrizmProse extends VBox {

    public PrizmProse() {
        getStyleClass().add("prizm-prose");
        setSpacing(16);
        setMaxWidth(680);
    }

    public PrizmProse(Node... children) {
        this();
        getChildren().addAll(children);
    }
}
