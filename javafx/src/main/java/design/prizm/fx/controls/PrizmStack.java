package design.prizm.fx.controls;

import javafx.geometry.Pos;
import javafx.scene.Node;
import javafx.scene.layout.VBox;

/**
 * A vertical spacing primitive — children stacked top-to-bottom with a gap from
 * the PRIZM spacing scale. Thin subclass of {@link VBox} (the JavaFX vertical
 * box); the only additions are a PRIZM default gap and the {@link PrizmGap}
 * convenience. Mirrors the React {@code Stack} ({@code components/ui/stack.tsx}).
 *
 * <p>Defaults match the web: gap {@code MD} (16px) and stretch alignment
 * ({@code setFillWidth(true)}). For other alignments use the inherited
 * {@link #setAlignment(Pos)} / {@link #setFillWidth(boolean)}.
 */
public class PrizmStack extends VBox {

    public PrizmStack() {
        this(PrizmGap.MD);
    }

    public PrizmStack(PrizmGap gap) {
        super(gap.px());
        getStyleClass().add("prizm-stack");
        setFillWidth(true);
        setAlignment(Pos.TOP_LEFT);
    }

    public PrizmStack(PrizmGap gap, Node... children) {
        this(gap);
        getChildren().addAll(children);
    }

    /** Set the gap between children from the PRIZM spacing scale. */
    public void setGap(PrizmGap gap) {
        setSpacing(gap.px());
    }
}
