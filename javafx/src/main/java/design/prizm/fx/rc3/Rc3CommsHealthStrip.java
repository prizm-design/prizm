package design.prizm.fx.rc3;

import java.util.ArrayList;
import java.util.List;
import javafx.geometry.Pos;
import javafx.scene.AccessibleRole;
import javafx.scene.control.Label;
import javafx.scene.layout.HBox;
import javafx.scene.layout.Region;

/**
 * RC3 — Comms / health strip (JavaFX).
 *
 * <p>Honours behavioural invariant 2: comms / health are visible whenever a live
 * platform is connected. A persistent, compact strip. At {@code PLATFORM} scope
 * it shows a single rich row (signal bars, id, link state, battery, GPS); at
 * group / swarm / mission scope it shows an aggregated summary with optional
 * per-platform pips.
 *
 * <p>Status uses the semantic success / warning / danger tokens — Ember is not
 * used here, comms is status not identity. Mirrors the React
 * {@code CommsHealthStrip} ({@code components/rc3/comms-health-strip.tsx}).
 */
public class Rc3CommsHealthStrip extends HBox {

    public enum Scope {
        PLATFORM,
        GROUP,
        SWARM,
        MISSION
    }

    public enum LinkStatus {
        GOOD,
        DEGRADED,
        LOST
    }

    /** A single platform's link state. {@code battery} may be null (unknown). */
    public record PlatformLink(
        String id, int signal, Integer battery, boolean gpsLock, LinkStatus status) {}

    private Scope scope = Scope.PLATFORM;
    private PlatformLink platform;
    private final List<PlatformLink> platforms = new ArrayList<>();

    public Rc3CommsHealthStrip() {
        setSpacing(16);
        setAlignment(Pos.CENTER_LEFT);
        setAccessibleRole(AccessibleRole.NODE);
        getStyleClass().add("rc3-comms-strip");
        rebuild();
    }

    public void setScope(Scope scope) {
        this.scope = scope == null ? Scope.PLATFORM : scope;
        rebuild();
    }

    public void setPlatform(PlatformLink platform) {
        this.platform = platform;
        rebuild();
    }

    public void setPlatforms(List<PlatformLink> platforms) {
        this.platforms.clear();
        if (platforms != null) {
            this.platforms.addAll(platforms);
        }
        rebuild();
    }

    private void rebuild() {
        getChildren().clear();
        getStyleClass().removeAll("rc3-comms-strip--empty");
        if (scope == Scope.PLATFORM) {
            buildPlatformView();
        } else {
            buildAggregatedView();
        }
    }

    private void buildPlatformView() {
        if (platform == null) {
            getStyleClass().add("rc3-comms-strip--empty");
            var empty = mono("No platform connected", "rc3-comms-empty");
            setAccessibleText("No platform connected");
            getChildren().add(empty);
            return;
        }

        var linkLabel = linkLabel(platform.status());
        setAccessibleText("Comms for " + platform.id() + ": " + linkLabel);

        getChildren().add(signalBars(platform.signal(), platform.status()));
        getChildren().add(mono(platform.id(), "rc3-comms-id"));
        getChildren().add(divider());
        getChildren().add(mono(linkLabel, "rc3-comms-link", toneClass(platform.status())));

        if (platform.battery() != null) {
            getChildren().add(divider());
            getChildren().add(labelled("BATT", platform.battery() + "%"));
        }
        if (platform.gpsLock()) {
            getChildren().add(divider());
            getChildren().add(mono("GPS LOCK", "rc3-comms-id"));
        }
    }

    private void buildAggregatedView() {
        int total = platforms.size();
        long good = platforms.stream().filter(p -> p.status() == LinkStatus.GOOD).count();
        long degraded = platforms.stream().filter(p -> p.status() == LinkStatus.DEGRADED).count();
        long lost = platforms.stream().filter(p -> p.status() == LinkStatus.LOST).count();
        long linked = good + degraded;
        int percentGood = total > 0 ? Math.round((good * 100f) / total) : 0;

        setAccessibleText(
            "Comms summary: " + linked + " of " + total + " linked, " + percentGood + " percent healthy");

        var linkBox = new HBox(mono(linked + "", "rc3-comms-id"), mono("/" + total, "rc3-comms-meta"),
            mono(" LINK", "rc3-comms-id"));
        linkBox.setAlignment(Pos.CENTER_LEFT);
        getChildren().add(linkBox);

        getChildren().add(divider());
        var okPct = mono(percentGood + "%", "rc3-comms-id",
            percentGood == 100 ? "rc3-tone-success" : null);
        var okBox = new HBox(4, okPct, mono("OK", "rc3-comms-meta"));
        okBox.setAlignment(Pos.CENTER_LEFT);
        getChildren().add(okBox);

        if (degraded > 0) {
            getChildren().add(divider());
            getChildren().add(mono(degraded + " DEGRADED", "rc3-comms-link", "rc3-tone-warning"));
        }
        if (lost > 0) {
            getChildren().add(divider());
            getChildren().add(mono(lost + " LOST", "rc3-comms-link", "rc3-tone-danger"));
        }

        boolean showPips = (scope == Scope.GROUP || scope == Scope.SWARM) && total <= 12;
        if (showPips) {
            getChildren().add(divider());
            var pips = new HBox(4);
            pips.setAlignment(Pos.CENTER_LEFT);
            for (var p : platforms) {
                var dot = new Region();
                dot.getStyleClass().addAll("rc3-comms-pip", toneClass(p.status()));
                dot.setMinSize(6, 6);
                dot.setPrefSize(6, 6);
                dot.setMaxSize(6, 6);
                pips.getChildren().add(dot);
            }
            getChildren().add(pips);
        }
    }

    private static String linkLabel(LinkStatus status) {
        return switch (status) {
            case GOOD -> "LINK";
            case DEGRADED -> "DEGRADED";
            case LOST -> "LOST";
        };
    }

    private static String toneClass(LinkStatus status) {
        return switch (status) {
            case GOOD -> "rc3-tone-success";
            case DEGRADED -> "rc3-tone-warning";
            case LOST -> "rc3-tone-danger";
        };
    }

    private HBox signalBars(int filled, LinkStatus status) {
        var bars = new HBox(2);
        bars.setAlignment(Pos.BOTTOM_LEFT);
        int[] heights = {4, 7, 10, 13};
        for (int i = 0; i < heights.length; i++) {
            var bar = new Region();
            bar.getStyleClass().add("rc3-signal-bar");
            if (i < filled) {
                bar.getStyleClass().add(toneClass(status));
            } else {
                bar.getStyleClass().add("rc3-signal-bar--off");
            }
            bar.setMinWidth(4);
            bar.setPrefWidth(4);
            bar.setMaxWidth(4);
            bar.setMinHeight(heights[i]);
            bar.setPrefHeight(heights[i]);
            bar.setMaxHeight(heights[i]);
            bars.getChildren().add(bar);
        }
        return bars;
    }

    private HBox labelled(String label, String value) {
        var box = new HBox(4, mono(label, "rc3-comms-meta"), mono(value, "rc3-comms-id"));
        box.setAlignment(Pos.CENTER_LEFT);
        return box;
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

    private Region divider() {
        var d = new Region();
        d.getStyleClass().add("rc3-comms-divider");
        d.setMinSize(1, 12);
        d.setPrefSize(1, 12);
        d.setMaxSize(1, 12);
        return d;
    }
}
