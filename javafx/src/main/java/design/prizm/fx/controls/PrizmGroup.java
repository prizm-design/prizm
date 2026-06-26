package design.prizm.fx.controls;

import javafx.geometry.Pos;
import javafx.scene.Node;
import javafx.scene.layout.HBox;

/**
 * A horizontal grouping of related controls — children laid out left-to-right
 * with a gap from the PRIZM spacing scale, vertically centred. Thin subclass of
 * {@link HBox}; the only additions are a PRIZM default gap and the
 * {@link PrizmGap} convenience. Mirrors the React {@code Group}
 * ({@code components/ui/group.tsx}).
 *
 * <p>Defaults match the web: gap {@code XS} (8px) and centre alignment. For
 * other alignment / justification use the inherited {@link #setAlignment(Pos)}.
 * (The web {@code wrap} option has no HBox equivalent — use a FlowPane if you
 * need wrapping.)
 */
public class PrizmGroup extends HBox {

    public PrizmGroup() {
        this(PrizmGap.XS);
    }

    public PrizmGroup(PrizmGap gap) {
        super(gap.px());
        getStyleClass().add("prizm-group");
        setAlignment(Pos.CENTER_LEFT);
    }

    public PrizmGroup(PrizmGap gap, Node... children) {
        this(gap);
        getChildren().addAll(children);
    }

    /** Set the gap between children from the PRIZM spacing scale. */
    public void setGap(PrizmGap gap) {
        setSpacing(gap.px());
    }
}
