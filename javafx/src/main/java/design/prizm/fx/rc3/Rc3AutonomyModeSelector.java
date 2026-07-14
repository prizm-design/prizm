package design.prizm.fx.rc3;

import java.util.ArrayList;
import java.util.List;
import java.util.function.Consumer;
import javafx.animation.PauseTransition;
import javafx.geometry.Pos;
import javafx.scene.control.Button;
import javafx.scene.control.ContentDisplay;
import javafx.scene.control.Label;
import javafx.scene.input.KeyCode;
import javafx.scene.layout.HBox;
import javafx.scene.layout.Priority;
import javafx.scene.layout.Region;
import javafx.scene.layout.StackPane;
import javafx.scene.layout.VBox;
import javafx.scene.paint.Color;
import javafx.scene.shape.Polygon;
import javafx.scene.shape.Polyline;
import javafx.scene.shape.StrokeLineCap;
import javafx.scene.shape.StrokeLineJoin;
import javafx.util.Duration;

/**
 * RC3 — Autonomy mode selector (JavaFX).
 *
 * <p>A vertical notched rail with an Ember chevron position pointer on the active
 * rung. Compact by default — the glance state is a single tactical row; the full
 * ladder discloses on demand. Climbing toward more machine authority arms on the
 * first tap and commits on the second within {@value #CONFIRM_WINDOW_MS}ms;
 * descending toward the operator is immediate. Honours behavioural invariant 4.
 *
 * <p>Controlled, like the web: {@code onTransition} fires with the target key and
 * the caller updates {@link #setActiveKey}. Mirrors the React
 * {@code AutonomyModeSelector} ({@code components/rc3/autonomy-mode-selector.tsx}).
 */
public class Rc3AutonomyModeSelector extends VBox {

    public enum Scope {
        PLATFORM,
        GROUP,
        SWARM,
        MISSION
    }

    /** A rung on the ladder, ordered lowest → highest authority-to-machine. */
    public record AutonomyRung(String key, String index, String label, String authority, String blurb) {
        public AutonomyRung(String key, String index, String label, String authority) {
            this(key, index, label, authority, null);
        }
    }

    /** Task-agnostic default ladder; replace with your taxonomy. */
    public static final List<AutonomyRung> DEFAULT_RUNGS = List.of(
        new AutonomyRung("manual", "L0", "MANUAL", "OPERATOR", "Operator commands and acts."),
        new AutonomyRung("supervised", "L1", "SUPERVISED", "OP-IN-LOOP",
            "System acts; operator monitors every step and can take over instantly."),
        new AutonomyRung("delegated", "L2", "DELEGATED", "OP-ON-LOOP",
            "System acts and decides routine steps; operator approves key decisions."),
        new AutonomyRung("autonomous", "L3", "AUTONOMOUS", "SYSTEM AI",
            "System AI acts within mission intent; operator out of the loop."));

    private static final int CONFIRM_WINDOW_MS = 3000;
    private static final double ROW_H = 44;

    private Scope scope = Scope.PLATFORM;
    private String platform;
    private final List<AutonomyRung> rungs = new ArrayList<>(DEFAULT_RUNGS);
    private String activeKey = DEFAULT_RUNGS.get(0).key();
    private Consumer<String> onTransition;
    private boolean consent = true;
    private boolean compact = true;
    private boolean framed = false;

    private String armedKey;
    private boolean expanded = false;
    private final PauseTransition confirmTimer =
        new PauseTransition(Duration.millis(CONFIRM_WINDOW_MS));

    public Rc3AutonomyModeSelector() {
        getStyleClass().add("rc3-autonomy");
        setMaxWidth(384); // max-w-sm
        confirmTimer.setOnFinished(e -> disarm());
        rebuild();
    }

    public void setScope(Scope scope) {
        this.scope = scope == null ? Scope.PLATFORM : scope;
        rebuild();
    }

    public void setPlatform(String platform) {
        this.platform = platform;
        rebuild();
    }

    public void setRungs(List<AutonomyRung> rungs) {
        this.rungs.clear();
        if (rungs != null) {
            this.rungs.addAll(rungs);
        }
        rebuild();
    }

    public void setActiveKey(String activeKey) {
        this.activeKey = activeKey;
        disarm(); // external mode change resets any pending consent
        rebuild();
    }

    public String getActiveKey() {
        return activeKey;
    }

    public void setOnTransition(Consumer<String> onTransition) {
        this.onTransition = onTransition;
    }

    public void setConsent(boolean consent) {
        this.consent = consent;
    }

    public void setCompact(boolean compact) {
        this.compact = compact;
        rebuild();
    }

    public void setFramed(boolean framed) {
        this.framed = framed;
        rebuild();
    }

    private int activeIndex() {
        for (int i = 0; i < rungs.size(); i++) {
            if (rungs.get(i).key().equals(activeKey)) {
                return i;
            }
        }
        return -1;
    }

    private void disarm() {
        confirmTimer.stop();
        armedKey = null;
    }

    private void handleSelect(String toKey, int toIndex) {
        if (isDisabled() || toKey.equals(activeKey)) {
            return;
        }
        boolean increasing = toIndex > activeIndex();
        boolean needsConsent = consent && increasing;
        if (!needsConsent) {
            commit(toKey);
            return;
        }
        if (toKey.equals(armedKey)) {
            commit(toKey);
        } else {
            armedKey = toKey;
            confirmTimer.playFromStart();
            rebuild();
        }
    }

    private void commit(String toKey) {
        disarm();
        if (onTransition != null) {
            onTransition.accept(toKey);
        }
    }

    private void rebuild() {
        getChildren().clear();
        getStyleClass().removeAll("rc3-autonomy--framed", "rc3-autonomy--armed");
        boolean isArmed = armedKey != null;
        if (framed) {
            getStyleClass().add("rc3-autonomy--framed");
            if (isArmed) {
                getStyleClass().add("rc3-autonomy--armed");
            }
        }
        setOpacity(isDisabled() ? 0.5 : 1.0);

        getChildren().add(buildHeader());

        boolean showRail = !compact || expanded;
        if (showRail) {
            getChildren().add(buildRail(!compact));
        } else {
            var active = activeIndex() >= 0 ? rungs.get(activeIndex()) : null;
            if (active != null) {
                getChildren().add(buildActiveRow(active));
            }
        }
    }

    private HBox buildHeader() {
        var header = new HBox();
        header.getStyleClass().add("rc3-autonomy-header");
        header.setAlignment(Pos.CENTER_LEFT);
        header.setSpacing(12);

        var title = new Label("AUTONOMY");
        title.getStyleClass().addAll("rc3-mono", "rc3-autonomy-caption");

        var spacer = new Region();
        HBox.setHgrow(spacer, Priority.ALWAYS);

        // Scope stays muted; the platform name reads in full fg (matches the web —
        // brighter, not bolder). Both share the caption weight.
        var ctx = new HBox(6);
        ctx.setAlignment(Pos.CENTER_LEFT);
        ctx.getChildren().add(caption(scope.name(), "rc3-tone-muted"));
        if (platform != null) {
            ctx.getChildren().add(caption("·", "rc3-tone-subtle"));
            ctx.getChildren().add(caption(platform, "rc3-tone-fg"));
        }

        header.getChildren().addAll(title, spacer, ctx);

        if (compact) {
            var chev = chevronDown();
            if (expanded) {
                chev.setRotate(180);
            }
            var toggle = new Button();
            toggle.setGraphic(chev);
            toggle.setContentDisplay(ContentDisplay.GRAPHIC_ONLY);
            toggle.getStyleClass().add("rc3-autonomy-toggle");
            toggle.setFocusTraversable(false);
            toggle.setOnAction(e -> {
                expanded = !expanded;
                rebuild();
            });
            header.getChildren().add(toggle);
        }
        return header;
    }

    private HBox buildActiveRow(AutonomyRung rung) {
        var row = new HBox(12);
        row.getStyleClass().add("rc3-autonomy-active-row");
        row.setAlignment(Pos.CENTER_LEFT);

        var marker = new StackPane(chevron(false));
        marker.setMinWidth(16);
        marker.setPrefWidth(16);
        marker.setAlignment(Pos.CENTER_LEFT);

        row.getChildren().addAll(marker, index(rung.index(), true), label(rung.label(), true, false),
            authority(rung.authority(), true));
        return row;
    }

    private Region buildRail(boolean topBorder) {
        var rows = new VBox();
        rows.getStyleClass().add("rc3-autonomy-rail");
        if (topBorder) {
            rows.getStyleClass().add("rc3-autonomy-rail--divided");
        }

        // Highest authority at the top, like the web (rungs reversed for display).
        for (int i = rungs.size() - 1; i >= 0; i--) {
            var rung = rungs.get(i);
            rows.getChildren().add(buildRungRow(rung, i));
        }
        return rows;
    }

    private Button buildRungRow(AutonomyRung rung, int index) {
        boolean isActive = rung.key().equals(activeKey);
        boolean isArmed = rung.key().equals(armedKey);

        var markerNode = isActive ? chevron(false) : isArmed ? chevron(true) : scaleTick();
        var markerCell = new StackPane();
        markerCell.getStyleClass().add("rc3-autonomy-marker-cell");
        markerCell.setMinWidth(16);
        markerCell.setPrefWidth(16);
        markerCell.setMaxWidth(16);

        var spine = new Region();
        spine.getStyleClass().add("rc3-autonomy-spine");
        spine.setMinWidth(1);
        spine.setMaxWidth(1);
        spine.setMaxHeight(Double.MAX_VALUE);
        StackPane.setAlignment(spine, Pos.CENTER_LEFT);
        StackPane.setAlignment(markerNode, Pos.CENTER_LEFT);
        markerCell.getChildren().addAll(spine, markerNode);

        var idLabel = index(rung.index(), isActive);
        var lblText = isArmed ? "CONFIRM" : rung.label();
        var lbl = label(lblText, isActive, isArmed);
        var auth = authority(rung.authority(), isActive);

        var content = new HBox(12, markerCell, idLabel, lbl, auth);
        content.setAlignment(Pos.CENTER_LEFT);
        HBox.setHgrow(lbl, Priority.ALWAYS);

        var row = new Button();
        row.getStyleClass().add("rc3-autonomy-rung");
        row.setGraphic(content);
        row.setMaxWidth(Double.MAX_VALUE);
        row.setMinHeight(ROW_H);
        row.setPrefHeight(ROW_H);
        // The active row is display-only. Don't setDisable it (JavaFX dims disabled
        // controls, which would make the active rung read dimmer than the inactive
        // ones — the opposite of the web); make it mouse-transparent instead.
        row.setDisable(isDisabled());
        if (isActive) {
            row.setMouseTransparent(true);
            row.setFocusTraversable(false);
        }
        row.setOnAction(e -> handleSelect(rung.key(), index));
        row.setOnKeyPressed(e -> {
            if (e.getCode() == KeyCode.ESCAPE && armedKey != null) {
                e.consume();
                disarm();
                rebuild();
            }
        });
        return row;
    }

    private Polyline chevronDown() {
        // lucide chevron-down (m6 9 6 6 6-6), scaled to a ~10px glyph.
        var chev = new Polyline(0, 0, 4, 4, 8, 0);
        chev.getStyleClass().add("rc3-autonomy-chevron");
        chev.setStrokeWidth(1.25);
        chev.setStrokeLineCap(StrokeLineCap.ROUND);
        chev.setStrokeLineJoin(StrokeLineJoin.ROUND);
        return chev;
    }

    private Label caption(String text, String toneClass) {
        var l = new Label(text);
        l.getStyleClass().addAll("rc3-mono", "rc3-autonomy-caption", toneClass);
        return l;
    }

    private Label index(String text, boolean active) {
        var l = new Label(text);
        l.getStyleClass().addAll("rc3-mono", "rc3-autonomy-index");
        l.getStyleClass().add(active ? "rc3-tone-fg" : "rc3-tone-muted");
        l.setMinWidth(28);
        return l;
    }

    private Label label(String text, boolean active, boolean armed) {
        var l = new Label(text);
        l.getStyleClass().addAll("rc3-mono", "rc3-autonomy-label");
        if (armed) {
            l.setStyle("-fx-text-fill: " + Rc3.EMBER + ";");
        } else {
            l.getStyleClass().add(active ? "rc3-tone-fg" : "rc3-tone-muted");
        }
        l.setMaxWidth(Double.MAX_VALUE);
        return l;
    }

    private Label authority(String text, boolean active) {
        var l = new Label(text);
        l.getStyleClass().addAll("rc3-mono", "rc3-autonomy-authority");
        l.getStyleClass().add(active ? "rc3-tone-muted" : "rc3-tone-subtle");
        return l;
    }

    private Polygon chevron(boolean ghost) {
        var p = new Polygon(0, 0, 13, 5.5, 0, 11);
        if (ghost) {
            p.setFill(Color.TRANSPARENT);
            p.setStroke(Color.web(Rc3.EMBER));
            p.setStrokeWidth(1.25);
        } else {
            p.setFill(Color.web(Rc3.EMBER));
        }
        return p;
    }

    private Region scaleTick() {
        var t = new Region();
        t.getStyleClass().add("rc3-autonomy-tick");
        t.setMinSize(9, 1);
        t.setPrefSize(9, 1);
        t.setMaxSize(9, 1);
        return t;
    }
}
