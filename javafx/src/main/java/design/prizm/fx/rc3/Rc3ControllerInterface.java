package design.prizm.fx.rc3;

import java.util.ArrayList;
import java.util.List;
import javafx.geometry.Pos;
import javafx.scene.control.Label;
import javafx.scene.layout.HBox;
import javafx.scene.layout.Pane;
import javafx.scene.layout.Region;
import javafx.scene.layout.StackPane;
import javafx.scene.layout.VBox;
import javafx.scene.shape.Circle;
import javafx.scene.shape.Line;

/**
 * RC3 — Controller interface (JavaFX).
 *
 * <p>Live operator input state — sticks, triggers, buttons. Read-only: the
 * consumer wires input from their gamepad / WebSocket / physical-controller
 * pipeline. Surfaces what the operator is doing right now — teleop confirmation,
 * deadzone debugging, binding reference. The platform marker carries the Ember
 * signature; operational controls stay neutral.
 *
 * <p>Honours invariant 5 by extension: when a stick or trigger goes unresponsive,
 * stop passing its value rather than holding the last position. Mirrors the React
 * {@code ControllerInterface} ({@code components/rc3/controller-interface.tsx}).
 */
public class Rc3ControllerInterface extends HBox {

    /** A stick axis pair. x: -1 (left) → 1 (right); y: -1 (down) → 1 (up). */
    public record StickState(double x, double y) {}

    /** A controller button. {@code binding} and {@code pressed} are optional. */
    public record ControllerButton(String id, String label, boolean pressed, String binding) {
        public ControllerButton(String id, String label) {
            this(id, label, false, null);
        }
    }

    private static final double WELL_SIZE = 56;
    private static final double WELL_RADIUS = WELL_SIZE / 2;
    private static final double DEAD_ZONE_RADIUS = 4;

    private String platform;
    private StickState leftStick;
    private String leftStickLabel = "STICK L";
    private StickState rightStick;
    private String rightStickLabel = "STICK R";
    private Double leftTrigger;
    private String leftTriggerLabel = "TRIG L";
    private Double rightTrigger;
    private String rightTriggerLabel = "TRIG R";
    private final List<ControllerButton> buttons = new ArrayList<>();

    public Rc3ControllerInterface() {
        getStyleClass().add("rc3-controller");
        setSpacing(16);
        setAlignment(Pos.BOTTOM_LEFT);
        // Keep each column/pill at its natural height, bottom-aligned (web items-end).
        // Without this, HBox's default fillHeight stretches the button pills to match
        // the taller stick columns.
        setFillHeight(false);
        rebuild();
    }

    public void setPlatform(String platform) {
        this.platform = platform;
        rebuild();
    }

    public void setLeftStick(StickState s, String label) {
        this.leftStick = s;
        if (label != null) {
            this.leftStickLabel = label;
        }
        rebuild();
    }

    public void setRightStick(StickState s, String label) {
        this.rightStick = s;
        if (label != null) {
            this.rightStickLabel = label;
        }
        rebuild();
    }

    public void setLeftTrigger(Double v, String label) {
        this.leftTrigger = v;
        if (label != null) {
            this.leftTriggerLabel = label;
        }
        rebuild();
    }

    public void setRightTrigger(Double v, String label) {
        this.rightTrigger = v;
        if (label != null) {
            this.rightTriggerLabel = label;
        }
        rebuild();
    }

    public void setButtons(List<ControllerButton> buttons) {
        this.buttons.clear();
        if (buttons != null) {
            this.buttons.addAll(buttons);
        }
        rebuild();
    }

    /**
     * Live-update the stick + trigger values in a single rebuild (labels and
     * buttons unchanged). For consumers streaming input at frame rate — cheaper
     * than four separate setters.
     */
    public void updateInputs(StickState leftStick, StickState rightStick, Double leftTrigger, Double rightTrigger) {
        this.leftStick = leftStick;
        this.rightStick = rightStick;
        this.leftTrigger = leftTrigger;
        this.rightTrigger = rightTrigger;
        rebuild();
    }

    private static double clamp(double v, double min, double max) {
        return Math.max(min, Math.min(max, v));
    }

    private static String fmtAxis(double v) {
        double rounded = Math.round(v * 100) / 100.0;
        if (Math.abs(rounded) < 0.005) {
            return "+0.00";
        }
        String sign = rounded >= 0 ? "+" : "-";
        return sign + String.format("%.2f", Math.abs(rounded));
    }

    private static String fmtTrigger(double v) {
        return String.format("%.2f", clamp(v, 0, 1));
    }

    private void rebuild() {
        getChildren().clear();
        boolean hasAny = platform != null || leftStick != null || rightStick != null
            || leftTrigger != null || rightTrigger != null || !buttons.isEmpty();
        if (!hasAny) {
            return;
        }
        setAccessibleText("Controller input" + (platform != null ? " for " + platform : ""));

        if (platform != null) {
            var marker = platformMarker();
            marker.setAlignment(Pos.CENTER_LEFT);
            getChildren().add(marker);
        }
        if (leftStick != null) {
            getChildren().add(stickWell(leftStick, leftStickLabel));
        }
        if (rightStick != null) {
            getChildren().add(stickWell(rightStick, rightStickLabel));
        }
        if (leftTrigger != null) {
            getChildren().add(triggerBar(leftTrigger, leftTriggerLabel));
        }
        if (rightTrigger != null) {
            getChildren().add(triggerBar(rightTrigger, rightTriggerLabel));
        }
        if (!buttons.isEmpty()) {
            var row = new HBox(6);
            row.setAlignment(Pos.BOTTOM_LEFT);
            for (var b : buttons) {
                row.getChildren().add(buttonPill(b));
            }
            getChildren().add(row);
        }
    }

    private HBox platformMarker() {
        var dot = new Region();
        dot.getStyleClass().add("rc3-video-source-dot");
        dot.setMinSize(6, 6);
        dot.setPrefSize(6, 6);
        dot.setMaxSize(6, 6);
        var box = new HBox(8, dot, mono(platform, "rc3-telem-platform"));
        box.setAlignment(Pos.CENTER_LEFT);
        return box;
    }

    private VBox stickWell(StickState stick, String label) {
        double x = clamp(stick.x(), -1, 1);
        double y = clamp(stick.y(), -1, 1);
        double dotX = WELL_RADIUS + x * (WELL_RADIUS - 6);
        double dotY = WELL_RADIUS - y * (WELL_RADIUS - 6);

        var pane = new Pane();
        pane.setMinSize(WELL_SIZE, WELL_SIZE);
        pane.setPrefSize(WELL_SIZE, WELL_SIZE);
        pane.setMaxSize(WELL_SIZE, WELL_SIZE);

        var outer = new Circle(WELL_RADIUS, WELL_RADIUS, WELL_RADIUS - 1);
        outer.getStyleClass().add("rc3-stick-well");

        var dead = new Circle(WELL_RADIUS, WELL_RADIUS, DEAD_ZONE_RADIUS);
        dead.getStyleClass().add("rc3-stick-dead");
        dead.getStrokeDashArray().addAll(2.0, 2.0);

        var line = new Line(WELL_RADIUS, WELL_RADIUS, dotX, dotY);
        line.getStyleClass().add("rc3-stick-line");
        line.setOpacity(0.6);

        var dot = new Circle(dotX, dotY, 3);
        dot.getStyleClass().add("rc3-stick-dot");

        pane.getChildren().addAll(outer, dead, line, dot);

        var col = new VBox(6, mono(label, "rc3-ctrl-caption"), pane,
            mono(fmtAxis(x) + " / " + fmtAxis(y), "rc3-ctrl-readout"));
        col.setAlignment(Pos.CENTER);
        col.setAccessibleText(label);
        return col;
    }

    private VBox triggerBar(double value, String label) {
        double v = clamp(value, 0, 1);

        var track = new StackPane();
        track.getStyleClass().add("rc3-trigger-track");
        track.setMinSize(10, WELL_SIZE);
        track.setPrefSize(10, WELL_SIZE);
        track.setMaxSize(10, WELL_SIZE);
        track.setAlignment(Pos.BOTTOM_CENTER);

        var fill = new Region();
        fill.getStyleClass().add("rc3-trigger-fill");
        double h = v * (WELL_SIZE - 2);
        fill.setMinHeight(h);
        fill.setPrefHeight(h);
        fill.setMaxHeight(h);
        fill.setMaxWidth(Double.MAX_VALUE);
        track.getChildren().add(fill);

        var col = new VBox(6, mono(label, "rc3-ctrl-caption"), track,
            mono(fmtTrigger(v), "rc3-ctrl-readout"));
        col.setAlignment(Pos.CENTER);
        col.setAccessibleText(label);
        return col;
    }

    private VBox buttonPill(ControllerButton b) {
        var pill = new VBox(2);
        pill.getStyleClass().add("rc3-ctrl-btn");
        if (b.pressed()) {
            pill.getStyleClass().add("rc3-ctrl-btn--pressed");
        }
        pill.setAlignment(Pos.CENTER);
        pill.setMinWidth(36);

        pill.getChildren().add(mono(b.label(), "rc3-ctrl-btn-label"));
        if (b.binding() != null) {
            pill.getChildren().add(mono(b.binding(), "rc3-ctrl-btn-binding"));
        }
        pill.setAccessibleText(b.label() + (b.binding() != null ? " — " + b.binding() : "")
            + ", " + (b.pressed() ? "pressed" : "released"));
        return pill;
    }

    private Label mono(String text, String... styleClasses) {
        var l = new Label(text);
        l.getStyleClass().add("rc3-mono");
        for (var c : styleClasses) {
            if (c != null) {
                l.getStyleClass().add(c);
            }
        }
        return l;
    }
}
