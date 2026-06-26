package design.prizm.fx.controls;

import javafx.scene.control.Label;
import javafx.scene.image.Image;
import javafx.scene.image.ImageView;
import javafx.scene.layout.StackPane;
import javafx.scene.shape.Circle;

/**
 * A PRIZM avatar — a circular image with an initials fallback. No stock JavaFX
 * control maps to this, so it's a composite over {@link StackPane} (like
 * {@link PrizmCard}): a muted circular background with a fallback {@link Label}
 * and an optional clipped {@link ImageView} on top. Styled by the
 * {@code .prizm-avatar} rules in {@code prizm.css}. Mirrors {@code Avatar} +
 * {@code AvatarImage} + {@code AvatarFallback} in {@code components/ui/avatar.tsx}.
 */
public class PrizmAvatar extends StackPane {

    /** Diameter / fallback font-size presets, mirroring the web sizes (px). */
    public enum Size {
        SM(24, 10),
        MD(32, 12),
        LG(40, 14),
        XL(56, 16);

        private final double px;
        private final double font;

        Size(double px, double font) {
            this.px = px;
            this.font = font;
        }

        public double px() {
            return px;
        }

        public double font() {
            return font;
        }
    }

    private final Label fallback = new Label();
    private final ImageView image = new ImageView();
    private Size size = Size.MD;

    public PrizmAvatar() {
        this(Size.MD);
    }

    public PrizmAvatar(Size size) {
        getStyleClass().add("prizm-avatar");
        fallback.getStyleClass().add("prizm-avatar__fallback");
        image.setPreserveRatio(true);
        image.setVisible(false);
        getChildren().addAll(fallback, image);
        setSize(size);
    }

    public PrizmAvatar(String initials, Size size) {
        this(size);
        setInitials(initials);
    }

    public void setSize(Size size) {
        this.size = size;
        double d = size.px();
        setMinSize(d, d);
        setPrefSize(d, d);
        setMaxSize(d, d);
        image.setFitWidth(d);
        image.setFitHeight(d);
        image.setClip(new Circle(d / 2, d / 2, d / 2));
        getStyleClass().removeAll(
            "prizm-avatar--sm", "prizm-avatar--md", "prizm-avatar--lg", "prizm-avatar--xl");
        getStyleClass().add("prizm-avatar--" + size.name().toLowerCase());
    }

    public void setInitials(String initials) {
        fallback.setText(initials == null ? "" : initials);
    }

    /** Set (or clear, with {@code null}) the avatar image, shown over the fallback. */
    public void setImage(Image img) {
        image.setImage(img);
        image.setVisible(img != null);
    }

    public Size getAvatarSize() {
        return size;
    }
}
