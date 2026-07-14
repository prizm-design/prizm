package design.prizm.fx.rc3;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.function.Consumer;
import javafx.animation.AnimationTimer;
import javafx.geometry.Insets;
import javafx.geometry.Pos;
import javafx.scene.Node;
import javafx.scene.Group;
import javafx.scene.canvas.Canvas;
import javafx.scene.canvas.GraphicsContext;
import javafx.scene.control.Label;
import javafx.scene.control.ScrollPane;
import javafx.scene.layout.HBox;
import javafx.scene.layout.Region;
import javafx.scene.layout.StackPane;
import javafx.scene.layout.VBox;
import javafx.scene.paint.Color;
import javafx.scene.shape.Line;
import javafx.scene.shape.Polygon;
import javafx.scene.shape.Rectangle;
import javafx.scene.shape.StrokeLineCap;

/**
 * RC3 — Perception view (JavaFX).
 *
 * <p>The operator's live 3D window into what a robot swarm perceives. RC3 frames
 * the surface (coordinate frame, layer legend, AOI registry, per-source
 * provenance + freshness, holding / lost overlay) and ships a dependency-free
 * reference renderer — a JavaFX {@link Canvas} that projects point clouds,
 * occupancy voxels, structural mesh, and AOIs with a small orbit camera. A
 * {@link RenderDelegate} lets a vendor 3D engine take over the drawing while
 * keeping the contract and chrome. RC3 does not fuse / register / SLAM — an
 * upstream system hands over one consolidated scene.
 *
 * <p>Honours invariant 5: geometry from a stale source visibly decays, per-source
 * freshness is always on screen, and a held / lost feed raises an unmistakable
 * overlay. Mirrors the React {@code PerceptionView} (components/rc3/perception-view.tsx).
 *
 * <p>JavaFX divergences: the reference renderer's neutral colours are dark-tuned
 * constants (the web reads live CSS vars); source hues, Ember, and the chrome
 * panels are unchanged. No backdrop-blur, so overlay pills use a solid fill.
 */
public class Rc3PerceptionView extends StackPane {

    // ----- Data contract -----

    public enum CoordinateFrame {
        ENU,
        NED,
        Z_UP,
        Y_UP;

        String display() {
            return switch (this) {
                case ENU -> "ENU";
                case NED -> "NED";
                case Z_UP -> "z-up";
                case Y_UP -> "y-up";
            };
        }
    }

    public record Vec3(double x, double y, double z) {}

    public record FrameTransform(Vec3 translation, double yaw) {}

    public record PerceptionSource(String id, String label, double ageSeconds, FrameTransform transform) {
        public PerceptionSource(String id, double ageSeconds) {
            this(id, null, ageSeconds, null);
        }
    }

    public sealed interface SceneLayer permits PointCloudLayer, OccupancyLayer, MeshLayer {
        String id();

        String label();

        String sourceId();
    }

    public record PointCloudLayer(String id, String label, String sourceId, List<Vec3> points, double[] intensity)
        implements SceneLayer {
        public PointCloudLayer(String id, String label, String sourceId, List<Vec3> points) {
            this(id, label, sourceId, points, null);
        }
    }

    public record OccupancyLayer(String id, String label, String sourceId, List<Vec3> voxels, double voxelSize)
        implements SceneLayer {}

    public record MeshLayer(String id, String label, String sourceId, List<Vec3> vertices, List<int[]> faces)
        implements SceneLayer {}

    public enum AoiKind {
        OBJECTIVE,
        HAZARD,
        INSPECT,
        MARKER
    }

    public record AreaOfInterest(
        String id, String label, AoiKind kind, Vec3 position, String sourceId, Double confidence, Double ageSeconds) {}

    public record PerceptionScene(
        CoordinateFrame frame, List<PerceptionSource> sources, List<SceneLayer> layers, List<AreaOfInterest> aois) {}

    public enum PerceptionStatus {
        LIVE,
        HOLDING,
        LOST
    }

    /** Context handed to a render delegate so a vendor engine can draw the scene. */
    public record PerceptionRenderContext(
        PerceptionScene scene, Set<String> hiddenLayerIds, String selectedAoiId,
        double staleAfterSeconds, PerceptionStatus status) {}

    @FunctionalInterface
    public interface RenderDelegate {
        Node render(PerceptionRenderContext ctx);
    }

    // ----- Palette (fixed; theme-independent like the web's source hues) -----

    private static final Color EMBER = Color.web("#ff684d");
    private static final Color FG_MUTED = Color.web("#94a3b8");
    private static final Color[] SOURCE_BASE = {
        Color.web("#5c9ce6"), // ~220 blue
        Color.web("#38bec9"), // ~195 cyan
        Color.web("#46b98a"), // ~150 green
        Color.web("#b072e0"), // ~300 purple
        Color.web("#d0a24a"), // ~45 amber
    };
    private static final Color AOI_DANGER = Color.web("#e5484d");
    private static final Color AOI_WARNING = Color.web("#f0a92e");
    private static final double ZOOM_MIN = 0.6;
    private static final double ZOOM_MAX = 5;

    // ----- State -----

    private PerceptionScene scene;
    private PerceptionStatus status = PerceptionStatus.LIVE;
    private double staleAfterSeconds = 3;
    private boolean autoRotate = false;
    private boolean bareChrome = false;
    private RenderDelegate renderDelegate;
    private final Set<String> hidden = new HashSet<>();
    private String selectedAoiId;
    private Consumer<String> onToggleLayer;
    private Consumer<String> onSelectAoi;

    private final Canvas canvas = new Canvas();
    private double azimuth = 0.7;
    private double elevation = 0.5;
    private double zoom = 1;
    private double dragX;
    private double dragY;
    private boolean dragging;
    private boolean rotating = false;
    private AnimationTimer rotor;
    private long lastRotate;

    public Rc3PerceptionView() {
        getStyleClass().add("rc3-perception");
        setAlignment(Pos.TOP_LEFT);
        setMinSize(280, 220);
        // Clip children to the rounded frame (border stays on the outer StackPane).
        var clip = new Rectangle();
        clip.setArcWidth(12);
        clip.setArcHeight(12);
        clip.widthProperty().bind(widthProperty());
        clip.heightProperty().bind(heightProperty());
        setClip(clip);

        canvas.widthProperty().bind(widthProperty());
        canvas.heightProperty().bind(heightProperty());
        // A Canvas picks on drawn pixels by default; since most of it is cleared
        // (transparent), drags in empty space would miss it. Pick on bounds so the
        // whole viewport orbits.
        canvas.setPickOnBounds(true);
        canvas.setCursor(javafx.scene.Cursor.OPEN_HAND);
        canvas.widthProperty().addListener((o, a, b) -> drawCanvas());
        canvas.heightProperty().addListener((o, a, b) -> drawCanvas());
        canvas.setOnMousePressed(e -> {
            dragging = true;
            dragX = e.getX();
            dragY = e.getY();
        });
        canvas.setOnMouseDragged(e -> {
            if (!dragging) {
                return;
            }
            azimuth += (e.getX() - dragX) * 0.01;
            elevation = clamp(elevation - (e.getY() - dragY) * 0.01, -0.2, 1.4);
            dragX = e.getX();
            dragY = e.getY();
            drawCanvas();
        });
        canvas.setOnMouseReleased(e -> dragging = false);
        canvas.setOnScroll(e -> {
            zoom = clamp(zoom * (e.getDeltaY() > 0 ? 1.1 : 0.9), ZOOM_MIN, ZOOM_MAX);
            drawCanvas();
        });
        // Trackpad pinch-to-zoom. getZoomFactor() is the incremental factor per event.
        canvas.setOnZoom(e -> {
            zoom = clamp(zoom * e.getZoomFactor(), ZOOM_MIN, ZOOM_MAX);
            drawCanvas();
            e.consume();
        });
        rebuild();
    }

    public void setScene(PerceptionScene scene) {
        this.scene = scene;
        rebuild();
    }

    public void setStatus(PerceptionStatus status) {
        this.status = status == null ? PerceptionStatus.LIVE : status;
        rebuild();
    }

    public void setStaleAfterSeconds(double s) {
        this.staleAfterSeconds = s;
        rebuild();
    }

    public void setAutoRotate(boolean autoRotate) {
        this.autoRotate = autoRotate;
        this.rotating = autoRotate;
        rebuild();
    }

    public void setBareChrome(boolean bareChrome) {
        this.bareChrome = bareChrome;
        rebuild();
    }

    public void setRenderDelegate(RenderDelegate renderDelegate) {
        this.renderDelegate = renderDelegate;
        rebuild();
    }

    public void setSelectedAoiId(String id) {
        this.selectedAoiId = id;
        rebuild();
    }

    public void setOnToggleLayer(Consumer<String> onToggleLayer) {
        this.onToggleLayer = onToggleLayer;
    }

    public void setOnSelectAoi(Consumer<String> onSelectAoi) {
        this.onSelectAoi = onSelectAoi;
    }

    // ----- Build (chrome) -----

    private void rebuild() {
        getChildren().clear();
        if (scene == null) {
            return;
        }
        boolean frozen = status != PerceptionStatus.LIVE;
        setAccessibleText(scene.frame().display() + " perception, " + statusLabel(status));

        // Scene layer: delegate node or the reference canvas.
        if (renderDelegate != null) {
            var node = renderDelegate.render(new PerceptionRenderContext(
                scene, new HashSet<>(hidden), selectedAoiId, staleAfterSeconds, status));
            if (node != null) {
                getChildren().add(node);
            }
        } else {
            getChildren().add(canvas);
        }

        // Top-centre — frame + status.
        var frameDot = dot(EMBER, 6);
        var top = pill(frameDot, mono(scene.frame().display(), "rc3-perc-frame"),
            mono("·", "rc3-tone-subtle"), mono(statusLabel(status), "rc3-perc-status", statusTone(status)));
        top.setMouseTransparent(true); // display-only; don't block orbit drags
        StackPane.setAlignment(top, Pos.TOP_CENTER);
        StackPane.setMargin(top, new Insets(10, 0, 0, 0));
        getChildren().add(top);

        if (!bareChrome) {
            getChildren().add(layerLegend());
            getChildren().add(sourceProvenance());
            if (scene.aois() != null && !scene.aois().isEmpty()) {
                getChildren().add(aoiRegistry());
            }
            if (renderDelegate == null) {
                getChildren().add(cameraControls());
            }
        }

        if (status == PerceptionStatus.HOLDING) {
            getChildren().add(holdingBanner());
        } else if (status == PerceptionStatus.LOST) {
            getChildren().add(lostOverlay());
        }

        manageRotor(frozen);
        if (renderDelegate == null) {
            drawCanvas();
        }
    }

    private int sourceIndex(String id) {
        if (id == null || scene == null) {
            return 0;
        }
        for (int i = 0; i < scene.sources().size(); i++) {
            if (scene.sources().get(i).id().equals(id)) {
                return i;
            }
        }
        return 0;
    }

    private VBox layerLegend() {
        var panel = panel("Layers");
        for (var layer : scene.layers()) {
            boolean off = hidden.contains(layer.id());
            int idx = sourceIndex(layer.sourceId());
            var swatch = new Region();
            swatch.setMinSize(8, 8);
            swatch.setPrefSize(8, 8);
            swatch.setMaxSize(8, 8);
            if (layer instanceof PointCloudLayer) {
                swatch.setBackground(bgRound(sourceColor(idx, 0.66, 1))); // filled circle
            } else if (layer instanceof OccupancyLayer) {
                swatch.setBackground(bgSquare(sourceColor(idx, 0.66, 0.7))); // filled square
            } else {
                swatch.getStyleClass().add("rc3-perc-swatch-mesh"); // outlined square
            }
            var name = mono(layer.label(), "rc3-perc-item");
            HBox.setHgrow(name, javafx.scene.layout.Priority.ALWAYS);
            name.setMaxWidth(Double.MAX_VALUE);
            var count = mono(layerCount(layer), "rc3-perc-count");
            var row = new HBox(8, swatch, name, count);
            row.getStyleClass().add("rc3-perc-legend-row");
            row.setAlignment(Pos.CENTER_LEFT);
            if (off) {
                row.setOpacity(0.4);
            }
            row.setOnMouseClicked(e -> {
                if (hidden.contains(layer.id())) {
                    hidden.remove(layer.id());
                } else {
                    hidden.add(layer.id());
                }
                if (onToggleLayer != null) {
                    onToggleLayer.accept(layer.id());
                }
                rebuild();
            });
            panel.getChildren().add(row);
        }
        StackPane.setAlignment(panel, Pos.TOP_RIGHT);
        StackPane.setMargin(panel, new Insets(10));
        return panel;
    }

    private VBox sourceProvenance() {
        var panel = panel("Sources");
        var list = new VBox(2);
        for (var s : scene.sources()) {
            boolean stale = s.ageSeconds() > staleAfterSeconds;
            int idx = sourceIndex(s.id());
            var d = new Region();
            d.setMinSize(6, 6);
            d.setPrefSize(6, 6);
            d.setMaxSize(6, 6);
            d.setBackground(bgRound(sourceColor(idx, 0.66, 1)));
            var name = mono(s.label() != null ? s.label() : s.id(), "rc3-perc-item");
            HBox.setHgrow(name, javafx.scene.layout.Priority.ALWAYS);
            name.setMaxWidth(Double.MAX_VALUE);
            var tag = stale ? staleTag("STALE " + ageTag(s.ageSeconds())) : mono("LIVE", "rc3-perc-live");
            var row = new HBox(8, d, name, tag);
            row.setAlignment(Pos.CENTER_LEFT);
            list.getChildren().add(row);
        }
        wrapScroll(panel, list);
        StackPane.setAlignment(panel, Pos.TOP_LEFT);
        StackPane.setMargin(panel, new Insets(10));
        return panel;
    }

    private VBox aoiRegistry() {
        var panel = panel("Areas of interest");
        var list = new VBox(2);
        for (var aoi : scene.aois()) {
            boolean selected = aoi.id().equals(selectedAoiId);
            boolean stale = aoi.ageSeconds() != null && aoi.ageSeconds() > staleAfterSeconds;
            // Registry diamond uses the web's list tones (objective = fg, not the
            // canvas's Ember) — see AOI_TONE in the web organism.
            var diamond = new Region();
            diamond.getStyleClass().addAll("rc3-perc-diamond", "rc3-perc-diamond--" + aoi.kind().name().toLowerCase());
            diamond.setMinSize(7, 7);
            diamond.setPrefSize(7, 7);
            diamond.setMaxSize(7, 7);
            diamond.setRotate(45);
            var name = mono(aoi.label(), "rc3-perc-item");
            HBox.setHgrow(name, javafx.scene.layout.Priority.ALWAYS);
            name.setMaxWidth(Double.MAX_VALUE);
            Label trailing;
            if (stale) {
                trailing = mono(ageTag(aoi.ageSeconds()), "rc3-tone-danger");
            } else if (aoi.confidence() != null) {
                trailing = mono(Math.round(aoi.confidence() * 100) + "%", "rc3-perc-count");
            } else {
                trailing = mono("", "rc3-perc-count");
            }
            var row = new HBox(8, diamond, name, trailing);
            row.getStyleClass().add("rc3-perc-aoi-row");
            if (selected) {
                row.getStyleClass().add("rc3-perc-aoi-row--selected");
            }
            row.setAlignment(Pos.CENTER_LEFT);
            row.setOnMouseClicked(e -> {
                selectedAoiId = selected ? null : aoi.id();
                if (onSelectAoi != null) {
                    onSelectAoi.accept(selectedAoiId);
                }
                rebuild();
            });
            list.getChildren().add(row);
        }
        wrapScroll(panel, list);
        StackPane.setAlignment(panel, Pos.BOTTOM_RIGHT);
        StackPane.setMargin(panel, new Insets(10));
        return panel;
    }

    private VBox cameraControls() {
        var col = new VBox(4);
        // Confine to the bottom-left corner — without this the StackPane stretches
        // the VBox to fill the viewport and it swallows every orbit drag.
        col.setMaxSize(Region.USE_PREF_SIZE, Region.USE_PREF_SIZE);
        col.getChildren().addAll(
            camButton(plusIcon(), () -> zoomBy(1.2)),
            camButton(minusIcon(), () -> zoomBy(1 / 1.2)));
        if (autoRotate) {
            var toggle = camButton(rotating ? pauseIcon() : playIcon(), () -> {
                rotating = !rotating;
                manageRotor(status != PerceptionStatus.LIVE);
                rebuild();
            });
            col.getChildren().add(toggle);
        }
        StackPane.setAlignment(col, Pos.BOTTOM_LEFT);
        StackPane.setMargin(col, new Insets(10));
        return col;
    }

    private Label camButton(Node icon, Runnable action) {
        var b = new Label();
        b.setGraphic(icon);
        b.setAlignment(Pos.CENTER);
        b.getStyleClass().add("rc3-perc-cam-btn");
        b.setMinSize(28, 28);
        b.setPrefSize(28, 28);
        b.setMaxSize(28, 28);
        b.setOnMouseClicked(e -> action.run());
        return b;
    }

    // lucide-style camera-control glyphs (~12px, stroke/fill via .rc3-perc-cam-icon).
    private static Line camLine(double x1, double y1, double x2, double y2) {
        var l = new Line(x1, y1, x2, y2);
        l.getStyleClass().add("rc3-perc-cam-icon");
        l.setStrokeWidth(1.5);
        l.setStrokeLineCap(StrokeLineCap.ROUND);
        return l;
    }

    private Group plusIcon() {
        return new Group(camLine(1, 6, 11, 6), camLine(6, 1, 6, 11));
    }

    private Group minusIcon() {
        return new Group(camLine(1, 6, 11, 6));
    }

    private Group pauseIcon() {
        // lucide Pause — two rounded vertical bars, outlined (stroke, no fill).
        var a = new Rectangle(3, 1.5, 2, 9);
        var b = new Rectangle(7, 1.5, 2, 9);
        for (var r : new Rectangle[] {a, b}) {
            r.setArcWidth(1);
            r.setArcHeight(1);
            r.setStrokeWidth(1.2);
            r.getStyleClass().add("rc3-perc-cam-icon");
        }
        return new Group(a, b);
    }

    private Group playIcon() {
        // lucide Play — an outlined triangle (stroke, no fill).
        var tri = new Polygon(3, 1.5, 10, 6, 3, 10.5);
        tri.setStrokeWidth(1.5);
        tri.setStrokeLineJoin(javafx.scene.shape.StrokeLineJoin.ROUND);
        tri.getStyleClass().add("rc3-perc-cam-icon");
        return new Group(tri);
    }

    private void zoomBy(double factor) {
        zoom = clamp(zoom * factor, ZOOM_MIN, ZOOM_MAX);
        drawCanvas();
    }

    private HBox holdingBanner() {
        double oldest = scene.sources().stream().mapToDouble(PerceptionSource::ageSeconds).max().orElse(0);
        var box = pill(dot(AOI_WARNING, 6),
            mono("Holding · last good " + ageTag(oldest) + " ago", "rc3-perc-status", "rc3-tone-warning"));
        StackPane.setAlignment(box, Pos.CENTER);
        return box;
    }

    private StackPane lostOverlay() {
        var overlay = new StackPane();
        overlay.getStyleClass().add("rc3-video-lost-overlay");
        overlay.setMinSize(0, 0);
        var box = new VBox(8, dot(AOI_DANGER, 6), mono("FEED LOST", "rc3-perc-status", "rc3-tone-danger"));
        box.setAlignment(Pos.CENTER);
        overlay.getChildren().add(box);
        return overlay;
    }

    // ----- Reference renderer -----

    private void manageRotor(boolean frozen) {
        boolean shouldRun = autoRotate && rotating && !frozen && renderDelegate == null;
        if (shouldRun && rotor == null) {
            lastRotate = 0;
            rotor = new AnimationTimer() {
                @Override
                public void handle(long now) {
                    if (lastRotate == 0) {
                        lastRotate = now;
                        return;
                    }
                    if (!dragging) {
                        azimuth += ((now - lastRotate) / 1_000_000_000.0) * 0.25;
                        drawCanvas();
                    }
                    lastRotate = now;
                }
            };
            rotor.start();
        } else if (!shouldRun && rotor != null) {
            rotor.stop();
            rotor = null;
        }
    }

    private void drawCanvas() {
        if (renderDelegate != null || scene == null) {
            return;
        }
        double w = getWidth();
        double h = getHeight();
        if (w <= 0 || h <= 0) {
            return;
        }
        var g = canvas.getGraphicsContext2D();
        g.clearRect(0, 0, w, h);

        var bounds = sceneBounds(scene);
        Vec3 target = bounds[0];
        double radius = Math.max(bounds[1].x(), 1);

        double ca = Math.cos(azimuth);
        double sa = Math.sin(azimuth);
        double ce = Math.cos(elevation);
        double se = Math.sin(elevation);
        double distance = radius * 3.2;
        double focal = Math.min(w, h) * 1.15 * zoom;

        boolean frozen = status != PerceptionStatus.LIVE;

        // 1) Mesh — faint filled faces, painter-ordered.
        for (var layer : scene.layers()) {
            if (!(layer instanceof MeshLayer mesh) || hidden.contains(layer.id())) {
                continue;
            }
            var verts = transform(mesh.vertices(), sourceOf(layer));
            double fresh = layerFreshness(layer);
            var faces = new ArrayList<double[]>(); // {ax,ay,bx,by,cx,cy,depth}
            for (int[] f : mesh.faces()) {
                double[] a = project(verts.get(f[0]), target, ca, sa, ce, se, distance, focal, w, h);
                double[] b = project(verts.get(f[1]), target, ca, sa, ce, se, distance, focal, w, h);
                double[] c = project(verts.get(f[2]), target, ca, sa, ce, se, distance, focal, w, h);
                if (a[2] > 0 && b[2] > 0 && c[2] > 0) {
                    faces.add(new double[] {a[0], a[1], b[0], b[1], c[0], c[1], (a[2] + b[2] + c[2]) / 3});
                }
            }
            faces.sort((m, n) -> Double.compare(n[6], m[6]));
            for (double[] f : faces) {
                g.beginPath();
                g.moveTo(f[0], f[1]);
                g.lineTo(f[2], f[3]);
                g.lineTo(f[4], f[5]);
                g.closePath();
                g.setFill(alpha(FG_MUTED, 0.06 * fresh));
                g.fill();
                g.setStroke(alpha(FG_MUTED, 0.2 * fresh));
                g.setLineWidth(0.5);
                g.stroke();
            }
        }

        // 2) Occupancy voxels — projected squares.
        for (var layer : scene.layers()) {
            if (!(layer instanceof OccupancyLayer occ) || hidden.contains(layer.id())) {
                continue;
            }
            int idx = sourceIndex(layer.sourceId());
            double fresh = layerFreshness(layer);
            var pts = new ArrayList<double[]>();
            for (var v : transform(occ.voxels(), sourceOf(layer))) {
                double[] p = project(v, target, ca, sa, ce, se, distance, focal, w, h);
                if (p[2] > 0) {
                    pts.add(p);
                }
            }
            pts.sort((m, n) -> Double.compare(n[2], m[2]));
            g.setFill(sourceColor(idx, 0.6, 0.55 * fresh));
            for (double[] p : pts) {
                double size = Math.max(2, occ.voxelSize() * p[3]);
                g.fillRect(p[0] - size / 2, p[1] - size / 2, size, size);
            }
        }

        // 3) Points — small dots, decayed by source freshness.
        for (var layer : scene.layers()) {
            if (!(layer instanceof PointCloudLayer cloud) || hidden.contains(layer.id())) {
                continue;
            }
            int idx = sourceIndex(layer.sourceId());
            double fresh = layerFreshness(layer);
            var transformed = transform(cloud.points(), sourceOf(layer));
            var pts = new ArrayList<double[]>(); // {x,y,depth,scale,intensity}
            for (int i = 0; i < transformed.size(); i++) {
                double[] p = project(transformed.get(i), target, ca, sa, ce, se, distance, focal, w, h);
                if (p[2] > 0) {
                    double intensity = cloud.intensity() != null && i < cloud.intensity().length
                        ? cloud.intensity()[i] : 1;
                    pts.add(new double[] {p[0], p[1], p[2], p[3], intensity});
                }
            }
            pts.sort((m, n) -> Double.compare(n[2], m[2]));
            for (double[] p : pts) {
                double a = (0.45 + 0.5 * p[4]) * fresh;
                g.setFill(sourceColor(idx, 0.62 + 0.12 * p[4], a));
                double r = Math.max(0.8, 1.3 * p[3] * 0.04 + 0.8);
                g.fillOval(p[0] - r, p[1] - r, r * 2, r * 2);
            }
        }

        // 4) AOIs — always on top; selected gets an Ember ring.
        if (scene.aois() != null) {
            for (var aoi : scene.aois()) {
                double[] p = project(aoi.position(), target, ca, sa, ce, se, distance, focal, w, h);
                if (p[2] <= 0) {
                    continue;
                }
                boolean selected = aoi.id().equals(selectedAoiId);
                double s = selected ? 7 : 5;
                g.save();
                g.translate(p[0], p[1]);
                g.rotate(45);
                g.setFill(aoiColor(aoi.kind()));
                g.fillRect(-s / 2, -s / 2, s, s);
                g.restore();
                if (selected) {
                    g.setStroke(EMBER);
                    g.setLineWidth(1.5);
                    g.strokeOval(p[0] - 10, p[1] - 10, 20, 20);
                }
            }
        }

        if (frozen) {
            g.setFill(Color.color(0, 0, 0, 0.4));
            g.fillRect(0, 0, w, h);
        }
    }

    private double[] project(Vec3 p, Vec3 t, double ca, double sa, double ce, double se,
        double distance, double focal, double w, double h) {
        double dx = p.x() - t.x();
        double dy = p.y() - t.y();
        double dz = p.z() - t.z();
        double rx = dx * ca - dy * sa;
        double ry = dx * sa + dy * ca;
        double ryy = ry * ce - dz * se;
        double rzz = ry * se + dz * ce;
        double depth = ryy + distance;
        double scale = focal / Math.max(depth, 0.01);
        return new double[] {w / 2 + rx * scale, h / 2 - rzz * scale, depth, scale};
    }

    private PerceptionSource sourceOf(SceneLayer layer) {
        if (layer.sourceId() == null) {
            return null;
        }
        for (var s : scene.sources()) {
            if (s.id().equals(layer.sourceId())) {
                return s;
            }
        }
        return null;
    }

    private double layerFreshness(SceneLayer layer) {
        var s = sourceOf(layer);
        return s == null ? 1 : freshness(s.ageSeconds(), staleAfterSeconds);
    }

    private static double freshness(double ageSeconds, double staleAfter) {
        if (ageSeconds <= staleAfter) {
            return 1;
        }
        double over = (ageSeconds - staleAfter) / (staleAfter * 2);
        return Math.max(0.2, 1 - over * 0.8);
    }

    private static List<Vec3> transform(List<Vec3> points, PerceptionSource src) {
        if (src == null || src.transform() == null) {
            return points;
        }
        var t = src.transform();
        double tx = t.translation().x();
        double ty = t.translation().y();
        double tz = t.translation().z();
        double c = Math.cos(t.yaw());
        double s = Math.sin(t.yaw());
        var out = new ArrayList<Vec3>(points.size());
        for (var p : points) {
            out.add(new Vec3(p.x() * c - p.y() * s + tx, p.x() * s + p.y() * c + ty, p.z() + tz));
        }
        return out;
    }

    private static Vec3[] sceneBounds(PerceptionScene scene) {
        double minX = Double.POSITIVE_INFINITY, minY = Double.POSITIVE_INFINITY, minZ = Double.POSITIVE_INFINITY;
        double maxX = Double.NEGATIVE_INFINITY, maxY = Double.NEGATIVE_INFINITY, maxZ = Double.NEGATIVE_INFINITY;
        var all = new ArrayList<Vec3>();
        for (var layer : scene.layers()) {
            if (layer instanceof PointCloudLayer c) {
                all.addAll(c.points());
            } else if (layer instanceof OccupancyLayer o) {
                all.addAll(o.voxels());
            } else if (layer instanceof MeshLayer m) {
                all.addAll(m.vertices());
            }
        }
        if (scene.aois() != null) {
            for (var a : scene.aois()) {
                all.add(a.position());
            }
        }
        for (var p : all) {
            minX = Math.min(minX, p.x());
            minY = Math.min(minY, p.y());
            minZ = Math.min(minZ, p.z());
            maxX = Math.max(maxX, p.x());
            maxY = Math.max(maxY, p.y());
            maxZ = Math.max(maxZ, p.z());
        }
        if (!Double.isFinite(minX)) {
            return new Vec3[] {new Vec3(0, 0, 0), new Vec3(5, 0, 0)};
        }
        var center = new Vec3((minX + maxX) / 2, (minY + maxY) / 2, (minZ + maxZ) / 2);
        double radius = Math.max(Math.max(maxX - minX, maxY - minY), maxZ - minZ) / 2;
        if (radius <= 0) {
            radius = 5;
        }
        return new Vec3[] {center, new Vec3(radius, 0, 0)};
    }

    private static Color sourceColor(int index, double lightness, double alpha) {
        Color base = SOURCE_BASE[index % SOURCE_BASE.length];
        return base.deriveColor(0, 1, lightness / 0.66, alpha);
    }

    private Color aoiColor(AoiKind kind) {
        return switch (kind) {
            case HAZARD -> AOI_DANGER;
            case INSPECT -> AOI_WARNING;
            case OBJECTIVE -> EMBER;
            case MARKER -> FG_MUTED;
        };
    }

    private static Color alpha(Color c, double a) {
        return new Color(c.getRed(), c.getGreen(), c.getBlue(), Math.max(0, Math.min(1, a)));
    }

    // ----- Small helpers -----

    private static String statusLabel(PerceptionStatus s) {
        return switch (s) {
            case LIVE -> "LIVE";
            case HOLDING -> "HOLDING";
            case LOST -> "FEED LOST";
        };
    }

    private static String statusTone(PerceptionStatus s) {
        return switch (s) {
            case LIVE -> "rc3-tone-success";
            case HOLDING -> "rc3-tone-warning";
            case LOST -> "rc3-tone-danger";
        };
    }

    private static String layerCount(SceneLayer layer) {
        int n = layer instanceof PointCloudLayer c ? c.points().size()
            : layer instanceof OccupancyLayer o ? o.voxels().size()
            : ((MeshLayer) layer).faces().size();
        return n >= 1000 ? String.format(n >= 10000 ? "%.0fk" : "%.1fk", n / 1000.0) : String.valueOf(n);
    }

    private static String ageTag(double seconds) {
        return seconds < 60 ? Math.round(seconds) + "s" : (int) (seconds / 60) + "m";
    }

    private static double clamp(double n, double lo, double hi) {
        return Math.min(hi, Math.max(lo, n));
    }

    private VBox panel(String title) {
        var p = new VBox(2);
        p.getStyleClass().add("rc3-perc-panel");
        p.setMaxSize(Region.USE_PREF_SIZE, Region.USE_PREF_SIZE);
        // JavaFX CSS has no text-transform — uppercase here (web uses `uppercase`).
        p.getChildren().add(mono(title.toUpperCase(), "rc3-perc-panel-title"));
        return p;
    }

    /** STALE tag with a translucent-danger fill — matches the web's danger @18%
     * over transparent (a pure-red wash), not the surface-composited badge token.
     * Set via inline style (beats the stylesheet, which would otherwise recompute
     * the background to transparent). */
    private Label staleTag(String text) {
        var l = mono(text, "rc3-perc-stale");
        l.setStyle("-fx-background-color: rgba(231, 0, 11, 0.18);");
        return l;
    }

    private void wrapScroll(VBox panel, VBox list) {
        var scroll = new ScrollPane(list);
        scroll.getStyleClass().addAll("scroll-pane", "rc3-perc-scroll");
        scroll.setFitToWidth(true);
        scroll.setHbarPolicy(ScrollPane.ScrollBarPolicy.NEVER);
        scroll.setMaxHeight(160);
        panel.getChildren().add(scroll);
    }

    private HBox pill(Node... children) {
        var p = new HBox(6);
        p.getStyleClass().add("rc3-video-pill");
        p.setAlignment(Pos.CENTER_LEFT);
        p.setMaxSize(Region.USE_PREF_SIZE, Region.USE_PREF_SIZE);
        p.getChildren().addAll(children);
        return p;
    }

    private Region dot(Color color, double size) {
        var d = new Region();
        d.setMinSize(size, size);
        d.setPrefSize(size, size);
        d.setMaxSize(size, size);
        d.setBackground(bgRound(color));
        return d;
    }

    /** Circular fill (a proper dot) — programmatic corner radius so it isn't
     * overridden by CSS the way an inline -fx-background-radius would be. */
    private static javafx.scene.layout.Background bgRound(Color c) {
        return new javafx.scene.layout.Background(new javafx.scene.layout.BackgroundFill(
            c, new javafx.scene.layout.CornerRadii(50, true), Insets.EMPTY));
    }

    private static javafx.scene.layout.Background bgSquare(Color c) {
        return new javafx.scene.layout.Background(new javafx.scene.layout.BackgroundFill(
            c, new javafx.scene.layout.CornerRadii(1), Insets.EMPTY));
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
