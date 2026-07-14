package design.prizm.fx.rc3;

import java.util.ArrayList;
import java.util.EnumMap;
import java.util.List;
import java.util.Map;
import javafx.geometry.Insets;
import javafx.geometry.Pos;
import javafx.scene.Node;
import javafx.scene.control.Label;
import javafx.scene.layout.HBox;
import javafx.scene.layout.Region;
import javafx.scene.layout.StackPane;
import javafx.scene.layout.VBox;

/**
 * RC3 — Telemetry HUD (JavaFX).
 *
 * <p>Operational telemetry for a UXV — Aerial / Ground / Surface / Underwater.
 * {@link UxvDomain} drives label semantics (vertical reads as ALT / ELEV / DEPTH;
 * verticalRate as V/S / DIVE). Two postures: {@code STRIP} (default — an inline
 * row for edge overlays / side panels) and {@code FRAME} (a four-edge container
 * around a centred viewport set via {@link #setContent(Node)}).
 *
 * <p>The leading platform marker carries the Ember signature; battery / fuel use
 * semantic success / warning / danger, the rest stay neutral. Honours invariant 5
 * — a field marked stale via {@link #setStale} dims and shows a STALE age tag, so
 * a frozen reading never passes for live. Mirrors the React {@code TelemetryHud}
 * ({@code components/rc3/telemetry-hud.tsx}).
 */
public class Rc3TelemetryHud extends StackPane {

    public enum UxvDomain {
        AERIAL,
        GROUND,
        SURFACE,
        UNDERWATER
    }

    public enum HudMode {
        STRIP,
        FRAME
    }

    public enum SpeedUnit {
        M_S("m/s"),
        KM_H("km/h"),
        KN("kn");

        final String label;

        SpeedUnit(String label) {
            this.label = label;
        }
    }

    public enum VerticalUnit {
        M("m"),
        FT("ft");

        final String label;

        VerticalUnit(String label) {
            this.label = label;
        }
    }

    public enum TelemetryField {
        SPEED,
        VERTICAL,
        HEADING,
        BATTERY,
        FUEL,
        ROLL,
        PITCH,
        VERTICAL_RATE,
        SLOPE,
        ALTITUDE_ABOVE_BOTTOM
    }

    private record Cell(String label, String value, String tone, Integer staleSeconds) {
        Cell withStale(Integer s) {
            return new Cell(label, value, tone, s);
        }
    }

    private UxvDomain domain = UxvDomain.AERIAL;
    private HudMode mode = HudMode.STRIP;
    private String platform;
    private Double speed;
    private SpeedUnit speedUnit = SpeedUnit.M_S;
    private Double vertical;
    private VerticalUnit verticalUnit = VerticalUnit.M;
    private String verticalRef;
    private Double verticalRate;
    private Integer heading;
    private Integer battery;
    private Integer fuel;
    private Double roll;
    private Double pitch;
    private Double slope;
    private Double altitudeAboveBottom;
    private final Map<TelemetryField, Integer> stale = new EnumMap<>(TelemetryField.class);
    private Node content;

    public Rc3TelemetryHud() {
        getStyleClass().add("rc3-telemetry");
        setAlignment(Pos.TOP_LEFT);
        rebuild();
    }

    public void setDomain(UxvDomain domain) {
        this.domain = domain == null ? UxvDomain.AERIAL : domain;
        rebuild();
    }

    public void setMode(HudMode mode) {
        this.mode = mode == null ? HudMode.STRIP : mode;
        rebuild();
    }

    public void setPlatform(String platform) {
        this.platform = platform;
        rebuild();
    }

    public void setSpeed(Double speed, SpeedUnit unit) {
        this.speed = speed;
        if (unit != null) {
            this.speedUnit = unit;
        }
        rebuild();
    }

    public void setVertical(Double vertical, VerticalUnit unit, String ref) {
        this.vertical = vertical;
        if (unit != null) {
            this.verticalUnit = unit;
        }
        this.verticalRef = ref;
        rebuild();
    }

    public void setVerticalRate(Double verticalRate) {
        this.verticalRate = verticalRate;
        rebuild();
    }

    public void setHeading(Integer heading) {
        this.heading = heading;
        rebuild();
    }

    public void setBattery(Integer battery) {
        this.battery = battery;
        rebuild();
    }

    public void setFuel(Integer fuel) {
        this.fuel = fuel;
        rebuild();
    }

    public void setRoll(Double roll) {
        this.roll = roll;
        rebuild();
    }

    public void setPitch(Double pitch) {
        this.pitch = pitch;
        rebuild();
    }

    public void setSlope(Double slope) {
        this.slope = slope;
        rebuild();
    }

    public void setAltitudeAboveBottom(Double altitudeAboveBottom) {
        this.altitudeAboveBottom = altitudeAboveBottom;
        rebuild();
    }

    public void setStale(Map<TelemetryField, Integer> stale) {
        this.stale.clear();
        if (stale != null) {
            this.stale.putAll(stale);
        }
        rebuild();
    }

    /** The centred viewport (map / 3D / video) shown inside FRAME mode. */
    public void setContent(Node content) {
        this.content = content;
        rebuild();
    }

    // ----- Cell building (mirrors buildCells in the web) -----

    private static final class Cells {
        Cell speed, vertical, heading, charge, roll, pitch, verticalRate, slope, bottom;
    }

    private Cells buildCells() {
        var c = new Cells();
        if (speed != null) {
            String v = (speedUnit == SpeedUnit.KN || speedUnit == SpeedUnit.KM_H)
                ? String.valueOf(Math.round(speed))
                : String.format("%.1f", speed);
            c.speed = new Cell("SPD", v + " " + speedUnit.label, null, null);
        }
        if (vertical != null) {
            String ref = verticalRef != null ? " " + verticalRef : "";
            c.vertical = new Cell(verticalLabel(), Math.round(vertical) + " " + verticalUnit.label + ref, null, null);
        }
        if (heading != null) {
            c.heading = new Cell("HDG", formatHeading(heading), null, null);
        }
        if (battery != null) {
            c.charge = new Cell("BATT", Math.round(battery) + "%", chargeTone(battery), null);
        } else if (fuel != null) {
            c.charge = new Cell("FUEL", Math.round(fuel) + "%", chargeTone(fuel), null);
        }
        if (roll != null) {
            c.roll = new Cell("ROLL", formatSigned(roll, 0) + "°", null, null);
        }
        if (pitch != null) {
            c.pitch = new Cell("PITCH", formatSigned(pitch, 0) + "°", null, null);
        }
        if (verticalRate != null) {
            c.verticalRate = new Cell(verticalRateLabel(), formatSigned(verticalRate, 1) + " m/s", null, null);
        }
        if (slope != null && domain == UxvDomain.GROUND) {
            c.slope = new Cell("SLOPE", formatSigned(slope, 0) + "°", null, null);
        }
        if (altitudeAboveBottom != null) {
            c.bottom = new Cell("BOT", Math.round(altitudeAboveBottom) + " m", null, null);
        }

        if (!stale.isEmpty()) {
            c.speed = applyStale(c.speed, stale.get(TelemetryField.SPEED));
            c.vertical = applyStale(c.vertical, stale.get(TelemetryField.VERTICAL));
            c.heading = applyStale(c.heading, stale.get(TelemetryField.HEADING));
            c.charge = applyStale(c.charge,
                battery != null ? stale.get(TelemetryField.BATTERY) : stale.get(TelemetryField.FUEL));
            c.roll = applyStale(c.roll, stale.get(TelemetryField.ROLL));
            c.pitch = applyStale(c.pitch, stale.get(TelemetryField.PITCH));
            c.verticalRate = applyStale(c.verticalRate, stale.get(TelemetryField.VERTICAL_RATE));
            c.slope = applyStale(c.slope, stale.get(TelemetryField.SLOPE));
            c.bottom = applyStale(c.bottom, stale.get(TelemetryField.ALTITUDE_ABOVE_BOTTOM));
        }
        return c;
    }

    private static Cell applyStale(Cell cell, Integer seconds) {
        return (cell != null && seconds != null) ? cell.withStale(seconds) : cell;
    }

    private String verticalLabel() {
        return switch (domain) {
            case AERIAL -> "ALT";
            case GROUND -> "ELEV";
            case SURFACE, UNDERWATER -> "DEPTH";
        };
    }

    private String verticalRateLabel() {
        return domain == UxvDomain.UNDERWATER ? "DIVE" : "V/S";
    }

    private static String formatHeading(int d) {
        int n = ((d % 360) + 360) % 360;
        return String.format("%03d°", n);
    }

    private static String formatSigned(double n, int decimals) {
        String v = decimals > 0 ? String.format("%." + decimals + "f", n) : String.valueOf(Math.round(n));
        return n >= 0 ? "+" + v : v;
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

    // ----- Rendering -----

    private void rebuild() {
        getChildren().clear();
        var cells = buildCells();
        setAccessibleText("Telemetry" + (platform != null ? " for " + platform : ""));
        if (mode == HudMode.FRAME) {
            buildFrame(cells);
        } else {
            buildStrip(cells);
        }
    }

    private void buildStrip(Cells cells) {
        var ordered = ordered(cells);
        if (ordered.isEmpty() && platform == null) {
            return;
        }
        var strip = new HBox(12);
        strip.getStyleClass().add("rc3-telemetry-strip");
        strip.setAlignment(Pos.CENTER_LEFT);

        if (platform != null) {
            strip.getChildren().add(platformMarker(false));
            if (!ordered.isEmpty()) {
                strip.getChildren().add(divider());
            }
        }
        for (int i = 0; i < ordered.size(); i++) {
            if (i > 0) {
                strip.getChildren().add(divider());
            }
            strip.getChildren().add(cellInline(ordered.get(i)));
        }
        getChildren().add(strip);
    }

    private void buildFrame(Cells cells) {
        if (content != null) {
            getChildren().add(content);
        }
        List<Cell> top = new ArrayList<>();
        List<Cell> left = new ArrayList<>();
        List<Cell> right = new ArrayList<>();
        List<Cell> bottom = new ArrayList<>();
        if (cells.heading != null) {
            top.add(cells.heading);
        }
        if (cells.speed != null) {
            left.add(cells.speed);
        }
        if (cells.roll != null) {
            left.add(cells.roll);
        }
        if (cells.vertical != null) {
            right.add(cells.vertical);
        }
        if (cells.pitch != null) {
            right.add(cells.pitch);
        }
        if (cells.charge != null) {
            bottom.add(cells.charge);
        }
        if (cells.verticalRate != null) {
            bottom.add(cells.verticalRate);
        }
        if (cells.slope != null) {
            bottom.add(cells.slope);
        }
        if (cells.bottom != null) {
            bottom.add(cells.bottom);
        }

        if (!top.isEmpty() || platform != null) {
            var topRow = new HBox(12);
            topRow.setAlignment(Pos.CENTER_LEFT);
            if (platform != null) {
                topRow.getChildren().add(platformMarker(true));
            }
            var spacer = new Region();
            HBox.setHgrow(spacer, javafx.scene.layout.Priority.ALWAYS);
            topRow.getChildren().add(spacer);
            if (!top.isEmpty()) {
                topRow.getChildren().add(edgeRow(top));
            }
            topRow.setMaxHeight(Region.USE_PREF_SIZE); // keep at top; still spans width
            StackPane.setAlignment(topRow, Pos.TOP_CENTER);
            StackPane.setMargin(topRow, new Insets(12, 16, 0, 16));
            topRow.setMouseTransparent(true);
            getChildren().add(topRow);
        }
        if (!left.isEmpty()) {
            var col = edgeColumn(left, Pos.CENTER_LEFT);
            StackPane.setAlignment(col, Pos.CENTER_LEFT);
            StackPane.setMargin(col, new Insets(0, 0, 0, 16));
            getChildren().add(col);
        }
        if (!right.isEmpty()) {
            var col = edgeColumn(right, Pos.CENTER_RIGHT);
            StackPane.setAlignment(col, Pos.CENTER_RIGHT);
            StackPane.setMargin(col, new Insets(0, 16, 0, 0));
            getChildren().add(col);
        }
        if (!bottom.isEmpty()) {
            var row = edgeRow(bottom);
            StackPane.setAlignment(row, Pos.BOTTOM_CENTER);
            StackPane.setMargin(row, new Insets(0, 16, 12, 16));
            getChildren().add(row);
        }
    }

    private VBox edgeColumn(List<Cell> cells, Pos align) {
        var col = new VBox(8);
        col.setAlignment(align);
        col.setFillWidth(false); // let CENTER_RIGHT actually right-align the cells
        col.setMouseTransparent(true);
        col.setMaxSize(Region.USE_PREF_SIZE, Region.USE_PREF_SIZE);
        for (var c : cells) {
            col.getChildren().add(backdrop(cellInline(c)));
        }
        return col;
    }

    private HBox edgeRow(List<Cell> cells) {
        var row = new HBox(12);
        row.getStyleClass().add("rc3-video-pill");
        row.setAlignment(Pos.CENTER_LEFT);
        row.setMouseTransparent(true);
        row.setMaxSize(Region.USE_PREF_SIZE, Region.USE_PREF_SIZE);
        for (int i = 0; i < cells.size(); i++) {
            if (i > 0) {
                row.getChildren().add(divider());
            }
            row.getChildren().add(cellInline(cells.get(i)));
        }
        return row;
    }

    private HBox backdrop(Node inner) {
        var box = new HBox(inner);
        box.getStyleClass().add("rc3-video-pill");
        box.setAlignment(Pos.CENTER_LEFT);
        return box;
    }

    private List<Cell> ordered(Cells c) {
        var list = new ArrayList<Cell>();
        for (Cell cell : new Cell[] {
            c.speed, c.vertical, c.heading, c.charge, c.roll, c.pitch, c.verticalRate, c.slope, c.bottom
        }) {
            if (cell != null) {
                list.add(cell);
            }
        }
        return list;
    }

    private HBox platformMarker(boolean backdrop) {
        var dot = new Region();
        dot.getStyleClass().add("rc3-video-source-dot");
        dot.setMinSize(6, 6);
        dot.setPrefSize(6, 6);
        dot.setMaxSize(6, 6);
        var name = mono(platform, "rc3-telem-platform");
        var box = new HBox(8, dot, name);
        box.setAlignment(Pos.CENTER_LEFT);
        if (backdrop) {
            box.getStyleClass().add("rc3-video-pill");
        }
        return box;
    }

    private HBox cellInline(Cell cell) {
        boolean isStale = cell.staleSeconds() != null;
        var label = mono(cell.label(), "rc3-telem-label");
        String valueTone = isStale ? "rc3-tone-subtle" : (cell.tone() != null ? cell.tone() : "rc3-tone-fg");
        var value = mono(cell.value(), "rc3-telem-value", valueTone);
        var box = new HBox(6, label, value);
        box.setAlignment(Pos.CENTER_LEFT);
        if (isStale) {
            box.getChildren().add(staleTag(cell.staleSeconds()));
        }
        return box;
    }

    private Label staleTag(int seconds) {
        String age = seconds < 60 ? Math.round((double) seconds) + "s" : (seconds / 60) + "m";
        var l = new Label("STALE " + age);
        l.getStyleClass().addAll("rc3-mono", "rc3-telem-stale");
        return l;
    }

    private Region divider() {
        var d = new Region();
        d.getStyleClass().add("rc3-divider");
        d.setMinSize(1, 12);
        d.setPrefSize(1, 12);
        d.setMaxSize(1, 12);
        return d;
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
