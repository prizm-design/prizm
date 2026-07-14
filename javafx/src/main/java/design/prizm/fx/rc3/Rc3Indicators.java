package design.prizm.fx.rc3;

import javafx.geometry.Pos;
import javafx.scene.control.Label;
import javafx.scene.layout.HBox;
import javafx.scene.layout.Region;
import javafx.scene.layout.StackPane;

/**
 * RC3 — Indicator alphabet (JavaFX).
 *
 * <p>Small, glanceable visual primitives for organism row values — designed to
 * read as instruments, not HUD ornament. Pass them into a row's value slot, e.g.
 * {@link Rc3PlatformDetail.Extra}'s value. Pack-internal helpers with no
 * PRIZM-wide footprint. Mirrors {@code components/rc3/indicators.tsx}.
 */
public final class Rc3Indicators {

    private Rc3Indicators() {}

    /** Fill / text tone for pips, bars, and state text. */
    public enum Tone {
        SUCCESS("success"),
        WARNING("warning"),
        DANGER("danger"),
        MUTED("muted");

        final String css;

        Tone(String css) {
            this.css = css;
        }
    }

    /** Three-state operational status for {@link #stateDot}. */
    public enum DotState {
        ACTIVE("active"),
        STANDBY("standby"),
        OFF("off");

        final String css;

        DotState(String css) {
            this.css = css;
        }
    }

    /**
     * Discrete inventory — munition, cartridges, smoke, relay drops. {@code total}
     * should stay small (≤ 8); large totals belong in plain text.
     */
    public static HBox pipCount(int filled, int total, String suffix, Tone tone) {
        int f = Math.max(0, Math.min(total, filled));
        var pips = new HBox(3);
        pips.setAlignment(Pos.CENTER_LEFT);
        for (int i = 0; i < total; i++) {
            var p = new Region();
            p.getStyleClass().addAll("rc3-pip", i < f ? "rc3-pip--" + tone.css : "rc3-pip--empty");
            p.setMinSize(6, 6);
            p.setPrefSize(6, 6);
            p.setMaxSize(6, 6);
            pips.getChildren().add(p);
        }
        var box = new HBox(6, pips, mono(f + "/" + total, "rc3-detail-value", "rc3-tone-fg"));
        box.setAlignment(Pos.CENTER_LEFT);
        if (suffix != null) {
            box.getChildren().add(mono(suffix, "rc3-detail-value", "rc3-tone-muted"));
        }
        return box;
    }

    /** Continuous percentage — fuel, relay buffer, mission progress. */
    public static HBox capacityBar(double pct, Tone tone, String suffix) {
        double clamped = Math.max(0, Math.min(100, pct));
        var track = new StackPane();
        track.getStyleClass().add("rc3-capacity-track");
        track.setAlignment(Pos.CENTER_LEFT);
        track.setMinSize(40, 6);
        track.setPrefSize(40, 6);
        track.setMaxSize(40, 6);
        var fill = new Region();
        fill.getStyleClass().add("rc3-capacity-fill--" + tone.css);
        double w = (clamped / 100.0) * 38;
        fill.setMinWidth(w);
        fill.setPrefWidth(w);
        fill.setMaxWidth(w);
        fill.setMaxHeight(Double.MAX_VALUE);
        track.getChildren().add(fill);
        String text = suffix != null ? suffix : Math.round(clamped) + "%";
        var box = new HBox(6, track, mono(text, "rc3-detail-value", "rc3-tone-fg"));
        box.setAlignment(Pos.CENTER_LEFT);
        return box;
    }

    /** Three-state status with a coloured dot + label. */
    public static HBox stateDot(DotState state, String text) {
        var dot = new Region();
        dot.getStyleClass().addAll("rc3-statedot", "rc3-statedot--" + state.css);
        dot.setMinSize(6, 6);
        dot.setPrefSize(6, 6);
        dot.setMaxSize(6, 6);
        var lbl = mono(text, "rc3-detail-value", state == DotState.OFF ? "rc3-tone-muted" : "rc3-tone-fg");
        var box = new HBox(6, dot, lbl);
        box.setAlignment(Pos.CENTER_LEFT);
        return box;
    }

    /** Semantic-coloured mono text for binary safety-critical state (ARMED / SAFE). */
    public static Label stateText(Tone tone, String text) {
        return mono(text, "rc3-statetext", "rc3-tone-" + tone.css);
    }

    private static Label mono(String text, String... styleClasses) {
        var l = new Label(text);
        l.getStyleClass().add("rc3-mono");
        for (var c : styleClasses) {
            l.getStyleClass().add(c);
        }
        return l;
    }
}
