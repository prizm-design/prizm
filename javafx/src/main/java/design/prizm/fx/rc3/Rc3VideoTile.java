package design.prizm.fx.rc3;

import java.util.ArrayList;
import java.util.List;
import javafx.geometry.Insets;
import javafx.geometry.Pos;
import javafx.scene.Group;
import javafx.scene.Node;
import javafx.scene.control.Label;
import javafx.scene.layout.HBox;
import javafx.scene.layout.Region;
import javafx.scene.layout.StackPane;
import javafx.scene.layout.VBox;
import javafx.scene.paint.Color;
import javafx.scene.shape.Circle;
import javafx.scene.shape.Line;
import javafx.scene.shape.Rectangle;

/**
 * RC3 — Video tile (JavaFX).
 *
 * <p>Frames a single video / sensor feed. RC3 ships the surface — border, source
 * label with an Ember dot, status label, recording indicator, reticle, and an
 * unambiguous no-signal overlay — and the consumer plugs their video element,
 * canvas, or stream player via {@link #setContent(Node)}. Honours behavioural
 * invariant 5: a lost feed surfaces as "NO SIGNAL", never a frozen last frame.
 *
 * <p>Mirrors the React {@code VideoTile} ({@code components/rc3/video-tile.tsx}).
 * Note: JavaFX has no backdrop-blur, so the overlay pills use a solid surface
 * fill rather than a translucent blurred one.
 */
public class Rc3VideoTile extends StackPane {

    public enum FeedStatus {
        LIVE,
        DEGRADED,
        LOST
    }

    public enum AspectRatio {
        R16_9(9.0 / 16.0),
        R4_3(3.0 / 4.0),
        R9_16(16.0 / 9.0),
        R1_1(1.0),
        AUTO(0);

        final double heightFactor;

        AspectRatio(double heightFactor) {
            this.heightFactor = heightFactor;
        }
    }

    public enum SensorMode {
        EO,
        IR,
        LL
    }

    private String source = "";
    private FeedStatus status = FeedStatus.LIVE;
    private boolean recording = false;
    private AspectRatio aspectRatio = AspectRatio.R16_9;
    private boolean reticle = false;
    private String coordinates;
    private Integer bearing;
    private Double range;
    private Integer zoom;
    private SensorMode sensor;
    private Node content;

    // Inner layer that holds the feed + overlays. Clipped to the rounded frame
    // (the web uses overflow-hidden). The border lives on the outer tile so it is
    // NOT clipped — clipping the tile itself would shave its rounded border corners.
    private final StackPane layers = new StackPane();

    public Rc3VideoTile() {
        getStyleClass().add("rc3-video-tile");
        setAlignment(Pos.TOP_LEFT);
        widthProperty().addListener((obs, was, now) -> applyAspect());

        layers.setAlignment(Pos.TOP_LEFT);
        var clip = new Rectangle();
        clip.setArcWidth(10); // inner radius (outer 6 − 1px border), doubled
        clip.setArcHeight(10);
        clip.widthProperty().bind(layers.widthProperty());
        clip.heightProperty().bind(layers.heightProperty());
        layers.setClip(clip);
        getChildren().add(layers);
        rebuild();
    }

    public Rc3VideoTile(String source, FeedStatus status) {
        this();
        this.source = source;
        this.status = status;
        rebuild();
    }

    /** The consumer's video element / canvas / player. Fills the tile. */
    public void setContent(Node content) {
        this.content = content;
        rebuild();
    }

    public void setSource(String source) {
        this.source = source;
        rebuild();
    }

    public void setStatus(FeedStatus status) {
        this.status = status;
        rebuild();
    }

    public void setRecording(boolean recording) {
        this.recording = recording;
        rebuild();
    }

    public void setAspectRatio(AspectRatio aspectRatio) {
        this.aspectRatio = aspectRatio == null ? AspectRatio.R16_9 : aspectRatio;
        applyAspect();
    }

    public void setReticle(boolean reticle) {
        this.reticle = reticle;
        rebuild();
    }

    public void setCoordinates(String coordinates) {
        this.coordinates = coordinates;
        rebuild();
    }

    public void setBearing(Integer bearing) {
        this.bearing = bearing;
        rebuild();
    }

    public void setRange(Double range) {
        this.range = range;
        rebuild();
    }

    public void setZoom(Integer zoom) {
        this.zoom = zoom;
        rebuild();
    }

    public void setSensor(SensorMode sensor) {
        this.sensor = sensor;
        rebuild();
    }

    private void applyAspect() {
        if (aspectRatio == AspectRatio.AUTO) {
            return;
        }
        double w = getWidth();
        if (w > 0) {
            double h = w * aspectRatio.heightFactor;
            setMinHeight(h);
            setPrefHeight(h);
            setMaxHeight(h);
        }
    }

    private void rebuild() {
        layers.getChildren().clear();
        boolean lost = status == FeedStatus.LOST;
        setAccessibleText(source + ", " + statusLabel());

        if (content != null) {
            layers.getChildren().add(content);
        }

        // No-signal overlay sits BELOW the source pill (like the web) so the pill
        // stays legible over the blanked frame.
        if (lost) {
            var overlay = new StackPane();
            overlay.getStyleClass().add("rc3-video-lost-overlay");
            overlay.setMinSize(0, 0);
            var lostDot = new Region();
            lostDot.getStyleClass().add("rc3-video-rec-dot");
            lostDot.setMinSize(6, 6);
            lostDot.setPrefSize(6, 6);
            lostDot.setMaxSize(6, 6);
            var lostLabel = mono("NO SIGNAL", "rc3-video-status", "rc3-tone-danger");
            var box = new VBox(8, lostDot, lostLabel);
            box.setAlignment(Pos.CENTER);
            overlay.getChildren().add(box);
            layers.getChildren().add(overlay);
        }

        if (reticle && !lost) {
            layers.getChildren().add(reticle());
        }

        // Source pill (top-left)
        var srcDot = new Region();
        srcDot.getStyleClass().add("rc3-video-source-dot");
        srcDot.setMinSize(6, 6);
        srcDot.setPrefSize(6, 6);
        srcDot.setMaxSize(6, 6);
        var srcLabel = mono(source, "rc3-video-source");
        var dot = mono("·", "rc3-tone-subtle");
        var statusLabel = mono(statusLabel(), "rc3-video-status", toneClass());
        var sourcePill = pill(srcDot, srcLabel, dot, statusLabel);
        StackPane.setAlignment(sourcePill, Pos.TOP_LEFT);
        StackPane.setMargin(sourcePill, new Insets(10));
        layers.getChildren().add(sourcePill);

        // Recording pill (top-right)
        if (recording) {
            var recDot = new Region();
            recDot.getStyleClass().add("rc3-video-rec-dot");
            recDot.setMinSize(6, 6);
            recDot.setPrefSize(6, 6);
            recDot.setMaxSize(6, 6);
            var recPill = pill(recDot, mono("REC", "rc3-video-status", "rc3-tone-danger"));
            StackPane.setAlignment(recPill, Pos.TOP_RIGHT);
            StackPane.setMargin(recPill, new Insets(10));
            layers.getChildren().add(recPill);
        }

        // Telemetry pill (bottom-left)
        if (!lost) {
            var cells = telemetryCells();
            if (!cells.isEmpty()) {
                var telem = new HBox(8);
                telem.getStyleClass().add("rc3-video-pill");
                telem.setAlignment(Pos.CENTER_LEFT);
                telem.setMaxSize(Region.USE_PREF_SIZE, Region.USE_PREF_SIZE);
                for (int i = 0; i < cells.size(); i++) {
                    if (i > 0) {
                        telem.getChildren().add(mono("·", "rc3-tone-subtle"));
                    }
                    telem.getChildren().add(mono(cells.get(i), "rc3-video-telem"));
                }
                StackPane.setAlignment(telem, Pos.BOTTOM_LEFT);
                StackPane.setMargin(telem, new Insets(10));
                layers.getChildren().add(telem);
            }
        }

    }

    private HBox pill(Node... children) {
        var p = new HBox(8);
        p.getStyleClass().add("rc3-video-pill");
        p.setAlignment(Pos.CENTER_LEFT);
        // Stay at natural size so StackPane can corner-align it (otherwise the
        // StackPane stretches the HBox to fill and alignment is lost).
        p.setMaxSize(Region.USE_PREF_SIZE, Region.USE_PREF_SIZE);
        p.getChildren().addAll(children);
        return p;
    }

    private Group reticle() {
        var g = new Group();
        g.getStyleClass().add("rc3-video-reticle");
        Color c = Color.web("#94a3b8"); // fg-muted-ish; opacity applied on group
        var lines = List.of(
            new Line(24, 6, 24, 20), new Line(24, 28, 24, 42),
            new Line(6, 24, 20, 24), new Line(28, 24, 42, 24));
        for (var l : lines) {
            l.setStroke(c);
            l.setStrokeWidth(1.25);
            g.getChildren().add(l);
        }
        var ring = new Circle(24, 24, 18);
        ring.setStroke(c);
        ring.setStrokeWidth(1);
        ring.setFill(Color.TRANSPARENT);
        var centre = new Circle(24, 24, 1.5, c);
        g.getChildren().addAll(ring, centre);
        g.setOpacity(0.7);
        g.setMouseTransparent(true);
        StackPane.setAlignment(g, Pos.CENTER);
        return g;
    }

    private List<String> telemetryCells() {
        var cells = new ArrayList<String>();
        if (coordinates != null) {
            cells.add(coordinates);
        }
        if (sensor != null) {
            cells.add(sensor.name());
        }
        if (bearing != null) {
            cells.add("BRG " + formatBearing(bearing));
        }
        if (range != null) {
            cells.add("RNG " + formatRange(range));
        }
        if (zoom != null) {
            cells.add("ZOOM " + zoom + "×");
        }
        return cells;
    }

    private static String formatBearing(int degrees) {
        int n = ((degrees % 360) + 360) % 360;
        return String.format("%03d°", n);
    }

    private static String formatRange(double metres) {
        if (metres >= 1000) {
            double km = metres / 1000.0;
            return metres >= 10000
                ? String.format("%.0f km", km)
                : String.format("%.1f km", km);
        }
        return Math.round(metres) + " m";
    }

    private String statusLabel() {
        return switch (status) {
            case LIVE -> "LIVE";
            case DEGRADED -> "DEGRADED";
            case LOST -> "NO SIGNAL";
        };
    }

    private String toneClass() {
        return switch (status) {
            case LIVE -> "rc3-tone-success";
            case DEGRADED -> "rc3-tone-warning";
            case LOST -> "rc3-tone-danger";
        };
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
