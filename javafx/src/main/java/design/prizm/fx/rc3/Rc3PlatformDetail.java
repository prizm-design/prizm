package design.prizm.fx.rc3;

import java.util.ArrayList;
import java.util.List;
import javafx.geometry.Pos;
import javafx.scene.Node;
import javafx.scene.control.Label;
import javafx.scene.control.ScrollPane;
import javafx.scene.layout.HBox;
import javafx.scene.layout.Pane;
import javafx.scene.layout.Priority;
import javafx.scene.layout.Region;
import javafx.scene.layout.StackPane;
import javafx.scene.layout.VBox;
import javafx.scene.shape.Polygon;

/**
 * RC3 — Platform detail (JavaFX).
 *
 * <p>A vertical card showing the deep state of a single platform — the
 * master-detail companion to {@link Rc3PlatformRoster}. Comms / Telemetry /
 * Mission sections plus caller-supplied extras; each section renders only when
 * its data is present. An Ember-dotted header makes the detailed platform
 * unmistakable (invariant 3); status fields use semantic tokens.
 *
 * <p>Set {@link #setFillHeight} to pin the header + last-contact footer and
 * scroll the body. Mirrors the React {@code PlatformDetail}
 * ({@code components/rc3/platform-detail.tsx}). Extra values are Strings here
 * (the web accepts arbitrary nodes).
 */
public class Rc3PlatformDetail extends VBox {

    public enum LinkStatus {
        GOOD,
        DEGRADED,
        LOST
    }

    public enum UxvDomain {
        AERIAL,
        GROUND,
        SURFACE,
        UNDERWATER
    }

    /** Mission step progress. {@code label} is optional. */
    public record MissionStep(int current, int total, String label) {
        public MissionStep(int current, int total) {
            this(current, total, null);
        }
    }

    /**
     * A domain-specific extra row. {@code section} groups consecutive entries. The
     * value is any node — pass an {@link Rc3Indicators} primitive to read as an
     * instrument, or a String (wrapped in default value styling) for plain text.
     */
    public record Extra(String section, String label, Node value) {
        public Extra(String section, String label, String value) {
            this(section, label, plainValue(value));
        }

        private static Node plainValue(String text) {
            var l = new Label(text);
            l.getStyleClass().addAll("rc3-mono", "rc3-detail-value", "rc3-tone-fg");
            return l;
        }
    }

    private String platform = "";
    private String klass;
    private UxvDomain domain = UxvDomain.AERIAL;
    private LinkStatus link;
    private Integer signal;
    private Integer battery;
    private String autonomy;
    private String position;
    private Integer heading;
    private Double speed;
    private String speedUnit = "m/s";
    private Double vertical;
    private String verticalUnit = "m";
    private String verticalRef;
    private MissionStep mission;
    private String operator;
    private String lastContact;
    private final List<Extra> extras = new ArrayList<>();
    private boolean fillHeight = false;

    public Rc3PlatformDetail() {
        getStyleClass().add("rc3-detail");
        setMaxWidth(384);
        rebuild();
    }

    public Rc3PlatformDetail(String platform) {
        this();
        this.platform = platform;
        rebuild();
    }

    public void setPlatform(String platform) {
        this.platform = platform;
        rebuild();
    }

    public void setKlass(String klass) {
        this.klass = klass;
        rebuild();
    }

    public void setDomain(UxvDomain domain) {
        this.domain = domain == null ? UxvDomain.AERIAL : domain;
        rebuild();
    }

    public void setLink(LinkStatus link) {
        this.link = link;
        rebuild();
    }

    public void setSignal(Integer signal) {
        this.signal = signal;
        rebuild();
    }

    public void setBattery(Integer battery) {
        this.battery = battery;
        rebuild();
    }

    public void setAutonomy(String autonomy) {
        this.autonomy = autonomy;
        rebuild();
    }

    public void setPosition(String position) {
        this.position = position;
        rebuild();
    }

    public void setHeading(Integer heading) {
        this.heading = heading;
        rebuild();
    }

    public void setSpeed(Double speed, String unit) {
        this.speed = speed;
        if (unit != null) {
            this.speedUnit = unit;
        }
        rebuild();
    }

    public void setVertical(Double vertical, String unit, String ref) {
        this.vertical = vertical;
        if (unit != null) {
            this.verticalUnit = unit;
        }
        this.verticalRef = ref;
        rebuild();
    }

    public void setMission(MissionStep mission) {
        this.mission = mission;
        rebuild();
    }

    public void setOperator(String operator) {
        this.operator = operator;
        rebuild();
    }

    public void setLastContact(String lastContact) {
        this.lastContact = lastContact;
        rebuild();
    }

    public void setExtras(List<Extra> extras) {
        this.extras.clear();
        if (extras != null) {
            this.extras.addAll(extras);
        }
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

    private String verticalLabel() {
        return switch (domain) {
            case AERIAL -> "ALT";
            case GROUND -> "ELEV";
            case SURFACE, UNDERWATER -> "DEPTH";
        };
    }

    private static String formatHeading(int d) {
        int n = ((d % 360) + 360) % 360;
        return String.format("%03d°", n);
    }

    private void rebuild() {
        getChildren().clear();
        getStyleClass().remove("rc3-detail--fill");
        setAccessibleText("Platform detail for " + platform);
        if (fillHeight) {
            getStyleClass().add("rc3-detail--fill");
        }

        getChildren().add(buildHeader());

        var body = new VBox();
        boolean first = true;
        boolean hasComms = link != null || signal != null || battery != null;
        boolean hasTelemetry = position != null || heading != null || speed != null || vertical != null;
        boolean hasMission = mission != null || operator != null;

        if (hasComms) {
            body.getChildren().add(section("Comms", first, commsRows()));
            first = false;
        }
        if (hasTelemetry) {
            body.getChildren().add(section("Telemetry", first, telemetryRows()));
            first = false;
        }
        if (hasMission) {
            body.getChildren().add(section("Mission", first, missionRows()));
            first = false;
        }
        for (var g : groupExtras()) {
            var rows = new ArrayList<Node>();
            for (var ex : g.rows) {
                rows.add(row(ex.label(), ex.value()));
            }
            body.getChildren().add(section(g.section, first, rows));
            first = false;
        }

        if (fillHeight) {
            var scroll = new ScrollPane(body);
            scroll.getStyleClass().add("scroll-pane");
            scroll.setFitToWidth(true);
            scroll.setHbarPolicy(ScrollPane.ScrollBarPolicy.NEVER);
            VBox.setVgrow(scroll, Priority.ALWAYS);
            getChildren().add(scroll);
        } else {
            getChildren().add(body);
        }

        if (lastContact != null) {
            var footer = new HBox(12);
            footer.getStyleClass().add("rc3-detail-footer");
            footer.setAlignment(Pos.CENTER_LEFT);
            var lbl = mono("LAST CONTACT", "rc3-detail-section-label");
            var spacer = new Region();
            HBox.setHgrow(spacer, Priority.ALWAYS);
            footer.getChildren().addAll(lbl, spacer, mono(lastContact, "rc3-detail-value", "rc3-tone-muted"));
            getChildren().add(footer);
        }
    }

    private HBox buildHeader() {
        var dot = new Region();
        dot.getStyleClass().add("rc3-video-source-dot");
        dot.setMinSize(6, 6);
        dot.setPrefSize(6, 6);
        dot.setMaxSize(6, 6);

        var lead = new HBox(8, dot, mono(platform, "rc3-detail-id"));
        lead.setAlignment(Pos.CENTER_LEFT);
        if (klass != null) {
            lead.getChildren().add(mono(klass, "rc3-detail-class"));
        }

        var header = new HBox(12);
        header.getStyleClass().add("rc3-detail-header");
        header.setAlignment(Pos.CENTER_LEFT);
        var spacer = new Region();
        HBox.setHgrow(spacer, Priority.ALWAYS);
        header.getChildren().addAll(lead, spacer);
        if (autonomy != null) {
            header.getChildren().add(mono(autonomy, "rc3-detail-autonomy"));
        }
        return header;
    }

    private List<Node> commsRows() {
        var rows = new ArrayList<Node>();
        if (link != null) {
            rows.add(row("LINK", mono(linkLabel(link), "rc3-detail-value", toneClass(link))));
        }
        if (signal != null) {
            var v = new HBox(6, signalBars(signal, link != null ? link : LinkStatus.GOOD),
                mono(signal + "/4", "rc3-detail-value", "rc3-tone-fg"));
            v.setAlignment(Pos.CENTER_LEFT);
            rows.add(row("SIGNAL", v));
        }
        if (battery != null) {
            var v = new HBox(6, batteryGauge(battery),
                mono(Math.round(battery) + "%", "rc3-detail-value", chargeTone(battery)));
            v.setAlignment(Pos.CENTER_LEFT);
            rows.add(row("BATTERY", v));
        }
        return rows;
    }

    private List<Node> telemetryRows() {
        var rows = new ArrayList<Node>();
        if (position != null) {
            rows.add(row("POSITION", mono(position, "rc3-detail-value", "rc3-tone-fg")));
        }
        if (heading != null) {
            var v = new HBox(6, headingDial(heading), mono(formatHeading(heading), "rc3-detail-value", "rc3-tone-fg"));
            v.setAlignment(Pos.CENTER_LEFT);
            rows.add(row("HEADING", v));
        }
        if (speed != null) {
            String s = "m/s".equals(speedUnit) ? String.format("%.1f", speed) : String.valueOf(Math.round(speed));
            rows.add(row("SPEED", mono(s + " " + speedUnit, "rc3-detail-value", "rc3-tone-fg")));
        }
        if (vertical != null) {
            String ref = verticalRef != null ? " " + verticalRef : "";
            rows.add(row(verticalLabel(),
                mono(Math.round(vertical) + " " + verticalUnit + ref, "rc3-detail-value", "rc3-tone-fg")));
        }
        return rows;
    }

    private List<Node> missionRows() {
        var rows = new ArrayList<Node>();
        if (mission != null) {
            String prefix = mission.label() != null ? mission.label() + " · " : "";
            rows.add(row("STEP", mono(prefix + mission.current() + "/" + mission.total(),
                "rc3-detail-value", "rc3-tone-fg")));
        }
        if (operator != null) {
            rows.add(row("OPERATOR", mono(operator, "rc3-detail-value", "rc3-tone-fg")));
        }
        return rows;
    }

    private VBox section(String label, boolean first, List<Node> rows) {
        var sec = new VBox(6);
        sec.getStyleClass().add("rc3-detail-section");
        if (!first) {
            sec.getStyleClass().add("rc3-detail-section--divided");
        }
        sec.getChildren().add(mono(label.toUpperCase(), "rc3-detail-section-label"));
        var rowsBox = new VBox(4);
        rowsBox.getChildren().addAll(rows);
        sec.getChildren().add(rowsBox);
        return sec;
    }

    private HBox row(String label, Node value) {
        var box = new HBox(12);
        box.setAlignment(Pos.CENTER_LEFT);
        var lbl = mono(label, "rc3-detail-row-label");
        var spacer = new Region();
        HBox.setHgrow(spacer, Priority.ALWAYS);
        box.getChildren().addAll(lbl, spacer, value);
        return box;
    }

    private HBox signalBars(int filled, LinkStatus status) {
        var bars = new HBox(2);
        bars.setAlignment(Pos.BOTTOM_LEFT);
        int[] heights = {4, 7, 10, 13};
        for (int i = 0; i < heights.length; i++) {
            var bar = new Region();
            bar.getStyleClass().add("rc3-signal-bar");
            bar.getStyleClass().add(i < filled ? toneClass(status) : "rc3-signal-bar--off");
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

    private HBox batteryGauge(int pct) {
        int clamped = Math.max(0, Math.min(100, pct));
        var body = new StackPane();
        body.getStyleClass().add("rc3-batt-body");
        body.setMinSize(20, 10);
        body.setPrefSize(20, 10);
        body.setMaxSize(20, 10);
        body.setAlignment(Pos.CENTER_LEFT);

        var fill = new Region();
        fill.getStyleClass().addAll("rc3-batt-fill", chargeToneFill(clamped));
        double w = (clamped / 100.0) * 16; // inner width minus padding/border
        fill.setMaxWidth(w);
        fill.setPrefWidth(w);
        fill.setMaxHeight(Double.MAX_VALUE);
        body.getChildren().add(fill);

        var nub = new Region();
        nub.getStyleClass().add("rc3-batt-nub");
        nub.setMinSize(2, 6);
        nub.setPrefSize(2, 6);
        nub.setMaxSize(2, 6);

        var gauge = new HBox(1, body, nub);
        gauge.setAlignment(Pos.CENTER_LEFT);
        return gauge;
    }

    private static String chargeToneFill(int pct) {
        if (pct < 20) {
            return "rc3-batt-fill--danger";
        }
        if (pct <= 50) {
            return "rc3-batt-fill--warning";
        }
        return "rc3-batt-fill--success";
    }

    private Pane headingDial(int heading) {
        int angle = ((heading % 360) + 360) % 360;
        var p = new Polygon(6, 1.5, 9, 9, 6, 7.25, 3, 9);
        p.getStyleClass().add("rc3-heading-dial");
        p.setRotate(angle);
        var pane = new Pane(p);
        pane.setMinSize(12, 12);
        pane.setPrefSize(12, 12);
        pane.setMaxSize(12, 12);
        return pane;
    }

    private static final class GroupedExtras {
        String section;
        final List<Extra> rows = new ArrayList<>();
    }

    private List<GroupedExtras> groupExtras() {
        var groups = new ArrayList<GroupedExtras>();
        for (var item : extras) {
            GroupedExtras current = groups.isEmpty() ? null : groups.get(groups.size() - 1);
            boolean matches = current != null
                && (item.section() == null || item.section().equals(current.section));
            if (matches) {
                current.rows.add(item);
            } else {
                var g = new GroupedExtras();
                g.section = item.section() != null ? item.section() : "Extra";
                g.rows.add(item);
                groups.add(g);
            }
        }
        return groups;
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
