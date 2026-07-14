package design.prizm.fx.gallery;

import design.prizm.fx.PrizmTheme;
import design.prizm.fx.controls.PrizmAlert;
import design.prizm.fx.controls.PrizmAvatar;
import design.prizm.fx.controls.PrizmBadge;
import design.prizm.fx.controls.PrizmButton;
import design.prizm.fx.controls.PrizmCard;
import design.prizm.fx.controls.PrizmCheckbox;
import design.prizm.fx.controls.PrizmContextMenu;
import design.prizm.fx.controls.PrizmDialog;
import design.prizm.fx.controls.PrizmEmptyState;
import design.prizm.fx.controls.PrizmField;
import design.prizm.fx.controls.PrizmGap;
import design.prizm.fx.controls.PrizmGroup;
import design.prizm.fx.controls.PrizmInput;
import design.prizm.fx.controls.PrizmMenu;
import design.prizm.fx.controls.PrizmPopover;
import design.prizm.fx.controls.PrizmProgress;
import design.prizm.fx.controls.PrizmSpinner;
import design.prizm.fx.controls.PrizmTable;
import design.prizm.fx.controls.PrizmTooltip;
import design.prizm.fx.controls.PrizmLabel;
import design.prizm.fx.controls.PrizmRadioGroup;
import design.prizm.fx.controls.PrizmSelect;
import design.prizm.fx.controls.PrizmSeparator;
import design.prizm.fx.controls.PrizmSheet;
import design.prizm.fx.controls.PrizmSlider;
import design.prizm.fx.controls.PrizmStack;
import design.prizm.fx.controls.PrizmSwitch;
import design.prizm.fx.controls.PrizmTextarea;
import design.prizm.fx.controls.PrizmToast;
import design.prizm.fx.controls.PrizmToaster;
import design.prizm.fx.controls.PrizmBreadcrumb;
import design.prizm.fx.controls.PrizmCalendar;
import design.prizm.fx.controls.PrizmCode;
import design.prizm.fx.controls.PrizmCombobox;
import design.prizm.fx.controls.PrizmCommand;
import design.prizm.fx.controls.PrizmFrame;
import design.prizm.fx.controls.PrizmHeading;
import design.prizm.fx.controls.PrizmHoverCard;
import design.prizm.fx.controls.PrizmKbd;
import design.prizm.fx.controls.PrizmLink;
import design.prizm.fx.controls.PrizmNavigationMenu;
import design.prizm.fx.controls.PrizmPagination;
import design.prizm.fx.controls.PrizmProse;
import design.prizm.fx.controls.PrizmSkeleton;
import design.prizm.fx.controls.PrizmTabs;
import design.prizm.fx.controls.PrizmText;
import design.prizm.fx.rc3.Rc3AutonomyModeSelector;
import design.prizm.fx.rc3.Rc3CommsHealthStrip;
import design.prizm.fx.rc3.Rc3ControllerInterface;
import design.prizm.fx.rc3.Rc3Indicators;
import design.prizm.fx.rc3.Rc3PerceptionView;
import design.prizm.fx.rc3.Rc3PlatformDetail;
import design.prizm.fx.rc3.Rc3PlatformRoster;
import design.prizm.fx.rc3.Rc3SafetyActions;
import design.prizm.fx.rc3.Rc3TelemetryHud;
import design.prizm.fx.rc3.Rc3VideoTile;
import java.util.ArrayList;
import java.util.List;
import java.util.Random;
import javafx.application.Application;
import javafx.beans.property.ReadOnlyStringWrapper;
import javafx.geometry.Insets;
import javafx.geometry.Orientation;
import javafx.geometry.Pos;
import javafx.geometry.Side;
import javafx.scene.Node;
import javafx.scene.Scene;
import javafx.scene.control.CheckBox;
import javafx.scene.control.Label;
import javafx.scene.control.MenuItem;
import javafx.scene.control.Tab;
import javafx.scene.control.ScrollPane;
import javafx.scene.control.SeparatorMenuItem;
import javafx.scene.control.TableColumn;
import javafx.scene.layout.FlowPane;
import javafx.scene.layout.HBox;
import javafx.scene.layout.Priority;
import javafx.scene.layout.Region;
import javafx.scene.layout.StackPane;
import javafx.scene.layout.VBox;
import javafx.stage.Stage;

/**
 * PRIZM JavaFX gallery — a runnable showcase of every JavaFX-ready control, in
 * all variants and states, with live theme (dark/light) and extension-pack
 * (RC3 Ember) toggles.
 *
 * <p>Because the docs site can't render JavaFX, this gallery is the canonical
 * *visual* reference for the library. Add a {@link Section} to {@link #sections()}
 * as each control ships — that single edit is all the gallery needs.
 *
 * <pre>
 *   gradle run        launch from source (developer)
 *   gradle jpackage   build a self-contained native app (see build.gradle.kts)
 * </pre>
 */
public class PrizmGallery extends Application {

    private PrizmTheme.Mode mode = PrizmTheme.Mode.DARK;
    private PrizmTheme.Pack pack = PrizmTheme.Pack.NONE;
    private Scene scene;
    private StackPane rootStack;
    private PrizmToaster toaster;

    /** Registry of gallery sections — one entry per JavaFX-ready control. */
    private List<Section> sections() {
        return List.of(
            new Section("Button", "Six variants, four sizes, plus disabled.", buttons()),
            new Section("Input", "Prompt, filled, and disabled.", inputs()),
            new Section("Textarea", "Multi-line input.", textarea()),
            new Section("Checkbox", "Selected, unselected, disabled.", checkboxes()),
            new Section("Switch", "On, off, disabled.", switches()),
            new Section("Radio Group", "Single-select group.", radios()),
            new Section("Select", "Dropdown selection.", select()),
            new Section("Slider", "Range input.", slider()),
            new Section("Label", "Form label paired with a control.", labels()),
            new Section("Field", "Label, control, hint, and error.", fields()),
            new Section("Card", "Surface container with title, body, and a content slot.", cards()),
            new Section("Separator", "Horizontal and vertical dividers.", separators()),
            new Section("Stack", "Vertical spacing primitive (gap MD).", stack()),
            new Section("Group", "Horizontal grouping (gap XS).", group()),
            new Section("Alert", "Default plus four status variants.", alerts()),
            new Section("Spinner", "Indeterminate loading, four sizes.", spinners()),
            new Section("Progress", "Determinate progress bar.", progress()),
            new Section("Empty State", "Title, description, and an action.", emptyState()),
            new Section("Badge", "Seven variants.", badges()),
            new Section("Avatar", "Initials fallback, four sizes.", avatars()),
            new Section("Table", "Data-driven table, three columns.", table()),
            new Section("Tooltip", "Hover label on a control.", tooltip()),
            new Section("Menu", "Dropdown action menu.", menu()),
            new Section("Context Menu", "Right-click a target.", contextMenu()),
            new Section("Popover", "Anchored floating panel.", popover()),
            new Section("Dialog", "Modal dialog for a focused task.", dialog()),
            new Section("Sheet", "Edge-anchored sliding panel — opens from any side.", sheet()),
            new Section("Toast", "Transient notification (bottom-right, auto-dismiss).", toast()),
            new Section("Heading", "Six sizes; semibold, tight tracking.", headings()),
            new Section("Text", "Size, tone, and weight presets.", texts()),
            new Section("Code", "Inline monospace token.", code()),
            new Section("Kbd", "Keyboard key indicator.", kbd()),
            new Section("Prose", "Reading-width stacked text.", prose()),
            new Section("Link", "Accent hyperlink.", link()),
            new Section("Combobox", "Editable, searchable select.", combobox()),
            new Section("Tabs", "Tabbed sections.", tabs()),
            new Section("Frame", "Max-width padded container.", frame()),
            new Section("Skeleton", "Pulsing loading placeholders.", skeleton()),
            new Section("Breadcrumb", "Ancestor trail + current page.", breadcrumb()),
            new Section("Pagination", "Previous / pages / next.", pagination()),
            new Section("Navigation Menu", "Top menu bar with dropdowns.", navigationMenu()),
            new Section("Hover Card", "Floating preview on hover.", hoverCard()),
            new Section("Calendar", "Month grid with selection.", calendar()),
            new Section("Command", "⌘K command palette.", command()),
            // RC3 (Robotics & Autonomy) extension-pack organisms. Toggle the RC3
            // pack in the toolbar to see the Ember accent; identity marks are Ember
            // regardless (inlined, like the web).
            new Section("RC3 · Safety actions", "Two-tap arm/confirm; per-scope actions.", rc3SafetyActions()),
            new Section("RC3 · Comms / health strip", "Platform and aggregated link state.", rc3CommsHealthStrip()),
            new Section("RC3 · Autonomy mode selector", "Notched rail; arm on climb, immediate on descent.", rc3AutonomyModeSelector()),
            new Section("RC3 · Video tile", "Sensor-feed frame with telemetry burn-in.", rc3VideoTile()),
            new Section("RC3 · Telemetry HUD", "Domain-aware readout; strip posture.", rc3TelemetryHud()),
            new Section("RC3 · Controller interface", "Read-only sticks, triggers, buttons.", rc3ControllerInterface()),
            new Section("RC3 · Platform roster", "Selectable list; Ember-marked active row.", rc3PlatformRoster()),
            new Section("RC3 · Platform detail", "Master-detail companion card.", rc3PlatformDetail()),
            new Section("RC3 · Perception view", "Live 3D window into the swarm's map; reference renderer.", rc3PerceptionView()));
    }

    @Override
    public void start(Stage stage) {
        var content = new VBox(28);
        content.setPadding(new Insets(28));
        for (var section : sections()) {
            content.getChildren().add(sectionView(section));
        }

        var scroll = new ScrollPane(content);
        scroll.setFitToWidth(true);

        var root = new VBox(toolbar(), scroll);
        root.getStyleClass().add("gallery-root");
        VBox.setVgrow(scroll, Priority.ALWAYS);

        // Wrap in a StackPane so PrizmSheet has a full-size host to overlay.
        rootStack = new StackPane(root);
        scene = new Scene(rootStack, 720, 760);
        retheme();
        stage.setTitle("PRIZM JavaFX — gallery");
        stage.setScene(scene);
        stage.show();
    }

    private void launchAppShell() {
        var shell = new design.prizm.fx.templates.PrizmAppShell();
        shell.setPack(pack);
        var shellScene = new Scene(shell, 1180, 760);
        PrizmTheme.apply(shellScene, mode, pack);
        var stage = new Stage();
        stage.setTitle("PRIZM JavaFX — C3 App Shell");
        stage.setScene(shellScene);
        stage.show();
    }

    private Region toolbar() {
        var title = new Label("PRIZM JavaFX");
        title.getStyleClass().add("gallery-title");

        var dark = new CheckBox("Dark");
        dark.setSelected(true);
        dark.setOnAction(e -> {
            mode = dark.isSelected() ? PrizmTheme.Mode.DARK : PrizmTheme.Mode.LIGHT;
            retheme();
        });

        var rc3 = new CheckBox("RC3 pack (Ember)");
        rc3.setOnAction(e -> {
            pack = rc3.isSelected() ? PrizmTheme.Pack.RC3 : PrizmTheme.Pack.NONE;
            retheme();
        });

        var launch = new PrizmButton("Launch App Shell", PrizmButton.Variant.OUTLINE);
        launch.setSize(PrizmButton.Size.SM);
        launch.setOnAction(e -> launchAppShell());

        var spacer = new Region();
        HBox.setHgrow(spacer, Priority.ALWAYS);

        var bar = new HBox(16, title, spacer, launch, dark, rc3);
        bar.setAlignment(Pos.CENTER_LEFT);
        bar.setPadding(new Insets(14, 20, 14, 20));
        bar.getStyleClass().add("gallery-toolbar");
        return bar;
    }

    private Node sectionView(Section section) {
        var heading = new Label(section.title());
        heading.getStyleClass().add("gallery-heading");
        var head = new VBox(2, heading, caption(section.blurb()));
        return new VBox(14, head, section.content());
    }

    private Node buttons() {
        var variants = new FlowPane(8, 8,
            new PrizmButton("Solid", PrizmButton.Variant.SOLID),
            new PrizmButton("Outline", PrizmButton.Variant.OUTLINE),
            new PrizmButton("Ghost", PrizmButton.Variant.GHOST),
            new PrizmButton("Subtle", PrizmButton.Variant.SUBTLE),
            new PrizmButton("Danger", PrizmButton.Variant.DANGER),
            new PrizmButton("Link", PrizmButton.Variant.LINK));

        var sm = new PrizmButton("Small", PrizmButton.Variant.SOLID);
        sm.setSize(PrizmButton.Size.SM);
        var md = new PrizmButton("Medium", PrizmButton.Variant.SOLID);
        var lg = new PrizmButton("Large", PrizmButton.Variant.SOLID);
        lg.setSize(PrizmButton.Size.LG);
        var sizes = new FlowPane(8, 8, sm, md, lg);

        var disabled = new PrizmButton("Disabled", PrizmButton.Variant.SOLID);
        disabled.setDisable(true);

        return new VBox(10,
            labelled("Variants", variants),
            labelled("Sizes", sizes),
            labelled("States", new FlowPane(8, 8, disabled)));
    }

    private Node cards() {
        var card = new PrizmCard("Mission", "Sortie 04 — nominal. Two platforms on task.");
        var acknowledge = new PrizmButton("Acknowledge", PrizmButton.Variant.SOLID);
        acknowledge.setSize(PrizmButton.Size.SM);
        var details = new PrizmButton("Details", PrizmButton.Variant.OUTLINE);
        details.setSize(PrizmButton.Size.SM);
        card.addContent(new HBox(8, acknowledge, details));
        card.setMaxWidth(360);
        return card;
    }

    private Node separators() {
        var horizontal = new VBox(8,
            new Label("Comms"),
            new PrizmSeparator(),
            new Label("Telemetry"));
        horizontal.setMaxWidth(220);

        var vertical = new PrizmSeparator(Orientation.VERTICAL);
        var withVertical = new HBox(12, new Label("UGV-04"), vertical, new Label("Patrol"));
        withVertical.setAlignment(Pos.CENTER_LEFT);
        withVertical.setPrefHeight(24);

        return new VBox(16, labelled("Horizontal", horizontal), labelled("Vertical", withVertical));
    }

    private Node stack() {
        var stack = new PrizmStack(PrizmGap.MD,
            new PrizmCard("Sortie 04", "Two platforms on task."),
            new PrizmCard("Sortie 05", "Standby."));
        stack.setMaxWidth(320);
        return stack;
    }

    private Node group() {
        var save = new PrizmButton("Save", PrizmButton.Variant.SOLID);
        save.setSize(PrizmButton.Size.SM);
        var cancel = new PrizmButton("Cancel", PrizmButton.Variant.OUTLINE);
        cancel.setSize(PrizmButton.Size.SM);
        var reset = new PrizmButton("Reset", PrizmButton.Variant.GHOST);
        reset.setSize(PrizmButton.Size.SM);
        return new PrizmGroup(PrizmGap.XS, save, cancel, reset);
    }

    private Node alerts() {
        var box = new VBox(10,
            new PrizmAlert(PrizmAlert.Variant.DEFAULT, "Heads up", "Sortie window opens in 10 minutes."),
            new PrizmAlert(PrizmAlert.Variant.INFO, "Link established", "UGV-04 telemetry is live."),
            new PrizmAlert(PrizmAlert.Variant.SUCCESS, "Task complete", "Patrol leg logged."),
            new PrizmAlert(PrizmAlert.Variant.WARNING, "Low battery", "UAV-11 at 18% — RTB advised."),
            new PrizmAlert(PrizmAlert.Variant.DANGER, "Link lost", "No contact with USV-02 for 45s."));
        box.setMaxWidth(420);
        return box;
    }

    private Node spinners() {
        var sm = new PrizmSpinner(PrizmSpinner.Size.SM);
        var md = new PrizmSpinner(PrizmSpinner.Size.MD);
        var lg = new PrizmSpinner(PrizmSpinner.Size.LG);
        var xl = new PrizmSpinner(PrizmSpinner.Size.XL);
        var row = new HBox(20, sm, md, lg, xl);
        row.setAlignment(Pos.CENTER_LEFT);
        return row;
    }

    private Node progress() {
        var p = new PrizmProgress(0.6);
        p.setPrefWidth(280);
        p.setMaxWidth(280);
        var indeterminate = new PrizmProgress();
        indeterminate.setProgress(PrizmProgress.INDETERMINATE_PROGRESS);
        indeterminate.setPrefWidth(280);
        indeterminate.setMaxWidth(280);
        return new VBox(12, labelled("60%", p), labelled("Indeterminate", indeterminate));
    }

    private Node emptyState() {
        var empty = new PrizmEmptyState("No active tasks");
        empty.setDescription("Tasks assigned to this watch will appear here.");
        var add = new PrizmButton("Assign task", PrizmButton.Variant.SOLID);
        add.setSize(PrizmButton.Size.SM);
        empty.setAction(add);
        empty.setMaxWidth(360);
        return empty;
    }

    private Node badges() {
        return new FlowPane(8, 8,
            new PrizmBadge("Solid", PrizmBadge.Variant.SOLID),
            new PrizmBadge("Outline", PrizmBadge.Variant.OUTLINE),
            new PrizmBadge("Subtle", PrizmBadge.Variant.SUBTLE),
            new PrizmBadge("Online", PrizmBadge.Variant.SUCCESS),
            new PrizmBadge("Degraded", PrizmBadge.Variant.WARNING),
            new PrizmBadge("Lost", PrizmBadge.Variant.DANGER),
            new PrizmBadge("Info", PrizmBadge.Variant.INFO));
    }

    private Node avatars() {
        var sm = new PrizmAvatar("AL", PrizmAvatar.Size.SM);
        var md = new PrizmAvatar("AL", PrizmAvatar.Size.MD);
        var lg = new PrizmAvatar("AL", PrizmAvatar.Size.LG);
        var xl = new PrizmAvatar("AL", PrizmAvatar.Size.XL);
        var row = new HBox(16, sm, md, lg, xl);
        row.setAlignment(Pos.CENTER_LEFT);
        return row;
    }

    private Node table() {
        var table = new PrizmTable<Platform>();
        table.getItems().addAll(
            new Platform("UGV-04", "Ground", "Patrol"),
            new Platform("UAV-11", "Aerial", "Loiter"),
            new Platform("USV-02", "Surface", "RTB"));

        var id = new TableColumn<Platform, String>("Platform");
        id.setCellValueFactory(c -> new ReadOnlyStringWrapper(c.getValue().id()));
        var cls = new TableColumn<Platform, String>("Class");
        cls.setCellValueFactory(c -> new ReadOnlyStringWrapper(c.getValue().cls()));
        var status = new TableColumn<Platform, String>("Status");
        status.setCellValueFactory(c -> new ReadOnlyStringWrapper(c.getValue().status()));

        table.getColumns().add(id);
        table.getColumns().add(cls);
        table.getColumns().add(status);
        table.setColumnResizePolicy(javafx.scene.control.TableView.CONSTRAINED_RESIZE_POLICY_FLEX_LAST_COLUMN);
        table.setPrefSize(420, 168);
        table.setMaxWidth(420);
        return table;
    }

    private record Platform(String id, String cls, String status) {}

    // ----- RC3 extension-pack organisms -----

    private Node rc3SafetyActions() {
        var platform = new Rc3SafetyActions(Rc3SafetyActions.Scope.PLATFORM);
        var swarm = new Rc3SafetyActions(Rc3SafetyActions.Scope.SWARM);
        var col = new VBox(16, platform, swarm);
        col.setAlignment(Pos.CENTER_LEFT);
        return col;
    }

    private Node rc3CommsHealthStrip() {
        var single = new Rc3CommsHealthStrip();
        single.setPlatform(new Rc3CommsHealthStrip.PlatformLink(
            "UGV-04", 4, 84, true, Rc3CommsHealthStrip.LinkStatus.GOOD));

        var agg = new Rc3CommsHealthStrip();
        agg.setScope(Rc3CommsHealthStrip.Scope.SWARM);
        agg.setPlatforms(List.of(
            new Rc3CommsHealthStrip.PlatformLink("A", 4, null, false, Rc3CommsHealthStrip.LinkStatus.GOOD),
            new Rc3CommsHealthStrip.PlatformLink("B", 3, null, false, Rc3CommsHealthStrip.LinkStatus.GOOD),
            new Rc3CommsHealthStrip.PlatformLink("C", 2, null, false, Rc3CommsHealthStrip.LinkStatus.DEGRADED),
            new Rc3CommsHealthStrip.PlatformLink("D", 0, null, false, Rc3CommsHealthStrip.LinkStatus.LOST)));

        var col = new VBox(16, single, agg);
        col.setAlignment(Pos.CENTER_LEFT);
        return col;
    }

    private Node rc3AutonomyModeSelector() {
        // Full rail (compact off) — the whole ladder stays visible.
        var full = new Rc3AutonomyModeSelector();
        full.setPlatform("UGV-04");
        full.setFramed(true);
        full.setCompact(false);
        full.setActiveKey("supervised");
        full.setOnTransition(full::setActiveKey); // controlled, like the web demo wrapper

        // Compact (default) — a single glance row; the chevron discloses the rail.
        var compact = new Rc3AutonomyModeSelector();
        compact.setPlatform("UGV-04");
        compact.setFramed(true);
        compact.setActiveKey("supervised");
        compact.setOnTransition(compact::setActiveKey);

        var col = new VBox(16, labelledExample("Compact (default)", compact),
            labelledExample("Full rail", full));
        col.setAlignment(Pos.TOP_LEFT);
        return col;
    }

    private Node labelledExample(String caption, Node example) {
        var label = new PrizmText(caption).setSize(PrizmText.Size.XS).setTone(PrizmText.Tone.MUTED);
        var box = new VBox(6, label, example);
        box.setAlignment(Pos.TOP_LEFT);
        return box;
    }

    private Node rc3VideoTile() {
        // Four feed states, mirroring the web docs fixtures.
        var live = new Rc3VideoTile("FPV · UGV-04", Rc3VideoTile.FeedStatus.LIVE);
        live.setContent(videoPlaceholder("FPV · UGV-04", Rc3VideoTile.FeedStatus.LIVE));
        live.setCoordinates("01°20'58\"N 103°49'13\"E");
        live.setBearing(48);
        live.setRange(1200.0);
        live.setZoom(2);
        live.setSensor(Rc3VideoTile.SensorMode.EO);

        var degraded = new Rc3VideoTile("GIMBAL · UAV-09", Rc3VideoTile.FeedStatus.DEGRADED);
        degraded.setContent(videoPlaceholder("GIMBAL · UAV-09", Rc3VideoTile.FeedStatus.DEGRADED));
        degraded.setSensor(Rc3VideoTile.SensorMode.IR);
        degraded.setZoom(4);

        var minimal = new Rc3VideoTile("WIDE · UGV-05", Rc3VideoTile.FeedStatus.LIVE);
        minimal.setContent(videoPlaceholder("WIDE · UGV-05", Rc3VideoTile.FeedStatus.LIVE));

        var lost = new Rc3VideoTile("IR · UGV-07", Rc3VideoTile.FeedStatus.LOST);
        lost.setContent(videoPlaceholder("IR · UGV-07", Rc3VideoTile.FeedStatus.LOST));

        var col = new VBox(16,
            labelledExample("Live · full telemetry", sizedTile(live)),
            labelledExample("Degraded · sensor only", sizedTile(degraded)),
            labelledExample("Live · minimal", sizedTile(minimal)),
            labelledExample("Lost · no signal", sizedTile(lost)));
        col.setAlignment(Pos.TOP_LEFT);
        return col;
    }

    private Node sizedTile(Rc3VideoTile tile) {
        tile.setPrefWidth(440);
        tile.setMaxWidth(440);
        return tile;
    }

    private Node videoPlaceholder(String source, Rc3VideoTile.FeedStatus status) {
        var pane = new javafx.scene.layout.StackPane();
        pane.getStyleClass().add("rc3-video-placeholder");
        if (status != Rc3VideoTile.FeedStatus.LOST) {
            var id = source.contains("·") ? source.substring(source.lastIndexOf("·") + 1).trim() : source;
            var label = new Label("VIDEO FEED · " + id);
            label.getStyleClass().addAll("rc3-mono", "rc3-video-placeholder-label");
            pane.getChildren().add(label);
        }
        return pane;
    }

    private Node rc3TelemetryHud() {
        // Strip posture — inline row.
        var strip = new Rc3TelemetryHud();
        strip.setPlatform("UAV-11");
        strip.setDomain(Rc3TelemetryHud.UxvDomain.AERIAL);
        strip.setSpeed(18.4, Rc3TelemetryHud.SpeedUnit.M_S);
        strip.setVertical(120.0, Rc3TelemetryHud.VerticalUnit.M, "AGL");
        strip.setHeading(275);
        strip.setBattery(64);

        // Frame posture — four-edge overlay around a centred viewport.
        var frame = new Rc3TelemetryHud();
        frame.setMode(Rc3TelemetryHud.HudMode.FRAME);
        frame.setDomain(Rc3TelemetryHud.UxvDomain.AERIAL);
        frame.setPlatform("UAV-11");
        frame.setContent(frameViewport());
        frame.setSpeed(18.4, Rc3TelemetryHud.SpeedUnit.M_S);
        frame.setVertical(120.0, Rc3TelemetryHud.VerticalUnit.M, "AGL");
        frame.setVerticalRate(2.5);
        frame.setHeading(275);
        frame.setBattery(64);
        frame.setRoll(-4.0);
        frame.setPitch(3.0);
        frame.setMinSize(440, 260);
        frame.setPrefSize(440, 260);
        frame.setMaxSize(440, 260);

        var col = new VBox(16, labelledExample("Strip", strip), labelledExample("Frame", frame));
        col.setAlignment(Pos.TOP_LEFT);
        return col;
    }

    private Node frameViewport() {
        var bg = new Region();
        bg.getStyleClass().add("rc3-frame-viewport");

        // Docs-only map decoration behind the HUD: a faint grid + a dashed route.
        var canvas = new javafx.scene.canvas.Canvas(440, 260);
        var g = canvas.getGraphicsContext2D();
        g.setLineWidth(1);
        g.setStroke(javafx.scene.paint.Color.web("#ffffff", 0.05));
        for (double x = 0; x <= 440; x += 24) {
            g.strokeLine(x, 0, x, 260);
        }
        for (double y = 0; y <= 260; y += 24) {
            g.strokeLine(0, y, 440, y);
        }
        g.setStroke(javafx.scene.paint.Color.web("#94a3b8", 0.45));
        g.setLineDashes(4, 4);
        g.beginPath();
        g.moveTo(30, 210);
        g.bezierCurveTo(150, 120, 300, 190, 410, 80);
        g.stroke();

        return new javafx.scene.layout.StackPane(bg, canvas);
    }

    private Node rc3ControllerInterface() {
        var ctrl = new Rc3ControllerInterface();
        ctrl.setPlatform("UGV-04");
        ctrl.setLeftStick(new Rc3ControllerInterface.StickState(0, 0), "DRIVE");
        ctrl.setRightStick(new Rc3ControllerInterface.StickState(0, 0), "GIMBAL");
        ctrl.setLeftTrigger(0.0, "ZOOM");
        ctrl.setRightTrigger(0.0, "FOCUS");
        ctrl.setButtons(List.of(
            new Rc3ControllerInterface.ControllerButton("a", "A", false, "HORN"),
            new Rc3ControllerInterface.ControllerButton("b", "B", true, "REC"),
            new Rc3ControllerInterface.ControllerButton("x", "X", false, "MARK"),
            new Rc3ControllerInterface.ControllerButton("y", "Y", false, "RTL")));

        // Animate the sticks + triggers like the web's live demo (the component is
        // read-only; here the gallery plays the role of the consumer's input feed).
        final double[] t = {0};
        var tl = new javafx.animation.Timeline(new javafx.animation.KeyFrame(
            javafx.util.Duration.millis(50), e -> {
                t[0] += 0.06;
                double lx = Math.sin(t[0]);
                double ly = Math.sin(t[0] * 0.8 + 1.2) * 0.85;
                double rx = Math.cos(t[0] * 1.1) * 0.7;
                double ry = Math.sin(t[0] * 1.3) * 0.6;
                double lt = (Math.sin(t[0] * 1.4) + 1) / 2;
                double rt = (Math.sin(t[0] * 0.9 + 2) + 1) / 2;
                ctrl.updateInputs(
                    new Rc3ControllerInterface.StickState(lx, ly),
                    new Rc3ControllerInterface.StickState(rx, ry),
                    lt, rt);
            }));
        tl.setCycleCount(javafx.animation.Timeline.INDEFINITE);
        tl.play();
        return ctrl;
    }

    private Node rc3PlatformRoster() {
        var roster = new Rc3PlatformRoster();
        roster.setLabel("ECHELON BRAVO");
        roster.setActiveId("UGV-04");
        roster.setPlatforms(List.of(
            new Rc3PlatformRoster.RosterEntry("UGV-04", Rc3PlatformRoster.LinkStatus.GOOD, 4, 84, "SUPERVISED", "UGV"),
            new Rc3PlatformRoster.RosterEntry("UAV-11", Rc3PlatformRoster.LinkStatus.GOOD, 3, 61, "DELEGATED", "UAV"),
            new Rc3PlatformRoster.RosterEntry("USV-02", Rc3PlatformRoster.LinkStatus.DEGRADED, 2, 45, "MANUAL", "USV"),
            new Rc3PlatformRoster.RosterEntry("UUV-07", Rc3PlatformRoster.LinkStatus.LOST, 0, 12, null, "UUV")));
        roster.setOnSelect(roster::setActiveId);
        return roster;
    }

    private Node rc3PlatformDetail() {
        // Strike platform — the extras compose the indicator alphabet (PipCount,
        // StateText, StateDot) so payload / sensor state reads as instruments.
        var detail = new Rc3PlatformDetail("UAV-07");
        detail.setKlass("UAV");
        detail.setDomain(Rc3PlatformDetail.UxvDomain.AERIAL);
        detail.setLink(Rc3PlatformDetail.LinkStatus.GOOD);
        detail.setSignal(4);
        detail.setBattery(72);
        detail.setAutonomy("DELEGATED");
        detail.setPosition("01°22'14\"N 103°50'40\"E");
        detail.setHeading(215);
        detail.setSpeed(28.0, "kn");
        detail.setVertical(3500.0, "ft", "AGL");
        detail.setMission(new Rc3PlatformDetail.MissionStep(2, 5, "STRIKE A"));
        detail.setOperator("CPT NG");
        detail.setExtras(List.of(
            new Rc3PlatformDetail.Extra("Payload", "Munition",
                Rc3Indicators.pipCount(4, 4, "AGM-114", Rc3Indicators.Tone.SUCCESS)),
            new Rc3PlatformDetail.Extra("Payload", "Status",
                Rc3Indicators.stateText(Rc3Indicators.Tone.DANGER, "ARMED")),
            new Rc3PlatformDetail.Extra("Sensors", "EO/IR",
                Rc3Indicators.stateDot(Rc3Indicators.DotState.ACTIVE, "Tracking")),
            new Rc3PlatformDetail.Extra("Sensors", "Radar",
                Rc3Indicators.stateDot(Rc3Indicators.DotState.STANDBY, "Standby"))));
        detail.setLastContact("0.3 s ago");
        return detail;
    }

    // ----- Perception view sample scene (mid-rise building mapped by a swarm) -----

    private static final double PV_HX = 9, PV_HY = 7, PV_H = 30;
    private static final int PV_FLOORS = 6, PV_BAYS_X = 5, PV_BAYS_Y = 4;
    private static final double PV_WIN = 0.2;

    private Node rc3PerceptionView() {
        var view = new Rc3PerceptionView();
        view.setScene(buildPerceptionScene());
        view.setAutoRotate(true);
        view.setSelectedAoiId("smoke");
        view.setPrefSize(560, 360);
        view.setMaxWidth(560);
        return view;
    }

    private Rc3PerceptionView.PerceptionScene buildPerceptionScene() {
        var rand = new Random(0x5eedL);
        var structure = buildStructure();
        var aerial = new Rc3PerceptionView.PointCloudLayer(
            "aerial-cloud", "Aerial cloud", "UAV-09", buildAerialPoints(rand));
        var ground = new Rc3PerceptionView.PointCloudLayer(
            "ground-cloud", "Ground cloud", "UGV-04", buildGroundPoints(rand));
        var occupancy = new Rc3PerceptionView.OccupancyLayer(
            "floor-occupancy", "Floor plan", "UGV-05", buildOccupancy(rand), 1.1);

        // Static swarm ages: a mix of live + stale so provenance shows both states.
        var sources = List.of(
            new Rc3PerceptionView.PerceptionSource("UAV-09", 0.3),
            new Rc3PerceptionView.PerceptionSource("UAV-11", 0.6),
            new Rc3PerceptionView.PerceptionSource("UAV-14", 4.4),
            new Rc3PerceptionView.PerceptionSource("UGV-04", 0.2),
            new Rc3PerceptionView.PerceptionSource("UGV-05", 0.5),
            new Rc3PerceptionView.PerceptionSource("UGV-07", 5.2));

        double cellX = (2 * PV_HX) / PV_BAYS_X;
        double cellY = (2 * PV_HY) / PV_BAYS_Y;
        double floorH = PV_H / PV_FLOORS;
        var aois = List.of(
            new Rc3PerceptionView.AreaOfInterest("entry", "Entrance",
                Rc3PerceptionView.AoiKind.OBJECTIVE, new Rc3PerceptionView.Vec3(-PV_HX - 1.5, 0, 1.4), "UGV-04", 0.93, 0.2),
            new Rc3PerceptionView.AreaOfInterest("smoke", "Smoke",
                Rc3PerceptionView.AoiKind.HAZARD,
                new Rc3PerceptionView.Vec3(-PV_HX + 3.5 * cellX, PV_HY + PV_WIN, 5.5 * floorH), "UAV-09", 0.74, 0.3),
            new Rc3PerceptionView.AreaOfInterest("casualty", "Casualty",
                Rc3PerceptionView.AoiKind.INSPECT,
                new Rc3PerceptionView.Vec3(PV_HX + PV_WIN, -PV_HY + 2.5 * cellY, 3.5 * floorH), "UAV-11", 0.61, 0.6),
            new Rc3PerceptionView.AreaOfInterest("roof", "Roof access",
                Rc3PerceptionView.AoiKind.MARKER,
                new Rc3PerceptionView.Vec3(-PV_HX + 1.5 * cellX, PV_HY - 2, PV_H), null, 0.5, null));

        return new Rc3PerceptionView.PerceptionScene(
            Rc3PerceptionView.CoordinateFrame.ENU, sources,
            List.of(structure, occupancy, ground, aerial), aois);
    }

    private List<Rc3PerceptionView.Vec3> buildAerialPoints(Random rand) {
        var pts = new ArrayList<Rc3PerceptionView.Vec3>();
        for (int i = 0; i < 200; i++) {
            pts.add(new Rc3PerceptionView.Vec3(
                (rand.nextDouble() * 2 - 1) * PV_HX, (rand.nextDouble() * 2 - 1) * PV_HY,
                PV_H + (rand.nextDouble() - 0.5) * 0.4));
        }
        for (int i = 0; i < 120; i++) {
            boolean onX = rand.nextDouble() > 0.5;
            pts.add(new Rc3PerceptionView.Vec3(
                onX ? (rand.nextDouble() * 2 - 1) * PV_HX : (rand.nextDouble() > 0.5 ? PV_HX : -PV_HX),
                onX ? (rand.nextDouble() > 0.5 ? PV_HY : -PV_HY) : (rand.nextDouble() * 2 - 1) * PV_HY,
                PV_H * (0.55 + rand.nextDouble() * 0.45)));
        }
        return pts;
    }

    private List<Rc3PerceptionView.Vec3> buildGroundPoints(Random rand) {
        var pts = new ArrayList<Rc3PerceptionView.Vec3>();
        for (int i = 0; i < 280; i++) {
            boolean onX = rand.nextDouble() > 0.5;
            pts.add(new Rc3PerceptionView.Vec3(
                onX ? (rand.nextDouble() * 2 - 1) * PV_HX : (rand.nextDouble() > 0.5 ? PV_HX : -PV_HX),
                onX ? (rand.nextDouble() > 0.5 ? PV_HY : -PV_HY) : (rand.nextDouble() * 2 - 1) * PV_HY,
                PV_H * 0.5 * rand.nextDouble()));
        }
        for (int i = 0; i < 90; i++) {
            pts.add(new Rc3PerceptionView.Vec3(
                -PV_HX - rand.nextDouble() * 6, (rand.nextDouble() * 2 - 1) * PV_HY,
                (rand.nextDouble() - 0.5) * 0.2));
        }
        return pts;
    }

    private List<Rc3PerceptionView.Vec3> buildOccupancy(Random rand) {
        var voxels = new ArrayList<Rc3PerceptionView.Vec3>();
        for (double x = -PV_HX + 1; x < PV_HX; x += 1.4) {
            for (double y = -PV_HY + 1; y < PV_HY; y += 1.4) {
                if (Math.abs(y) < 1.1 && x > -6 && x < 6) {
                    continue;
                }
                if (rand.nextDouble() > 0.82) {
                    continue;
                }
                voxels.add(new Rc3PerceptionView.Vec3(x, y, 0.2));
            }
        }
        return voxels;
    }

    private Rc3PerceptionView.MeshLayer buildStructure() {
        var vertices = new ArrayList<Rc3PerceptionView.Vec3>();
        var faces = new ArrayList<int[]>();
        // Outer shell — four walls + roof.
        vertices.add(new Rc3PerceptionView.Vec3(-PV_HX, -PV_HY, 0));
        vertices.add(new Rc3PerceptionView.Vec3(PV_HX, -PV_HY, 0));
        vertices.add(new Rc3PerceptionView.Vec3(PV_HX, PV_HY, 0));
        vertices.add(new Rc3PerceptionView.Vec3(-PV_HX, PV_HY, 0));
        vertices.add(new Rc3PerceptionView.Vec3(-PV_HX, -PV_HY, PV_H));
        vertices.add(new Rc3PerceptionView.Vec3(PV_HX, -PV_HY, PV_H));
        vertices.add(new Rc3PerceptionView.Vec3(PV_HX, PV_HY, PV_H));
        vertices.add(new Rc3PerceptionView.Vec3(-PV_HX, PV_HY, PV_H));
        quad(faces, 0, 1, 5, 4);
        quad(faces, 1, 2, 6, 5);
        quad(faces, 2, 3, 7, 6);
        quad(faces, 3, 0, 4, 7);
        quad(faces, 4, 5, 6, 7);

        double floorH = PV_H / PV_FLOORS;
        double halfH = floorH * 0.32;
        double cellX = (2 * PV_HX) / PV_BAYS_X;
        for (double sy : new double[] {PV_HY, -PV_HY}) {
            double oy = sy > 0 ? PV_WIN : -PV_WIN;
            for (int fl = 0; fl < PV_FLOORS; fl++) {
                double cz = (fl + 0.5) * floorH;
                for (int b = 0; b < PV_BAYS_X; b++) {
                    double cx = -PV_HX + (b + 0.5) * cellX;
                    addWindow(vertices, faces, cx, sy + oy, cz, 1, 0, cellX * 0.28, halfH);
                }
            }
        }
        double cellY = (2 * PV_HY) / PV_BAYS_Y;
        for (double sx : new double[] {PV_HX, -PV_HX}) {
            double ox = sx > 0 ? PV_WIN : -PV_WIN;
            for (int fl = 0; fl < PV_FLOORS; fl++) {
                double cz = (fl + 0.5) * floorH;
                for (int b = 0; b < PV_BAYS_Y; b++) {
                    double cy = -PV_HY + (b + 0.5) * cellY;
                    addWindow(vertices, faces, sx + ox, cy, cz, 0, 1, cellY * 0.28, halfH);
                }
            }
        }
        return new Rc3PerceptionView.MeshLayer("shell", "Structure", null, vertices, faces);
    }

    private static void quad(List<int[]> faces, int a, int b, int c, int d) {
        faces.add(new int[] {a, b, c});
        faces.add(new int[] {a, c, d});
    }

    private static void addWindow(List<Rc3PerceptionView.Vec3> verts, List<int[]> faces,
        double cx, double cy, double cz, double ux, double uy, double halfW, double halfH) {
        int i = verts.size();
        verts.add(new Rc3PerceptionView.Vec3(cx - ux * halfW, cy - uy * halfW, cz - halfH));
        verts.add(new Rc3PerceptionView.Vec3(cx + ux * halfW, cy + uy * halfW, cz - halfH));
        verts.add(new Rc3PerceptionView.Vec3(cx + ux * halfW, cy + uy * halfW, cz + halfH));
        verts.add(new Rc3PerceptionView.Vec3(cx - ux * halfW, cy - uy * halfW, cz + halfH));
        faces.add(new int[] {i, i + 1, i + 2});
        faces.add(new int[] {i, i + 2, i + 3});
    }

    private Node tooltip() {
        var btn = new PrizmButton("Hover for tooltip", PrizmButton.Variant.OUTLINE);
        btn.setTooltip(new PrizmTooltip("UGV-04 · Ground · Patrol"));
        return btn;
    }

    private Node menu() {
        var menu = new PrizmMenu("Actions");
        // Plain items render flush-left (like the web). Mixing in a CheckMenuItem
        // would make JavaFX reserve a uniform left gutter on every item to align
        // the checks — a native convention, supported but not shown here.
        menu.getItems().addAll(
            new MenuItem("Acknowledge"),
            new MenuItem("Reassign"),
            new MenuItem("Duplicate task"),
            new SeparatorMenuItem(),
            new MenuItem("Remove from task"));
        return menu;
    }

    private Node contextMenu() {
        var target = new PrizmCard("Right-click this card", "A context menu opens with platform actions.");
        target.setMaxWidth(320);
        var menu = new PrizmContextMenu(
            new MenuItem("Acknowledge"),
            new MenuItem("Reassign"),
            new SeparatorMenuItem(),
            new MenuItem("Remove from task"));
        // PrizmCard is a VBox (not a Control), so wire the menu via the Node hook.
        target.setOnContextMenuRequested(e -> menu.show(target, e.getScreenX(), e.getScreenY()));
        return target;
    }

    private Node popover() {
        var title = new Label("Platform detail");
        title.setStyle("-fx-font-weight: bold;");
        var body = new Label("UGV-04 · Ground · Patrol. Battery 82%, link nominal.");
        body.setWrapText(true);
        var content = new VBox(4, title, body);
        var popover = new PrizmPopover(content);

        var trigger = new PrizmButton("Open popover", PrizmButton.Variant.OUTLINE);
        trigger.setOnAction(e -> {
            if (!popover.isShowing()) {
                popover.show(trigger);
            }
        });
        return trigger;
    }

    private Node dialog() {
        var open = new PrizmButton("Open dialog", PrizmButton.Variant.SOLID);
        open.setOnAction(e -> {
            var dialog = new PrizmDialog("Remove UGV-04 from the task?",
                "This unassigns the platform from Sortie 04. You can reassign it later.");
            dialog.addAction("Cancel", PrizmButton.Variant.OUTLINE, null);
            dialog.addAction("OK", PrizmButton.Variant.SOLID, null);
            dialog.show(rootStack);
        });
        return open;
    }

    private Node sheet() {
        return new FlowPane(8, 8,
            sheetButton("From left", Side.LEFT),
            sheetButton("From right", Side.RIGHT),
            sheetButton("From top", Side.TOP),
            sheetButton("From bottom", Side.BOTTOM));
    }

    private PrizmButton sheetButton(String label, Side side) {
        var btn = new PrizmButton(label, PrizmButton.Variant.OUTLINE);
        btn.setSize(PrizmButton.Size.SM);
        btn.setOnAction(e -> {
            var sheet = new PrizmSheet(side);
            var title = new Label("Platform settings");
            title.setStyle("-fx-font-weight: 600; -fx-font-size: 16;");
            var body = new Label("Configure UGV-04 — geofence, RTB threshold, comms relay.");
            body.setWrapText(true);
            var close = new PrizmButton("Close", PrizmButton.Variant.OUTLINE);
            close.setSize(PrizmButton.Size.SM);
            close.setOnAction(ev -> sheet.hide());
            var content = new VBox(12, title, body, close);
            content.setPadding(new Insets(20));
            sheet.setContent(content);
            sheet.show(rootStack);
        });
        return btn;
    }

    private Node toast() {
        return new FlowPane(8, 8,
            toastButton("Default", PrizmToast.Variant.DEFAULT, "Configuration saved", "Applied to UGV-04."),
            toastButton("Success", PrizmToast.Variant.SUCCESS, "Task complete", "Patrol leg logged."),
            toastButton("Warning", PrizmToast.Variant.WARNING, "Low battery", "UAV-11 at 18% — RTB advised."),
            toastButton("Error", PrizmToast.Variant.ERROR, "Link lost", "No contact with USV-02 for 45s."),
            toastButton("Info", PrizmToast.Variant.INFO, "Telemetry live", "UGV-04 reporting."));
    }

    private PrizmButton toastButton(String label, PrizmToast.Variant variant, String title, String message) {
        var btn = new PrizmButton(label, PrizmButton.Variant.OUTLINE);
        btn.setSize(PrizmButton.Size.SM);
        btn.setOnAction(e -> {
            if (toaster == null) {
                toaster = new PrizmToaster(rootStack);
            }
            toaster.show(variant, title, message);
        });
        return btn;
    }

    private Node headings() {
        return new VBox(6,
            new PrizmHeading("Display heading", PrizmHeading.Size.XL4),
            new PrizmHeading("Section heading", PrizmHeading.Size.XL2),
            new PrizmHeading("Subsection", PrizmHeading.Size.LG));
    }

    private Node texts() {
        var body = new PrizmText("Default body text at the medium size.");
        var muted = new PrizmText("Muted supporting text.");
        muted.setTone(PrizmText.Tone.MUTED);
        var small = new PrizmText("Small subtle caption.");
        small.setSize(PrizmText.Size.SM).setTone(PrizmText.Tone.SUBTLE);
        return new VBox(6, body, muted, small);
    }

    private Node code() {
        var row = new HBox(8, new Label("Run"), new PrizmCode("pnpm dev"), new Label("to start."));
        row.setAlignment(Pos.CENTER_LEFT);
        return row;
    }

    private Node kbd() {
        var row = new HBox(8, new PrizmKbd("⌘"), new PrizmKbd("K"), new Label("to search."));
        row.setAlignment(Pos.CENTER_LEFT);
        return row;
    }

    private Node prose() {
        return new PrizmProse(
            new PrizmHeading("Operator brief", PrizmHeading.Size.XL),
            new PrizmText("Long-form text stacks with comfortable spacing and a reading-width cap."));
    }

    private Node link() {
        var link = new PrizmLink("View platform detail");
        return new HBox(link);
    }

    private Node combobox() {
        var combo = new PrizmCombobox<String>();
        combo.getSourceItems().addAll("UGV-04", "UAV-11", "USV-02", "UGV-07");
        combo.setPromptText("Search platforms…");
        combo.setPrefWidth(220);
        combo.setMaxWidth(220);
        return combo;
    }

    private Node tabs() {
        var tabs = new PrizmTabs();
        var overview = new Tab("Overview", new Label("Sortie 04 — nominal."));
        var comms = new Tab("Comms", new Label("Link nominal · 82% battery."));
        var log = new Tab("Log", new Label("12 events this watch."));
        tabs.getTabs().addAll(overview, comms, log);
        tabs.setPrefSize(360, 120);
        return tabs;
    }

    private Node frame() {
        var frame = new PrizmFrame();
        frame.setFrameMaxWidth(PrizmFrame.MaxWidth.SM);
        frame.getChildren().add(new PrizmText("Content constrained to a max width with padding."));
        var card = new PrizmCard("Frame", "Wraps content at a reading width (shown inside a card here).");
        card.addContent(frame);
        card.setMaxWidth(420);
        return card;
    }

    private Node skeleton() {
        var box = new VBox(8,
            new PrizmSkeleton(220, 14),
            new PrizmSkeleton(280, 14),
            new PrizmSkeleton(160, 14));
        box.setFillWidth(false);
        return box;
    }

    private Node breadcrumb() {
        var bc = new PrizmBreadcrumb();
        bc.addCrumb("C3");
        bc.addCrumb("Platforms");
        bc.addCurrent("UGV-04");
        return bc;
    }

    private Node pagination() {
        var pagination = new PrizmPagination(10);
        pagination.setCurrent(2);
        return pagination;
    }

    private Node navigationMenu() {
        var nav = new PrizmNavigationMenu();
        nav.addMenu("Operations",
            new MenuItem("Dashboard"), new MenuItem("Ops log"), new MenuItem("Incidents"));
        nav.addMenu("Fleet", new MenuItem("Roster"), new MenuItem("Tasking"));
        return nav;
    }

    private Node hoverCard() {
        var trigger = new PrizmButton("Hover for preview", PrizmButton.Variant.OUTLINE);
        var content = new VBox(2,
            new PrizmText("UGV-04").setSize(PrizmText.Size.SM).setWeight(PrizmText.Weight.SEMIBOLD),
            new PrizmText("Ground · Patrol · 82% battery.")
                .setSize(PrizmText.Size.XS)
                .setTone(PrizmText.Tone.MUTED));
        var card = new PrizmHoverCard(content);
        card.attach(trigger);
        return trigger;
    }

    private Node calendar() {
        var cal = new PrizmCalendar();
        cal.setMaxWidth(240);
        return cal;
    }

    // lucide icon paths (24×24) for the command-palette entries.
    private static final String ICON_DASHBOARD =
        "M3 3 H10 V12 H3 Z M14 3 H21 V8 H14 Z M14 12 H21 V21 H14 Z M3 16 H10 V21 H3 Z";
    private static final String ICON_CALENDAR = "M8 2 V6 M16 2 V6 M3 4 H21 V22 H3 Z M3 10 H21";
    private static final String ICON_SETTINGS =
        "M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73"
            + "l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73"
            + "l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2"
            + "v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73"
            + "l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73"
            + "l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z M15 12 A3 3 0 1 1 9 12 A3 3 0 1 1 15 12 Z";
    private static final String ICON_BOOK =
        "M2 3 H8 A4 4 0 0 1 12 7 V21 A3 3 0 0 0 9 18 H2 Z M22 3 H16 A4 4 0 0 0 12 7 V21 A3 3 0 0 1 15 18 H22 Z";
    private static final String ICON_FILE =
        "M15 2 H6 A2 2 0 0 0 4 4 V20 A2 2 0 0 0 6 22 H18 A2 2 0 0 0 20 20 V7 Z"
            + " M14 2 V6 A2 2 0 0 0 16 8 H20 M16 13 H8 M16 17 H8 M10 9 H8";

    private Node command() {
        var palette = new PrizmCommand();
        palette.setMaxWidth(448);
        var nav = palette.addGroup("Navigation");
        nav.add(PrizmCommand.icon(ICON_DASHBOARD), "Dashboard", "View today's activity",
            List.of("home", "overview"), () -> { });
        nav.add(PrizmCommand.icon(ICON_CALENDAR), "Calendar", "Upcoming events and meetings",
            List.of("schedule", "events"), () -> { });
        nav.add(PrizmCommand.icon(ICON_SETTINGS), "Settings", "Account and workspace preferences",
            List.of("preferences", "config"), () -> { });
        var docs = palette.addGroup("Documentation");
        docs.add(PrizmCommand.icon(ICON_BOOK), "Getting started", "Install PRIZM and ship your first component",
            List.of("docs", "install", "setup"), () -> { });
        docs.add(PrizmCommand.icon(ICON_FILE), "Theming guide", "Tokens, modes, and the four-variant system",
            List.of("tokens", "colors"), () -> { });
        return palette;
    }

    private Node inputs() {
        var prompt = new PrizmInput("", "Search platforms…");
        prompt.setPrefWidth(180);
        var filled = new PrizmInput("UGV-04");
        filled.setPrefWidth(140);
        var disabled = new PrizmInput("Read-only");
        disabled.setPrefWidth(140);
        disabled.setDisable(true);
        return new FlowPane(8, 8, prompt, filled, disabled);
    }

    private Node textarea() {
        var ta = new PrizmTextarea("", "Mission notes…");
        ta.setPrefRowCount(3);
        ta.setPrefWidth(320);
        ta.setMaxWidth(320);
        return ta;
    }

    private Node checkboxes() {
        var a = new PrizmCheckbox("Geofence enabled");
        a.setSelected(true);
        var b = new PrizmCheckbox("Auto-RTB on low battery");
        var c = new PrizmCheckbox("Locked (disabled)");
        c.setSelected(true);
        c.setDisable(true);
        return new VBox(8, a, b, c);
    }

    private Node switches() {
        var on = new PrizmSwitch(true);
        var off = new PrizmSwitch();
        var disabled = new PrizmSwitch(true);
        disabled.setDisable(true);
        return new HBox(16,
            labelled("On", on),
            labelled("Off", off),
            labelled("Disabled", disabled));
    }

    private Node radios() {
        var group = new PrizmRadioGroup("Patrol", "Loiter", "Return to base");
        group.select("Patrol");
        return group;
    }

    private Node select() {
        var combo = new PrizmSelect<String>();
        combo.getItems().addAll("UGV-04", "UAV-11", "USV-02");
        combo.setValue("UGV-04");
        combo.setPrefWidth(220);
        return combo;
    }

    private Node slider() {
        var s = new PrizmSlider(0, 100, 60);
        s.setPrefWidth(260);
        s.setMaxWidth(260);
        return s;
    }

    private Node labels() {
        var input = new PrizmInput("", "e.g. UGV-04");
        input.setPrefWidth(220);
        input.setMaxWidth(220);
        return new VBox(6, new PrizmLabel("Call sign"), input);
    }

    private Node fields() {
        var callsign = new PrizmInput("", "e.g. UGV-04");
        callsign.setPrefWidth(220);
        var ok = new PrizmField("Call sign", callsign);
        ok.setDescription("Used on the platform roster and comms.");

        var freq = new PrizmInput("121.5", "MHz");
        freq.setPrefWidth(220);
        var bad = new PrizmField("Data-link frequency", freq);
        bad.setError("Outside the assigned band (225–400 MHz).");

        var row = new HBox(24, ok, bad);
        return row;
    }

    private Node labelled(String text, Node node) {
        return new VBox(6, caption(text), node);
    }

    private Label caption(String text) {
        var label = new Label(text);
        label.getStyleClass().add("gallery-caption");
        return label;
    }

    private void retheme() {
        PrizmTheme.apply(scene, mode, pack);
    }

    public static void main(String[] args) {
        launch(args);
    }

    private record Section(String title, String blurb, Node content) {}
}
