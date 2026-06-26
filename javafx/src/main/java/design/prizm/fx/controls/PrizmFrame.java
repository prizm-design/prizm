package design.prizm.fx.controls;

import javafx.geometry.Insets;
import javafx.scene.layout.VBox;

/**
 * A PRIZM content frame — a max-width, padded container. Thin {@link VBox} with
 * padding and max-width presets. The web centres it with {@code mx-auto}; in
 * JavaFX, place it in a parent that centres (e.g. a StackPane, or an HBox with
 * spacers). Mirrors the React {@code Frame} ({@code components/ui/frame.tsx}).
 */
public class PrizmFrame extends VBox {

    public enum Padding {
        NONE(0),
        SM(16),
        MD(24),
        LG(32),
        XL(48);

        private final double px;

        Padding(double px) {
            this.px = px;
        }
    }

    public enum MaxWidth {
        SM(384),
        MD(672),
        LG(896),
        XL(1152),
        XXL(1280),
        FULL(Double.MAX_VALUE);

        private final double px;

        MaxWidth(double px) {
            this.px = px;
        }
    }

    public PrizmFrame() {
        getStyleClass().add("prizm-frame");
        setFramePadding(Padding.MD);
        setFrameMaxWidth(MaxWidth.XL);
    }

    public void setFramePadding(Padding padding) {
        setPadding(new Insets(padding.px));
    }

    public void setFrameMaxWidth(MaxWidth maxWidth) {
        setMaxWidth(maxWidth.px);
    }
}
