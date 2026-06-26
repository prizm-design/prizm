package design.prizm.fx.controls;

import javafx.animation.FadeTransition;
import javafx.animation.TranslateTransition;
import javafx.geometry.Pos;
import javafx.geometry.Side;
import javafx.scene.Node;
import javafx.scene.layout.Region;
import javafx.scene.layout.StackPane;
import javafx.util.Duration;

/**
 * A PRIZM sheet — an edge-anchored sliding panel that opens from any side. No
 * stock JavaFX control maps to this, so it's a controller that overlays a host
 * {@link StackPane}: a scrim plus a {@link #getPanel() panel} that slides in
 * from the chosen {@link Side}. Styled by the {@code .prizm-sheet} /
 * {@code .prizm-sheet-scrim} rules in {@code prizm.css}.
 *
 * <p>Call {@link #show(StackPane)} with a full-size host (e.g. your scene root
 * wrapped in a StackPane) — the sheet adds itself on top, slides in, and clicking
 * the scrim (or {@link #hide()}) slides it out and removes it. Compose the body
 * yourself and pass it to {@link #setContent}. Mirrors the React {@code Sheet}
 * ({@code components/ui/sheet.tsx}).
 */
public class PrizmSheet {

    private static final Duration DURATION = Duration.millis(200);

    private final Side side;
    private final StackPane panel = new StackPane();
    private final Region scrim = new Region();
    private StackPane host;
    private double size;

    public PrizmSheet(Side side) {
        this.side = side;
        this.size = (side == Side.LEFT || side == Side.RIGHT) ? 360 : 280;
        panel.getStyleClass().addAll("prizm-sheet", "prizm-sheet--" + side.name().toLowerCase());
        scrim.getStyleClass().add("prizm-sheet-scrim");
        scrim.setOnMouseClicked(e -> hide());
        configurePanel();
    }

    public PrizmSheet(Side side, Node content) {
        this(side);
        setContent(content);
    }

    public void setContent(Node content) {
        panel.getChildren().setAll(content);
    }

    /** Panel width (LEFT / RIGHT) or height (TOP / BOTTOM), in px. */
    public void setSize(double px) {
        this.size = px;
        configurePanel();
    }

    public StackPane getPanel() {
        return panel;
    }

    public boolean isShowing() {
        return host != null;
    }

    private void configurePanel() {
        if (side == Side.LEFT || side == Side.RIGHT) {
            panel.setMinWidth(size);
            panel.setPrefWidth(size);
            panel.setMaxWidth(size);
            panel.setMaxHeight(Double.MAX_VALUE);
            StackPane.setAlignment(panel, side == Side.LEFT ? Pos.CENTER_LEFT : Pos.CENTER_RIGHT);
        } else {
            panel.setMinHeight(size);
            panel.setPrefHeight(size);
            panel.setMaxHeight(size);
            panel.setMaxWidth(Double.MAX_VALUE);
            StackPane.setAlignment(panel, side == Side.TOP ? Pos.TOP_CENTER : Pos.BOTTOM_CENTER);
        }
    }

    private double offset() {
        return switch (side) {
            case LEFT, TOP -> -size;
            case RIGHT, BOTTOM -> size;
        };
    }

    private boolean horizontal() {
        return side == Side.LEFT || side == Side.RIGHT;
    }

    /** Overlay the sheet on the host (a full-size StackPane) and slide it in. */
    public void show(StackPane host) {
        if (this.host != null) {
            return;
        }
        this.host = host;
        host.getChildren().addAll(scrim, panel);

        scrim.setOpacity(0);
        var fade = new FadeTransition(DURATION, scrim);
        fade.setFromValue(0);
        fade.setToValue(1);

        var slide = new TranslateTransition(DURATION, panel);
        if (horizontal()) {
            panel.setTranslateX(offset());
            slide.setToX(0);
        } else {
            panel.setTranslateY(offset());
            slide.setToY(0);
        }
        fade.play();
        slide.play();
    }

    /** Slide the sheet out and remove it from the host. */
    public void hide() {
        if (host == null) {
            return;
        }
        var current = host;
        host = null;

        var fade = new FadeTransition(DURATION, scrim);
        fade.setFromValue(1);
        fade.setToValue(0);

        var slide = new TranslateTransition(DURATION, panel);
        if (horizontal()) {
            slide.setToX(offset());
        } else {
            slide.setToY(offset());
        }
        slide.setOnFinished(e -> current.getChildren().removeAll(scrim, panel));
        fade.play();
        slide.play();
    }
}
