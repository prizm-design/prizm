package design.prizm.fx.rc3;

import design.prizm.fx.controls.PrizmButton;
import java.util.List;
import java.util.function.Consumer;
import javafx.animation.FadeTransition;
import javafx.animation.PauseTransition;
import javafx.geometry.Pos;
import javafx.scene.AccessibleRole;
import javafx.scene.Group;
import javafx.scene.control.Button;
import javafx.scene.control.ContentDisplay;
import javafx.scene.layout.HBox;
import javafx.scene.layout.StackPane;
import javafx.scene.shape.Line;
import javafx.scene.shape.StrokeLineCap;
import javafx.util.Duration;

/**
 * RC3 — Safety actions (JavaFX).
 *
 * <p>Honours behavioural invariant 1 (safety reachable in one tap from any live
 * state) and invariant 4 (deliberate confirmation for destructive transitions).
 * The primary action is always visible; the first tap arms it, a second tap
 * within the {@value #CONFIRM_WINDOW_MS}ms window fires. ESCAPE (or the ✕ badge)
 * cancels an armed action.
 *
 * <p>Danger uses the semantic {@code -color-danger} tokens, never the RC3
 * signature colour — destructive state must read as danger, not identity.
 * Mirrors the React {@code SafetyActions} ({@code components/rc3/safety-actions.tsx}).
 */
public class Rc3SafetyActions extends HBox {

    /** The command-context scope; determines which actions are surfaced. */
    public enum Scope {
        PLATFORM,
        GROUP,
        SWARM,
        MISSION
    }

    /** The action that fired. */
    public enum ActionKey {
        E_STOP,
        OVERRIDE,
        RECALL_GROUP,
        RECALL_SWARM,
        ABORT,
        PAUSE,
        SUSPEND
    }

    private record ActionDef(ActionKey key, String label) {}

    private static final int CONFIRM_WINDOW_MS = 3000;

    private Scope scope = Scope.PLATFORM;
    private boolean confirm = true;
    private boolean armed = false;
    private Consumer<ActionKey> onAction;

    private final PauseTransition confirmTimer =
        new PauseTransition(Duration.millis(CONFIRM_WINDOW_MS));
    private FadeTransition pulse;

    public Rc3SafetyActions() {
        this(Scope.PLATFORM);
    }

    public Rc3SafetyActions(Scope scope) {
        this.scope = scope == null ? Scope.PLATFORM : scope;
        getStyleClass().add("rc3-safety-actions");
        setSpacing(8);
        setAlignment(Pos.CENTER_LEFT);
        setAccessibleRole(AccessibleRole.NODE);
        confirmTimer.setOnFinished(e -> disarm());
        rebuild();
    }

    public Scope getScope() {
        return scope;
    }

    public void setScope(Scope scope) {
        this.scope = scope == null ? Scope.PLATFORM : scope;
        disarm();
        rebuild();
    }

    /** When true (default), the primary action requires a second deliberate tap. */
    public void setConfirm(boolean confirm) {
        this.confirm = confirm;
    }

    public void setOnAction(Consumer<ActionKey> onAction) {
        this.onAction = onAction;
    }

    private ActionDef primary() {
        return switch (scope) {
            case PLATFORM -> new ActionDef(ActionKey.E_STOP, "E-Stop");
            case GROUP -> new ActionDef(ActionKey.RECALL_GROUP, "Recall Group");
            case SWARM -> new ActionDef(ActionKey.RECALL_SWARM, "Recall Swarm");
            case MISSION -> new ActionDef(ActionKey.ABORT, "Abort Mission");
        };
    }

    private List<ActionDef> secondary() {
        return switch (scope) {
            case PLATFORM -> List.of(new ActionDef(ActionKey.OVERRIDE, "Override"));
            case GROUP -> List.of(new ActionDef(ActionKey.PAUSE, "Pause"));
            case SWARM -> List.of(new ActionDef(ActionKey.SUSPEND, "Suspend"));
            case MISSION -> List.of(new ActionDef(ActionKey.PAUSE, "Pause"));
        };
    }

    private void rebuild() {
        getChildren().clear();
        setAccessibleText("Safety actions for " + scope.name().toLowerCase());

        for (var s : secondary()) {
            var btn = new PrizmButton(s.label(), PrizmButton.Variant.OUTLINE);
            btn.setSize(PrizmButton.Size.SM);
            btn.setOnAction(e -> fire(s.key()));
            getChildren().add(btn);
        }

        var primary = primary();
        var primaryBtn = new PrizmButton(primary.label(), PrizmButton.Variant.DANGER);
        primaryBtn.setSize(PrizmButton.Size.SM);
        primaryBtn.getStyleClass().add("rc3-safety-primary");
        primaryBtn.setText(primary.label().toUpperCase());

        var cancel = new Button();
        cancel.setGraphic(cancelGlyph());
        cancel.setContentDisplay(ContentDisplay.GRAPHIC_ONLY);
        cancel.setAlignment(Pos.CENTER);
        cancel.getStyleClass().add("rc3-safety-cancel");
        cancel.setVisible(false);
        cancel.setManaged(false);
        cancel.setFocusTraversable(false);
        cancel.setOnAction(e -> disarm());

        var holder = new StackPane(primaryBtn, cancel);
        holder.setAlignment(Pos.TOP_RIGHT);
        StackPane.setMargin(cancel, new javafx.geometry.Insets(-8, -8, 0, 0));

        primaryBtn.setOnAction(e -> handlePrimary(primary));
        primaryBtn.setOnKeyPressed(e -> {
            if (e.getCode() == javafx.scene.input.KeyCode.ESCAPE && armed) {
                e.consume();
                disarm();
            }
        });

        pulse = new FadeTransition(Duration.millis(700), primaryBtn);
        pulse.setFromValue(1.0);
        pulse.setToValue(0.6);
        pulse.setAutoReverse(true);
        pulse.setCycleCount(FadeTransition.INDEFINITE);

        getChildren().add(holder);
        this.armedPrimary = primaryBtn;
        this.armedCancel = cancel;
        this.armedDef = primary;
    }

    private PrizmButton armedPrimary;
    private Button armedCancel;
    private ActionDef armedDef;

    private void handlePrimary(ActionDef def) {
        if (isDisabled()) {
            return;
        }
        if (!confirm) {
            fire(def.key());
            return;
        }
        if (armed) {
            disarm();
            fire(def.key());
        } else {
            arm();
        }
    }

    private void arm() {
        armed = true;
        armedPrimary.getStyleClass().add("rc3-safety-primary--armed");
        armedPrimary.setText(("Confirm · " + armedDef.label()).toUpperCase());
        armedCancel.setVisible(true);
        armedCancel.setManaged(true);
        pulse.playFromStart();
        confirmTimer.playFromStart();
    }

    private void disarm() {
        armed = false;
        confirmTimer.stop();
        if (pulse != null) {
            pulse.stop();
        }
        if (armedPrimary != null) {
            armedPrimary.getStyleClass().remove("rc3-safety-primary--armed");
            armedPrimary.setOpacity(1.0);
            armedPrimary.setText(armedDef.label().toUpperCase());
            armedCancel.setVisible(false);
            armedCancel.setManaged(false);
        }
    }

    private Group cancelGlyph() {
        double s = 6;
        var l1 = new Line(0, 0, s, s);
        var l2 = new Line(0, s, s, 0);
        for (var l : List.of(l1, l2)) {
            l.getStyleClass().add("rc3-safety-cancel-x");
            l.setStrokeLineCap(StrokeLineCap.ROUND);
            l.setStrokeWidth(1.0);
        }
        return new Group(l1, l2);
    }

    private void fire(ActionKey key) {
        if (isDisabled()) {
            return;
        }
        if (onAction != null) {
            onAction.accept(key);
        }
    }
}
