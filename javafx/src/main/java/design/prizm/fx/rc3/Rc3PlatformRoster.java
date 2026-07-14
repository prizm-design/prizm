package design.prizm.fx.rc3;

import java.util.ArrayList;
import java.util.List;
import java.util.function.Consumer;
import javafx.geometry.Pos;
import javafx.scene.control.Label;
import javafx.scene.control.ScrollPane;
import javafx.scene.layout.HBox;
import javafx.scene.layout.Priority;
import javafx.scene.layout.Region;
import javafx.scene.layout.VBox;

/**
 * RC3 — Platform roster (JavaFX).
 *
 * <p>A vertical list of platforms with quick-glance link / autonomy / battery
 * state per row. The active platform is marked with Ember (left-edge bar +
 * leading dot). Rows are selectable when an {@code onSelect} handler is set;
 * otherwise the roster reads status-only.
 *
 * <p>Honours invariant 3 (active context unambiguous). Set {@link #setFillHeight}
 * to make the root take its parent's height with the list scrolling inside a
 * pinned frame. Mirrors the React {@code PlatformRoster}
 * ({@code components/rc3/platform-roster.tsx}).
 */
public class Rc3PlatformRoster extends VBox {

    public enum LinkStatus {
        GOOD,
        DEGRADED,
        LOST
    }

    /** A roster row. {@code signal}, {@code battery}, {@code autonomy}, {@code klass} are optional. */
    public record RosterEntry(
        String id, LinkStatus link, Integer signal, Integer battery, String autonomy, String klass) {
        public RosterEntry(String id, LinkStatus link) {
            this(id, link, null, null, null, null);
        }
    }

    private final List<RosterEntry> platforms = new ArrayList<>();
    private String activeId;
    private Consumer<String> onSelect;
    private String label;
    private boolean fillHeight = false;

    public Rc3PlatformRoster() {
        getStyleClass().add("rc3-roster");
        setMaxWidth(384);
        rebuild();
    }

    public void setPlatforms(List<RosterEntry> platforms) {
        this.platforms.clear();
        if (platforms != null) {
            this.platforms.addAll(platforms);
        }
        rebuild();
    }

    public void setActiveId(String activeId) {
        this.activeId = activeId;
        rebuild();
    }

    public void setOnSelect(Consumer<String> onSelect) {
        this.onSelect = onSelect;
        rebuild();
    }

    public void setLabel(String label) {
        this.label = label;
        rebuild();
    }

    public void setFillHeight(boolean fillHeight) {
        this.fillHeight = fillHeight;
        rebuild();
    }

    private static String chargeTone(int pct) {
        if (pct < 20) {
            return "rc3-tone-danger";
        }
        if (pct <= 50) {
            return "rc3-tone-warning";
        }
        return "rc3-tone-success";
    }

    private static int defaultSignal(LinkStatus link) {
        return switch (link) {
            case GOOD -> 4;
            case DEGRADED -> 2;
            case LOST -> 0;
        };
    }

    private static String linkLabel(LinkStatus link) {
        return switch (link) {
            case GOOD -> "LINK";
            case DEGRADED -> "DEGRADED";
            case LOST -> "LOST";
        };
    }

    private static String toneClass(LinkStatus link) {
        return switch (link) {
            case GOOD -> "rc3-tone-success";
            case DEGRADED -> "rc3-tone-warning";
            case LOST -> "rc3-tone-danger";
        };
    }

    private void rebuild() {
        getChildren().clear();
        getStyleClass().remove("rc3-roster--fill");
        setAccessibleText(label != null ? label : "Platform roster");
        if (platforms.isEmpty()) {
            return;
        }
        if (fillHeight) {
            getStyleClass().add("rc3-roster--fill");
        }

        if (label != null) {
            var header = new HBox(mono(label, "rc3-roster-label"));
            header.getStyleClass().add("rc3-roster-header");
            getChildren().add(header);
        }

        var list = new VBox();
        list.getStyleClass().add("rc3-roster-list");
        for (int i = 0; i < platforms.size(); i++) {
            list.getChildren().add(row(platforms.get(i), i > 0));
        }

        if (fillHeight) {
            var scroll = new ScrollPane(list);
            scroll.getStyleClass().add("scroll-pane");
            scroll.setFitToWidth(true);
            scroll.setHbarPolicy(ScrollPane.ScrollBarPolicy.NEVER);
            VBox.setVgrow(scroll, Priority.ALWAYS);
            getChildren().add(scroll);
        } else {
            getChildren().add(list);
        }
    }

    private Region row(RosterEntry entry, boolean divided) {
        boolean active = entry.id().equals(activeId);
        int signal = entry.signal() != null ? entry.signal() : defaultSignal(entry.link());

        var emberBar = new Region();
        emberBar.getStyleClass().add(active ? "rc3-roster-bar--active" : "rc3-roster-bar");
        emberBar.setMinWidth(2);
        emberBar.setPrefWidth(2);
        emberBar.setMaxWidth(2);
        emberBar.setMaxHeight(Double.MAX_VALUE);

        var dot = new Region();
        dot.getStyleClass().add(active ? "rc3-roster-dot--active" : "rc3-roster-dot");
        dot.setMinSize(6, 6);
        dot.setPrefSize(6, 6);
        dot.setMaxSize(6, 6);

        var content = new HBox(12);
        content.getStyleClass().add("rc3-roster-content");
        content.setAlignment(Pos.CENTER_LEFT);
        HBox.setHgrow(content, Priority.ALWAYS);

        content.getChildren().addAll(dot, signalBars(signal, entry.link()), mono(entry.id(), "rc3-roster-id"));
        if (entry.klass() != null) {
            content.getChildren().add(mono(entry.klass(), "rc3-roster-class"));
        }

        var trailing = new HBox(12);
        trailing.setAlignment(Pos.CENTER_RIGHT);
        HBox.setHgrow(trailing, Priority.ALWAYS);
        if (entry.autonomy() != null) {
            trailing.getChildren().add(mono(entry.autonomy(), "rc3-roster-autonomy"));
        }
        if (entry.battery() != null) {
            trailing.getChildren().add(mono(Math.round(entry.battery()) + "%", "rc3-roster-batt", chargeTone(entry.battery())));
        }
        trailing.getChildren().add(mono(linkLabel(entry.link()), "rc3-roster-link", toneClass(entry.link())));
        content.getChildren().add(trailing);

        var rowBox = new HBox(emberBar, content);
        rowBox.getStyleClass().add("rc3-roster-row");
        if (active) {
            rowBox.getStyleClass().add("rc3-roster-row--active");
        }
        if (divided) {
            rowBox.getStyleClass().add("rc3-roster-row--divided");
        }
        rowBox.setAccessibleText(entry.id() + " " + linkLabel(entry.link()) + (active ? ", active" : ""));

        if (onSelect != null) {
            rowBox.getStyleClass().add("rc3-roster-row--interactive");
            rowBox.setOnMouseClicked(e -> onSelect.accept(entry.id()));
        }
        return rowBox;
    }

    private HBox signalBars(int filled, LinkStatus status) {
        var bars = new HBox(2);
        bars.setAlignment(Pos.BOTTOM_LEFT);
        int[] heights = {4, 7, 10, 13};
        for (int i = 0; i < heights.length; i++) {
            var bar = new Region();
            bar.getStyleClass().add("rc3-signal-bar");
            bar.getStyleClass().add(i < filled ? toneClass(status) : "rc3-signal-bar--off");
            bar.setMinWidth(2);
            bar.setPrefWidth(2);
            bar.setMaxWidth(2);
            bar.setMinHeight(heights[i]);
            bar.setPrefHeight(heights[i]);
            bar.setMaxHeight(heights[i]);
            bars.getChildren().add(bar);
        }
        return bars;
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
