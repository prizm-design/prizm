package design.prizm.fx.controls;

import javafx.geometry.Bounds;
import javafx.scene.Node;
import javafx.scene.control.PopupControl;
import javafx.scene.control.Skin;
import javafx.scene.layout.StackPane;

/**
 * A PRIZM popover — a floating contextual panel anchored to a trigger. Built on
 * {@link PopupControl} (so its content inherits the owner scene's PRIZM theme,
 * like Tooltip / ContextMenu), styled by the {@code .prizm-popover} rules in
 * {@code prizm.css} (surface-elevated card, hairline border, soft shadow).
 *
 * <p>Auto-hides on focus loss and auto-fixes to stay on screen. Compose the body
 * yourself (e.g. a {@code VBox} of labels) and pass it to {@link #setContent}.
 * The web {@code glass} variant is not ported (glass is web-only). Mirrors the
 * React {@code Popover} ({@code components/ui/popover.tsx}).
 */
public class PrizmPopover extends PopupControl {

    private static final double OFFSET = 8;

    private final StackPane container = new StackPane();

    public PrizmPopover() {
        container.getStyleClass().add("prizm-popover");
        setAutoHide(true);
        setAutoFix(true);
        setConsumeAutoHidingEvents(false);
        setSkin(new Skin<>() {
            @Override
            public PrizmPopover getSkinnable() {
                return PrizmPopover.this;
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

    public PrizmPopover(Node content) {
        this();
        setContent(content);
    }

    public void setContent(Node content) {
        container.getChildren().setAll(content);
    }

    /** Show anchored below the owner, left edges aligned. Auto-fix flips it if off-screen. */
    public void show(Node owner) {
        Bounds b = owner.localToScreen(owner.getBoundsInLocal());
        if (b == null) {
            return;
        }
        show(owner, b.getMinX(), b.getMaxY() + OFFSET);
    }
}
