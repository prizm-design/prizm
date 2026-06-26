package design.prizm.fx.controls;

import javafx.geometry.Bounds;
import javafx.scene.Node;
import javafx.scene.control.PopupControl;
import javafx.scene.control.Skin;
import javafx.scene.layout.StackPane;

/**
 * A PRIZM hover card — a rich floating preview shown while hovering a trigger.
 * Built on {@link PopupControl} (content inherits the owner scene's theme, like
 * Popover / Tooltip); reuses the {@code .prizm-popover} surface styling. Use
 * {@link #attach(Node)} to show it on mouse-enter and hide on exit. Mirrors the
 * React {@code HoverCard} ({@code components/ui/hover-card.tsx}).
 */
public class PrizmHoverCard extends PopupControl {

    private static final double OFFSET = 8;

    private final StackPane container = new StackPane();

    public PrizmHoverCard() {
        container.getStyleClass().add("prizm-popover");
        setAutoHide(true);
        setSkin(new Skin<>() {
            @Override
            public PrizmHoverCard getSkinnable() {
                return PrizmHoverCard.this;
            }

            @Override
            public Node getNode() {
                return container;
            }

            @Override
            public void dispose() {
                // no-op
            }
        });
    }

    public PrizmHoverCard(Node content) {
        this();
        setContent(content);
    }

    public void setContent(Node content) {
        container.getChildren().setAll(content);
    }

    /** Show on hover of {@code owner}, hide on exit. */
    public void attach(Node owner) {
        owner.setOnMouseEntered(e -> {
            Bounds b = owner.localToScreen(owner.getBoundsInLocal());
            if (b != null && !isShowing()) {
                show(owner, b.getMinX(), b.getMaxY() + OFFSET);
            }
        });
        owner.setOnMouseExited(e -> hide());
    }
}
