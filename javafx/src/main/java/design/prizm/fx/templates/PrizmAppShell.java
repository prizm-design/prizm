package design.prizm.fx.templates;

import design.prizm.fx.PrizmTheme;
import design.prizm.fx.controls.PrizmAvatar;
import design.prizm.fx.controls.PrizmBadge;
import design.prizm.fx.controls.PrizmButton;
import design.prizm.fx.controls.PrizmRadioGroup;
import design.prizm.fx.controls.PrizmRadioGroupItem;
import java.time.Instant;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import javafx.animation.Animation;
import javafx.animation.KeyFrame;
import javafx.animation.Timeline;
import javafx.geometry.Insets;
import javafx.geometry.Pos;
import javafx.scene.Node;
import javafx.scene.canvas.Canvas;
import javafx.scene.canvas.GraphicsContext;
import javafx.scene.control.Label;
import javafx.scene.control.ScrollPane;
import javafx.scene.layout.AnchorPane;
import javafx.scene.layout.BorderPane;
import javafx.scene.layout.HBox;
import javafx.scene.layout.Priority;
import javafx.scene.layout.Region;
import javafx.scene.layout.StackPane;
import javafx.scene.layout.VBox;
import javafx.scene.paint.Color;
import javafx.scene.paint.CycleMethod;
import javafx.scene.paint.RadialGradient;
import javafx.scene.paint.Stop;
import javafx.scene.text.Font;
import javafx.scene.shape.SVGPath;
import javafx.util.Duration;

/**
 * The C3 App Shell — the JavaFX analog of the web {@code C3AppShell} template
 * ({@code app/c3/templates/app-shell/shell.tsx}). It's the canonical starting
 * point for a C3 thick-client operator app: compose your content into the
 * {@link #setCanvas(Node) canvas slot} and drive the icon-rail items; the shell
 * supplies the chrome (top bar, live status ticker, rail, left slide panel, and
 * right-anchored Notification Centre + Workspace panels).
 *
 * <p>This is a <em>template</em>, not a registry control — like the web App
 * Shell it has no {@code /components} page and no {@code javafx-api} entry. It
 * composes PRIZM controls and is styled by the {@code .prizm-shell-*} rules in
 * {@code prizm.css}.
 *
 * <p><b>Solid only.</b> Liquid glass is a web-only treatment (no JavaFX
 * {@code backdrop-filter} analog), so the shell renders on solid surfaces —
 * consistent with every PRIZM JavaFX overlay control.
 *
 * <p>Theme is local to the shell: the top-bar Sun/Moon toggle re-applies the
 * PRIZM theme to the shell's own {@link javafx.scene.Scene}. Dark is the
 * operator-canonical default.
 */
public class PrizmAppShell extends StackPane {

    /** Rail-badge tone — colours the small count bubble on a rail item. */
    public enum BadgeTone {
        DANGER,
        WARNING,
        INFO
    }

    /**
     * One icon-rail entry. The {@code glyph} is a short (1–2 char) mono code
     * standing in for the web's lucide icon — JavaFX ships no icon library, so
     * the established convention is an honest text/vector stand-in rather than a
     * bundled font.
     */
    public static final class RailItem {
        final String id;
        final String label;
        final String iconPath; // 24×24 lucide-derived SVGPath
        final int badgeCount; // 0 = no badge
        final BadgeTone badgeTone;

        public RailItem(String id, String label, String iconPath) {
            this(id, label, iconPath, 0, BadgeTone.INFO);
        }

        public RailItem(String id, String label, String iconPath, int badgeCount, BadgeTone badgeTone) {
            this.id = id;
            this.label = label;
            this.iconPath = iconPath;
            this.badgeCount = badgeCount;
            this.badgeTone = badgeTone;
        }
    }

    private static final double TOP_BAR_H = 56;
    private static final double TICKER_H = 32;
    private static final double CHROME_TOP = TOP_BAR_H + TICKER_H; // 88 — matches web's 5.5rem
    private static final double RAIL_W = 64;
    private static final double PANEL_W = 360;

    private static final DateTimeFormatter CLOCK = DateTimeFormatter.ofPattern("HH:mm:ss");

    private final AnchorPane overlay = new AnchorPane();
    private final StackPane canvasHolder = new StackPane();

    private PrizmTheme.Mode mode = PrizmTheme.Mode.DARK;
    private PrizmTheme.Pack pack = PrizmTheme.Pack.NONE;

    private static final int ADDON_PIN_CAP = 5;

    // An add-on app in the App Store. Installed add-ons that are pinned show up
    // on the icon rail (capped at ADDON_PIN_CAP).
    private static final class Addon {
        final String id;
        final String label;
        final String iconPath;
        final String description;
        boolean installed;
        boolean pinned;

        Addon(String id, String label, String iconPath, String description,
                boolean installed, boolean pinned) {
            this.id = id;
            this.label = label;
            this.iconPath = iconPath;
            this.description = description;
            this.installed = installed;
            this.pinned = pinned;
        }
    }

    private final List<RailItem> railItems = new ArrayList<>();
    private final List<Runnable> railActiveUpdaters = new ArrayList<>();
    private final VBox railRoot = new VBox();
    private final List<Addon> addons = seedAddons();
    private String appStoreFilter = "all";
    private String activeRailId;
    private boolean panelExpanded;

    private Node leftPanel; // slide panel or app-store panel
    private Node rightPanel; // notification centre or workspace
    private String rightPanelKind; // "notifications" | "workspace" | null
    private String selectedWorkspace = "Exercise Alpha";

    private static List<Addon> seedAddons() {
        var list = new ArrayList<Addon>();
        list.add(new Addon("logistics", "Logistics", SVG_ADDON_TRUCK,
            "Convoys, supply lines, inventory.", true, true));
        list.add(new Addon("intel", "INTEL", SVG_ADDON_EYE,
            "Threat reports, signals, observations.", true, true));
        list.add(new Addon("air-ops", "Air Ops", SVG_ADDON_PLANE,
            "Sortie planning, airspace status, fuel.", true, true));
        list.add(new Addon("sar", "SAR", SVG_ADDON_LIFE_BUOY,
            "Search & rescue — teams, missions, last-known positions.", true, false));
        list.add(new Addon("medical", "Medical", SVG_ADDON_HEART_PULSE,
            "Casualty handling, MEDEVAC coordination.", false, false));
        list.add(new Addon("shelter", "Shelter", SVG_ADDON_HOUSE,
            "Evacuation shelters — capacity, status, occupancy.", false, false));
        return list;
    }

    private final Instant exerciseStart = Instant.now().minusSeconds(2 * 3600);
    private Label localClock;
    private Label utcClock;
    private Label exClock;

    public PrizmAppShell() {
        railItems.addAll(defaultRail());

        var frame = new BorderPane();
        frame.getStyleClass().add("prizm-shell");
        frame.setTop(new VBox(topBar(), ticker()));
        frame.setLeft(rail());

        canvasHolder.getStyleClass().add("prizm-shell-canvas");
        canvasHolder.setMinSize(0, 0);
        canvasHolder.getChildren().add(defaultCanvas());
        frame.setCenter(canvasHolder);

        // The overlay hosts the slide / right panels above the frame. Empty
        // regions must pass clicks through to the canvas below.
        overlay.setPickOnBounds(false);

        getChildren().addAll(frame, overlay);
        startClock();
    }

    /** Replace the map placeholder with your app's real content. */
    public void setCanvas(Node content) {
        canvasHolder.getChildren().setAll(content);
    }

    /** Set the extension-pack overlay (e.g. RC3 Ember). Re-themes if attached. */
    public void setPack(PrizmTheme.Pack pack) {
        this.pack = pack;
        retheme();
    }

    public PrizmTheme.Mode getMode() {
        return mode;
    }

    /* ============================================================
       Top bar — 56 px: brand · ONLINE · bell · theme · avatar
       ============================================================ */

    private Region topBar() {
        var c3 = new Label("C3");
        c3.getStyleClass().add("prizm-shell-brand-text");
        var dsta = new Label("DSTA");
        dsta.getStyleClass().add("prizm-shell-brand-sub");
        var brand = new HBox(8, brandMark(), c3, dsta);
        brand.setAlignment(Pos.CENTER_LEFT);

        var online = new PrizmBadge("ONLINE", PrizmBadge.Variant.SUCCESS);

        var bell = iconButton(icon(SVG_BELL, "prizm-shell-icon", 16), "Notifications");
        bell.setOnAction(e -> toggleRightPanel("notifications"));

        var themeToggle = iconButton(themeIcon(), "Toggle theme");
        themeToggle.setOnAction(e -> {
            mode = mode == PrizmTheme.Mode.DARK ? PrizmTheme.Mode.LIGHT : PrizmTheme.Mode.DARK;
            themeToggle.setGraphic(themeIcon());
            retheme();
        });

        var avatar = new PrizmAvatar("AL", PrizmAvatar.Size.MD);
        var avatarBtn = new StackPane(avatar, dutyDot());
        // Pin to the avatar's own size — otherwise the 56px-tall top bar stretches
        // the StackPane and the bottom-right dot detaches below the avatar.
        avatarBtn.setMinSize(32, 32);
        avatarBtn.setPrefSize(32, 32);
        avatarBtn.setMaxSize(32, 32);
        avatarBtn.getStyleClass().add("prizm-shell-avatar-btn");
        avatarBtn.setOnMouseClicked(e -> toggleRightPanel("workspace"));

        var spacer = new Region();
        HBox.setHgrow(spacer, Priority.ALWAYS);

        var right = new HBox(8, online, bell, themeToggle, avatarBtn);
        right.setAlignment(Pos.CENTER_RIGHT);

        var bar = new HBox(12, brand, spacer, right);
        bar.setAlignment(Pos.CENTER_LEFT);
        bar.setPadding(new Insets(0, 12, 0, 12));
        bar.setMinHeight(TOP_BAR_H);
        bar.setPrefHeight(TOP_BAR_H);
        bar.getStyleClass().add("prizm-shell-topbar");
        return bar;
    }

    private Node brandMark() {
        // Web brand mark: 20×20, strokeWidth 2 (components/ui … BrandMark).
        var p = icon("M12 2L22 20H2L12 2Z M12 2L12 20", "prizm-shell-brand-mark", 20);
        var box = new StackPane(p);
        box.setAlignment(Pos.CENTER);
        box.setMinSize(20, 20);
        box.setPrefSize(20, 20);
        box.setMaxSize(20, 20);
        return box;
    }

    private Node dutyDot() {
        var dot = new Region();
        dot.getStyleClass().add("prizm-shell-duty-dot");
        dot.setMinSize(14, 14);
        dot.setPrefSize(14, 14);
        dot.setMaxSize(14, 14);
        StackPane.setAlignment(dot, Pos.BOTTOM_RIGHT);
        // Nudge just past the corner so the ring sits on the avatar edge (web's
        // -bottom-0.5 -right-0.5).
        dot.setTranslateX(2);
        dot.setTranslateY(2);
        return dot;
    }

    private SVGPath themeIcon() {
        return icon(mode == PrizmTheme.Mode.DARK ? SVG_SUN : SVG_MOON, "prizm-shell-icon", 16);
    }

    /* ============================================================
       Status ticker — 32 px: metrics + live clocks
       ============================================================ */

    private Region ticker() {
        var bar = new HBox(24);
        bar.setAlignment(Pos.CENTER_LEFT);
        bar.setPadding(new Insets(0, 12, 0, 12));
        bar.setMinHeight(TICKER_H);
        bar.setPrefHeight(TICKER_H);
        bar.getStyleClass().add("prizm-shell-ticker");

        bar.getChildren().addAll(
            metric("Active", "7", false),
            metric("Deployed", "34", false),
            metric("Personnel", "128", false),
            metric("Alerts", "12", true));

        var spacer = new Region();
        HBox.setHgrow(spacer, Priority.ALWAYS);
        bar.getChildren().add(spacer);

        localClock = clockValue("prizm-shell-clock");
        utcClock = clockValue("prizm-shell-clock-muted");
        exClock = clockValue("prizm-shell-clock-ex");
        bar.getChildren().addAll(
            clock("LOCAL", localClock),
            clock("UTC", utcClock),
            clock("EX", exClock));
        return bar;
    }

    private Node metric(String label, String value, boolean danger) {
        var l = new Label(label);
        l.getStyleClass().add("prizm-shell-metric-label");
        var v = new Label(value);
        v.getStyleClass().add(danger ? "prizm-shell-metric-danger" : "prizm-shell-metric-value");
        var box = new HBox(6, l, v);
        box.setAlignment(Pos.CENTER_LEFT);
        return box;
    }

    private Label clockValue(String styleClass) {
        var v = new Label(" ");
        v.getStyleClass().add(styleClass);
        return v;
    }

    private Node clock(String label, Label value) {
        var l = new Label(label);
        l.getStyleClass().add("prizm-shell-metric-label");
        var box = new HBox(6, l, value);
        box.setAlignment(Pos.CENTER_LEFT);
        return box;
    }

    private void startClock() {
        var tick = new Timeline(new KeyFrame(Duration.ZERO, e -> updateClocks()),
            new KeyFrame(Duration.seconds(1)));
        tick.setCycleCount(Animation.INDEFINITE);
        tick.play();
    }

    private void updateClocks() {
        var now = ZonedDateTime.now();
        localClock.setText(now.format(CLOCK));
        utcClock.setText(now.withZoneSameInstant(ZoneId.of("UTC")).format(CLOCK));
        exClock.setText(formatElapsed(java.time.Duration.between(exerciseStart, Instant.now())));
    }

    private static String formatElapsed(java.time.Duration d) {
        long total = Math.max(0, d.getSeconds());
        long days = total / 86400;
        long rest = total % 86400;
        return String.format("D+%02d %02d:%02d:%02d", days, rest / 3600, (rest % 3600) / 60, rest % 60);
    }

    /* ============================================================
       Icon rail — 64 px: core apps + App Store pinned at bottom
       ============================================================ */

    private Region rail() {
        railRoot.setAlignment(Pos.TOP_CENTER);
        railRoot.setMinWidth(RAIL_W);
        railRoot.setPrefWidth(RAIL_W);
        railRoot.setMaxWidth(RAIL_W);
        railRoot.getStyleClass().add("prizm-shell-rail");
        renderRail();
        return railRoot;
    }

    // Rebuilds the rail: core apps, then (if any) pinned add-ons below a divider,
    // then the App Store pinned at the bottom. Called on start and whenever the
    // pinned set changes in the App Store.
    private void renderRail() {
        railActiveUpdaters.clear();

        var items = new VBox(4);
        items.setAlignment(Pos.TOP_CENTER);
        items.setPadding(new Insets(8, 0, 8, 0));
        VBox.setVgrow(items, Priority.ALWAYS);
        for (var item : railItems) {
            items.getChildren().add(railButton(item));
        }
        var pinned = addons.stream().filter(a -> a.installed && a.pinned).toList();
        if (!pinned.isEmpty()) {
            items.getChildren().add(railDivider());
            for (var a : pinned) {
                items.getChildren().add(railButton(new RailItem(a.id, a.label, a.iconPath)));
            }
        }

        var store = railButton(new RailItem("app-store", "App Store", SVG_APP_LAYOUT_GRID));
        var bottom = new VBox(4, railDivider(), store);
        bottom.setAlignment(Pos.CENTER);
        bottom.setPadding(new Insets(0, 0, 8, 0));

        railRoot.getChildren().setAll(items, bottom);
        refreshRailActive();
    }

    private Region railDivider() {
        var divider = new Region();
        divider.getStyleClass().add("prizm-shell-rail-divider");
        divider.setMinHeight(1);
        divider.setPrefHeight(1);
        return divider;
    }

    private Node railButton(RailItem item) {
        var ic = icon(item.iconPath, "prizm-shell-rail-icon", 20);

        var cell = new StackPane(ic);
        cell.getStyleClass().add("prizm-shell-rail-item");
        cell.setMinSize(44, 44);
        cell.setPrefSize(44, 44);
        cell.setMaxSize(44, 44);

        if (item.badgeCount > 0) {
            var badge = new Label(Integer.toString(item.badgeCount));
            badge.getStyleClass().addAll("prizm-shell-rail-badge", railBadgeClass(item.badgeTone));
            StackPane.setAlignment(badge, Pos.TOP_RIGHT);
            StackPane.setMargin(badge, new Insets(2, 2, 0, 0));
            cell.getChildren().add(badge);
        }

        // Active-state highlight, driven by activeRailId.
        Runnable updater = () -> {
            var active = item.id.equals(activeRailId);
            cell.pseudoClassStateChanged(ACTIVE, active);
        };
        railActiveUpdaters.add(updater);

        var tip = new javafx.scene.control.Tooltip(item.label);
        javafx.scene.control.Tooltip.install(cell, tip);

        cell.setOnMouseClicked(e -> handleRailClick(item));
        return cell;
    }

    private static String railBadgeClass(BadgeTone tone) {
        return switch (tone) {
            case DANGER -> "prizm-shell-rail-badge--danger";
            case WARNING -> "prizm-shell-rail-badge--warning";
            case INFO -> "prizm-shell-rail-badge--info";
        };
    }

    private void handleRailClick(RailItem item) {
        if (item.id.equals(activeRailId)) {
            closeLeftPanel();
            return;
        }
        activeRailId = item.id;
        panelExpanded = false;
        refreshRailActive();
        if (item.id.equals("app-store")) {
            showLeftPanel(appStorePanel());
        } else {
            showLeftPanel(slidePanel(item));
        }
    }

    private void refreshRailActive() {
        for (var r : railActiveUpdaters) {
            r.run();
        }
    }

    /* ============================================================
       Left slide panel — anchored against the rail, two widths
       ============================================================ */

    private void showLeftPanel(Node panel) {
        if (leftPanel != null) {
            overlay.getChildren().remove(leftPanel);
        }
        leftPanel = panel;
        AnchorPane.setTopAnchor(panel, CHROME_TOP);
        AnchorPane.setBottomAnchor(panel, 0.0);
        AnchorPane.setLeftAnchor(panel, RAIL_W);
        applyLeftWidth(panel);
        overlay.getChildren().add(panel);
    }

    private void applyLeftWidth(Node panel) {
        if (panelExpanded) {
            AnchorPane.setRightAnchor(panel, 0.0);
        } else {
            AnchorPane.clearConstraints(panel);
            AnchorPane.setTopAnchor(panel, CHROME_TOP);
            AnchorPane.setBottomAnchor(panel, 0.0);
            AnchorPane.setLeftAnchor(panel, RAIL_W);
            if (panel instanceof Region r) {
                r.setMinWidth(PANEL_W);
                r.setPrefWidth(PANEL_W);
                r.setMaxWidth(PANEL_W);
            }
        }
    }

    private void closeLeftPanel() {
        if (leftPanel != null) {
            overlay.getChildren().remove(leftPanel);
            leftPanel = null;
        }
        activeRailId = null;
        panelExpanded = false;
        refreshRailActive();
    }

    private void toggleLeftExpand() {
        panelExpanded = !panelExpanded;
        if (leftPanel instanceof Region r) {
            if (panelExpanded) {
                r.setMaxWidth(Double.MAX_VALUE);
                AnchorPane.setRightAnchor(r, 0.0);
            } else {
                AnchorPane.setRightAnchor(r, null);
                r.setMinWidth(PANEL_W);
                r.setPrefWidth(PANEL_W);
                r.setMaxWidth(PANEL_W);
            }
        }
    }

    private Region slidePanel(RailItem item) {
        var header = panelHeader(item.label, true);
        var body = new Label(item.label
            + " panel content — your app's UI for this view goes here. The panel"
            + " opens adjacent to the icon rail and supports two width states:"
            + " standard (360px) and expanded (full canvas width).");
        body.getStyleClass().add("prizm-shell-panel-body");
        body.setWrapText(true);
        var bodyBox = new VBox(body);
        bodyBox.setPadding(new Insets(16));
        VBox.setVgrow(bodyBox, Priority.ALWAYS);

        var panel = new VBox(header, bodyBox);
        panel.getStyleClass().add("prizm-shell-panel");
        return panel;
    }

    private Region appStorePanel() {
        var storeIcon = icon(SVG_APP_LAYOUT_GRID, "prizm-shell-icon", 16);
        var title = new Label("App Store");
        title.getStyleClass().add("prizm-shell-panel-title");
        var pinnedBadge = new PrizmBadge("", PrizmBadge.Variant.SUBTLE);
        pinnedBadge.getStyleClass().add("prizm-shell-count-tag");
        var hSpacer = new Region();
        HBox.setHgrow(hSpacer, Priority.ALWAYS);
        var expand = iconButton(icon(SVG_CHEVRONS_RIGHT, "prizm-shell-icon", 16), "Expand panel");
        expand.setOnAction(e -> {
            toggleLeftExpand();
            expand.setGraphic(icon(
                panelExpanded ? SVG_CHEVRONS_LEFT : SVG_CHEVRONS_RIGHT, "prizm-shell-icon", 16));
        });
        var close = iconButton(icon(SVG_CLOSE, "prizm-shell-icon", 16), "Close App Store");
        close.setOnAction(e -> closeLeftPanel());
        var header = new HBox(8, storeIcon, title, pinnedBadge, hSpacer, expand, close);
        header.setAlignment(Pos.CENTER_LEFT);
        header.setPadding(new Insets(0, 8, 0, 12));
        header.setMinHeight(48);
        header.setPrefHeight(48);
        header.getStyleClass().add("prizm-shell-panel-header");

        var chips = new HBox(6);
        chips.setAlignment(Pos.CENTER_LEFT);
        chips.setPadding(new Insets(8, 12, 8, 12));
        chips.getStyleClass().add("prizm-shell-notif-filters");

        var list = new VBox();
        var scroll = new ScrollPane(list);
        scroll.setFitToWidth(true);
        scroll.getStyleClass().addAll("scroll-pane", "prizm-shell-scroll");
        VBox.setVgrow(scroll, Priority.ALWAYS);

        var hint = new Label(
            "Pinned add-ons appear in the icon rail (up to " + ADDON_PIN_CAP + "). Unpin to free a slot.");
        hint.setWrapText(true);
        // Bound the wrap width to the panel's content box — without a definite
        // width a wrapText label sitting outside a fit-to-width scroll collapses
        // to one line and ellipsizes instead of wrapping. (12px footer padding
        // each side.)
        hint.setMaxWidth(PANEL_W - 24);
        hint.getStyleClass().add("prizm-shell-appstore-hint");
        var footer = new VBox(hint);
        footer.setPadding(new Insets(8, 12, 8, 12));
        footer.getStyleClass().add("prizm-shell-panel-footer");

        var rerender = new Runnable[1];
        rerender[0] = () -> {
            long pinnedCount = addons.stream().filter(a -> a.installed && a.pinned).count();
            long installedCount = addons.stream().filter(a -> a.installed).count();
            pinnedBadge.setText(pinnedCount + " / " + ADDON_PIN_CAP + " pinned");

            chips.getChildren().setAll(
                appStoreChip("All", "all", installedCount, rerender[0]),
                appStoreChip("Installed", "installed", installedCount, rerender[0]),
                appStoreChip("Available", "available", installedCount, rerender[0]));

            var filtered = addons.stream().filter(a -> switch (appStoreFilter) {
                case "installed" -> a.installed;
                case "available" -> !a.installed;
                default -> true;
            }).toList();

            list.getChildren().clear();
            if (filtered.isEmpty()) {
                var empty = new Label(
                    "No " + ("all".equals(appStoreFilter) ? "" : appStoreFilter + " ") + "add-on apps.");
                empty.getStyleClass().add("prizm-shell-appstore-empty");
                var emptyBox = new StackPane(empty);
                emptyBox.setPadding(new Insets(48, 24, 48, 24));
                list.getChildren().add(emptyBox);
            } else {
                for (var a : filtered) {
                    list.getChildren().add(appStoreRow(a, rerender[0]));
                }
            }
        };
        rerender[0].run();

        var panel = new VBox(header, chips, scroll, footer);
        panel.getStyleClass().add("prizm-shell-panel");
        return panel;
    }

    private Node appStoreChip(String label, String key, long installedCount, Runnable rerender) {
        var text = label
            + ("installed".equals(key) && installedCount > 0 ? " (" + installedCount + ")" : "");
        var chip = new Label(text);
        chip.getStyleClass().add("prizm-shell-filter-chip");
        if (key.equals(appStoreFilter)) {
            chip.getStyleClass().add("prizm-shell-filter-chip--active");
        }
        chip.setOnMouseClicked(e -> {
            appStoreFilter = key;
            rerender.run();
        });
        return chip;
    }

    private Node appStoreRow(Addon a, Runnable rerender) {
        var appIcon = icon(a.iconPath, "prizm-shell-appstore-icon", 20);
        var iconBox = new StackPane(appIcon);
        iconBox.getStyleClass().add("prizm-shell-appstore-iconbox");
        iconBox.setMinSize(36, 36);
        iconBox.setPrefSize(36, 36);
        iconBox.setMaxSize(36, 36);

        var name = new Label(a.label);
        name.getStyleClass().add("prizm-shell-appstore-name");
        var nameRow = new HBox(8, name);
        nameRow.setAlignment(Pos.CENTER_LEFT);
        if (a.installed && a.pinned) {
            var b = new PrizmBadge("PINNED", PrizmBadge.Variant.SUCCESS);
            b.getStyleClass().add("prizm-shell-ws-tag");
            nameRow.getChildren().add(b);
        } else if (a.installed) {
            var b = new PrizmBadge("INSTALLED", PrizmBadge.Variant.SUBTLE);
            b.getStyleClass().add("prizm-shell-ws-tag");
            nameRow.getChildren().add(b);
        }
        var desc = new Label(a.description);
        desc.setWrapText(true);
        desc.getStyleClass().add("prizm-shell-appstore-desc");
        var textCol = new VBox(4, nameRow, desc);
        HBox.setHgrow(textCol, Priority.ALWAYS);

        var top = new HBox(12, iconBox, textCol);
        top.setAlignment(Pos.TOP_LEFT);

        var actions = new HBox(8);
        actions.setAlignment(Pos.CENTER_RIGHT);
        if (!a.installed) {
            var install = new PrizmButton("Install", PrizmButton.Variant.SOLID);
            install.setSize(PrizmButton.Size.SM);
            install.setOnAction(e -> {
                a.installed = true;
                rerender.run();
                renderRail();
            });
            actions.getChildren().add(install);
        } else {
            boolean atCap = addons.stream().filter(x -> x.installed && x.pinned).count() >= ADDON_PIN_CAP;
            boolean pinDisabled = !a.pinned && atCap;
            var pin = new PrizmButton(a.pinned ? "Unpin" : "Pin", PrizmButton.Variant.OUTLINE);
            pin.setSize(PrizmButton.Size.SM);
            pin.setGraphic(icon(a.pinned ? SVG_PIN_OFF : SVG_PIN, "prizm-shell-btn-icon", 14));
            // Pinned toggle carries the accent (web: `app.pinned && "text-accent"`).
            if (a.pinned) {
                pin.getStyleClass().add("prizm-shell-pin--active");
            }
            pin.setDisable(pinDisabled);
            if (pinDisabled) {
                javafx.scene.control.Tooltip.install(pin,
                    new javafx.scene.control.Tooltip("Rail full — unpin another add-on first"));
            }
            pin.setOnAction(e -> {
                a.pinned = !a.pinned;
                rerender.run();
                renderRail();
            });
            var uninstall = new PrizmButton("Uninstall", PrizmButton.Variant.OUTLINE);
            uninstall.setSize(PrizmButton.Size.SM);
            uninstall.setOnAction(e -> {
                a.installed = false;
                a.pinned = false;
                if (a.id.equals(activeRailId)) {
                    closeLeftPanel();
                }
                rerender.run();
                renderRail();
            });
            actions.getChildren().addAll(pin, uninstall);
        }

        var rowBox = new VBox(12, top, actions);
        rowBox.setPadding(new Insets(12));
        rowBox.getStyleClass().add("prizm-shell-appstore-row");
        // Installed-but-unpinned add-ons launch on row click (pinned ones are
        // already one click away on the rail).
        if (a.installed && !a.pinned) {
            rowBox.getStyleClass().add("prizm-shell-appstore-row--launchable");
            rowBox.setOnMouseClicked(e -> {
                activeRailId = a.id;
                panelExpanded = false;
                refreshRailActive();
                showLeftPanel(slidePanel(new RailItem(a.id, a.label, a.iconPath)));
            });
        }
        return rowBox;
    }

    private Region panelHeader(String title, boolean expandable) {
        var label = new Label(title);
        label.getStyleClass().add("prizm-shell-panel-title");

        var spacer = new Region();
        HBox.setHgrow(spacer, Priority.ALWAYS);

        var header = new HBox(8, label, spacer);
        header.setAlignment(Pos.CENTER_LEFT);
        header.setPadding(new Insets(0, 8, 0, 12));
        header.setMinHeight(48);
        header.setPrefHeight(48);
        header.getStyleClass().add("prizm-shell-panel-header");

        if (expandable) {
            var expand = iconButton(icon(SVG_CHEVRONS_RIGHT, "prizm-shell-icon", 16), "Expand panel");
            expand.setOnAction(e -> {
                toggleLeftExpand();
                expand.setGraphic(icon(panelExpanded ? SVG_CHEVRONS_LEFT : SVG_CHEVRONS_RIGHT, "prizm-shell-icon", 16));
            });
            header.getChildren().add(expand);
        }

        var close = iconButton(icon(SVG_CLOSE, "prizm-shell-icon", 16), "Close panel");
        close.setOnAction(e -> closeLeftPanel());
        header.getChildren().add(close);
        return header;
    }

    /* ============================================================
       Right panels — Notification Centre / Workspace (one at a time)
       ============================================================ */

    private void toggleRightPanel(String kind) {
        if (kind.equals(rightPanelKind)) {
            closeRightPanel();
            return;
        }
        if (rightPanel != null) {
            overlay.getChildren().remove(rightPanel);
        }
        rightPanelKind = kind;
        rightPanel = kind.equals("notifications") ? notificationPanel() : workspacePanel();
        AnchorPane.setTopAnchor(rightPanel, CHROME_TOP);
        AnchorPane.setBottomAnchor(rightPanel, 0.0);
        AnchorPane.setRightAnchor(rightPanel, 0.0);
        if (rightPanel instanceof Region r) {
            r.setMinWidth(PANEL_W);
            r.setPrefWidth(PANEL_W);
            r.setMaxWidth(PANEL_W);
        }
        overlay.getChildren().add(rightPanel);
    }

    private void closeRightPanel() {
        if (rightPanel != null) {
            overlay.getChildren().remove(rightPanel);
            rightPanel = null;
        }
        rightPanelKind = null;
    }

    private enum NotifTone {
        DANGER,
        WARNING,
        INFO,
        SUCCESS
    }

    // Mutable so read / dismissed state survives filtering and re-render.
    private static final class Notif {
        final NotifTone tone;
        final String title;
        final String desc;
        final String time;
        boolean read;

        Notif(NotifTone tone, String title, String desc, String time, boolean read) {
            this.tone = tone;
            this.title = title;
            this.desc = desc;
            this.time = time;
            this.read = read;
        }
    }

    private final List<Notif> notifications = seedNotifications();
    private String notifFilter = "all";

    private static List<Notif> seedNotifications() {
        var list = new ArrayList<Notif>();
        list.add(new Notif(NotifTone.DANGER, "Incident reported",
            "Sector 7-G — escalated to Priority 1. Two units dispatched.", "2m ago", false));
        list.add(new Notif(NotifTone.WARNING, "Vehicle V-04 lost signal",
            "Last known position recorded. Reconnection attempts in progress.", "8m ago", false));
        list.add(new Notif(NotifTone.DANGER, "Perimeter breach",
            "Motion detected on west fence line. Camera feed available.", "12m ago", false));
        list.add(new Notif(NotifTone.INFO, "Personnel update",
            "Bravo team reported on station and awaiting orders.", "23m ago", true));
        list.add(new Notif(NotifTone.SUCCESS, "Supply drop confirmed",
            "Cache 12 received by Alpha team. Inventory updated.", "1h ago", true));
        list.add(new Notif(NotifTone.INFO, "Shift handover scheduled",
            "Watch B taking over at 16:00. Briefing notes attached.", "3h ago", true));
        list.add(new Notif(NotifTone.WARNING, "Weather advisory",
            "Storm cell tracking east — ETA 4 hours. Review contingency.", "Yesterday", true));
        return list;
    }

    private Region notificationPanel() {
        var bellIcon = icon(SVG_BELL, "prizm-shell-icon", 16);
        var title = new Label("Notification Centre");
        title.getStyleClass().add("prizm-shell-panel-title");
        var unreadBadge = new PrizmBadge("", PrizmBadge.Variant.INFO);
        unreadBadge.getStyleClass().add("prizm-shell-count-tag");
        var hSpacer = new Region();
        HBox.setHgrow(hSpacer, Priority.ALWAYS);
        var close = iconButton(icon(SVG_CLOSE, "prizm-shell-icon", 16), "Close notification centre");
        close.setOnAction(e -> closeRightPanel());
        var header = new HBox(8, bellIcon, title, unreadBadge, hSpacer, close);
        header.setAlignment(Pos.CENTER_LEFT);
        header.setPadding(new Insets(0, 8, 0, 12));
        header.setMinHeight(48);
        header.setPrefHeight(48);
        header.getStyleClass().add("prizm-shell-panel-header");

        var chips = new HBox(6);
        chips.setAlignment(Pos.CENTER_LEFT);
        chips.setPadding(new Insets(8, 12, 8, 12));
        chips.getStyleClass().add("prizm-shell-notif-filters");

        var list = new VBox();
        var scroll = new ScrollPane(list);
        scroll.setFitToWidth(true);
        scroll.getStyleClass().addAll("scroll-pane", "prizm-shell-scroll");
        VBox.setVgrow(scroll, Priority.ALWAYS);

        var markAll = new Label("Mark all read");
        markAll.getStyleClass().add("prizm-shell-panel-action");
        var footSpacer = new Region();
        HBox.setHgrow(footSpacer, Priority.ALWAYS);
        var history = new Label("View history");
        history.getStyleClass().add("prizm-shell-panel-action");
        var footer = new HBox(markAll, footSpacer, history);
        footer.setPadding(new Insets(8, 12, 8, 12));
        footer.getStyleClass().add("prizm-shell-panel-footer");

        var rerender = new Runnable[1];
        rerender[0] = () -> {
            long unread = notifications.stream().filter(n -> !n.read).count();
            unreadBadge.setText(unread + " unread");
            unreadBadge.setVisible(unread > 0);
            unreadBadge.setManaged(unread > 0);

            chips.getChildren().setAll(
                filterChip("All", "all", rerender[0]),
                filterChip("Unread", "unread", rerender[0]),
                filterChip("Alerts", "alerts", rerender[0]));

            var filtered = notifications.stream().filter(n -> switch (notifFilter) {
                case "unread" -> !n.read;
                case "alerts" -> n.tone == NotifTone.DANGER;
                default -> true;
            }).toList();

            list.getChildren().clear();
            if (filtered.isEmpty()) {
                var empty = new Label(
                    "No " + ("all".equals(notifFilter) ? "" : notifFilter + " ") + "notifications.");
                empty.getStyleClass().add("prizm-shell-notif-empty");
                var box = new StackPane(empty);
                box.setPadding(new Insets(40, 16, 40, 16));
                list.getChildren().add(box);
            } else {
                for (var n : filtered) {
                    list.getChildren().add(notificationRow(n, rerender[0]));
                }
            }
        };
        markAll.setOnMouseClicked(e -> {
            notifications.forEach(n -> n.read = true);
            rerender[0].run();
        });
        rerender[0].run();

        var panel = new VBox(header, chips, scroll, footer);
        panel.getStyleClass().add("prizm-shell-panel");
        return panel;
    }

    private Node filterChip(String label, String key, Runnable rerender) {
        var chip = new Label(label);
        chip.getStyleClass().add("prizm-shell-filter-chip");
        if (key.equals(notifFilter)) {
            chip.getStyleClass().add("prizm-shell-filter-chip--active");
        }
        chip.setOnMouseClicked(e -> {
            notifFilter = key;
            rerender.run();
        });
        return chip;
    }

    private Node notificationRow(Notif n, Runnable rerender) {
        var sev = icon(severityPath(n.tone), "prizm-shell-sev-icon", 16);
        sev.getStyleClass().add("prizm-shell-sev--" + n.tone.name().toLowerCase());
        var sevBox = new StackPane(sev);
        sevBox.setAlignment(Pos.CENTER);
        sevBox.setMinSize(16, 16);
        sevBox.setPrefSize(16, 16);
        sevBox.setMaxSize(16, 16);

        var titleRow = new HBox(6);
        titleRow.setAlignment(Pos.CENTER_LEFT);
        if (!n.read) {
            var unread = new Region();
            unread.getStyleClass().add("prizm-shell-unread-dot");
            unread.setMinSize(6, 6);
            unread.setPrefSize(6, 6);
            unread.setMaxSize(6, 6);
            titleRow.getChildren().add(unread);
        }
        var title = new Label(n.title);
        title.getStyleClass().add(n.read ? "prizm-shell-notif-title-read" : "prizm-shell-notif-title");
        titleRow.getChildren().add(title);

        var desc = new Label(n.desc);
        desc.getStyleClass().add("prizm-shell-notif-desc");
        desc.setWrapText(true);
        var text = new VBox(4, titleRow, desc);
        HBox.setHgrow(text, Priority.ALWAYS);

        var time = new Label(n.time);
        time.getStyleClass().add("prizm-shell-notif-time");
        time.setMinWidth(Region.USE_PREF_SIZE);
        var dismiss = icon(SVG_CLOSE, "prizm-shell-notif-dismiss", 14);
        var dismissBox = new StackPane(dismiss);
        dismissBox.getStyleClass().add("prizm-shell-notif-dismiss-box");
        dismissBox.setOnMouseClicked(e -> {
            e.consume();
            notifications.remove(n);
            rerender.run();
        });
        var right = new VBox(6, time, dismissBox);
        right.setAlignment(Pos.TOP_RIGHT);

        var row = new HBox(12, sevBox, text, right);
        HBox.setMargin(sevBox, new Insets(2, 0, 0, 0));
        row.setAlignment(Pos.TOP_LEFT);
        row.setPadding(new Insets(12));
        row.getStyleClass().add("prizm-shell-notif-row");
        row.setOnMouseClicked(e -> {
            n.read = true;
            rerender.run();
        });
        return row;
    }

    private static String severityPath(NotifTone tone) {
        return switch (tone) {
            case DANGER -> SVG_APP_ALERT_TRIANGLE;
            case WARNING -> SVG_SEV_ALERT_CIRCLE;
            case INFO -> SVG_SEV_INFO;
            case SUCCESS -> SVG_SEV_CHECK_CIRCLE;
        };
    }

    private record Workspace(String name, String detail, String tag, String tagVariant) {}

    private static final List<Workspace> WORKSPACES = List.of(
        new Workspace("Exercise Alpha", "Active scenario · D+00 02:00", "Exercise", "warning"),
        new Workspace("Sector 7 Watch", "Live operations", "Live", "danger"),
        new Workspace("Training Sandbox", "Sandbox · no consequences", "Training", "info"),
        new Workspace("Archive", "Read-only past exercises", null, null));

    private Region workspacePanel() {
        var usersIcon = icon(SVG_USERS, "prizm-shell-icon", 16);
        var title = new Label("Workspace");
        title.getStyleClass().add("prizm-shell-panel-title");
        var spacer = new Region();
        HBox.setHgrow(spacer, Priority.ALWAYS);
        var close = iconButton(icon(SVG_CLOSE, "prizm-shell-icon", 16), "Close workspace");
        close.setOnAction(e -> closeRightPanel());
        var header = new HBox(8, usersIcon, title, spacer, close);
        header.setAlignment(Pos.CENTER_LEFT);
        header.setPadding(new Insets(0, 8, 0, 12));
        header.setMinHeight(48);
        header.setPrefHeight(48);
        header.getStyleClass().add("prizm-shell-panel-header");

        var avatar = new PrizmAvatar("AL", PrizmAvatar.Size.LG);
        var avatarBox = new StackPane(avatar, dutyDot());
        avatarBox.setMinSize(40, 40);
        avatarBox.setPrefSize(40, 40);
        avatarBox.setMaxSize(40, 40);
        var name = new Label("MAJ A. LOH");
        name.getStyleClass().add("prizm-shell-user-name");
        var role = new Label("Watch Officer · DSTA");
        role.getStyleClass().add("prizm-shell-user-role");
        var who = new VBox(2, name, role);
        who.setAlignment(Pos.CENTER_LEFT);
        var card = new HBox(12, avatarBox, who);
        card.setAlignment(Pos.CENTER_LEFT);
        card.setPadding(new Insets(16, 12, 16, 12));
        card.getStyleClass().add("prizm-shell-user-card");

        var wsHeading = new Label("WORKSPACES");
        wsHeading.getStyleClass().add("prizm-shell-section-heading");

        // Single-select switcher — the real PRIZM RadioGroup primitive rather
        // than a hand-rolled marker. Each item's radio dot is the marker; the
        // rich row (name + tag + detail) rides along as the item's graphic.
        var radioGroup = new PrizmRadioGroup();
        radioGroup.setSpacing(0);
        for (var w : WORKSPACES) {
            var item = workspaceItem(w, radioGroup);
            radioGroup.getChildren().add(item);
            if (w.name().equals(selectedWorkspace)) {
                item.setSelected(true);
            }
        }
        radioGroup.getToggleGroup().selectedToggleProperty().addListener((o, a, b) -> {
            if (b instanceof PrizmRadioGroupItem it && it.getUserData() instanceof String wsName) {
                selectedWorkspace = wsName;
            }
        });

        var list = new VBox(wsHeading, radioGroup);
        list.setPadding(new Insets(12, 0, 0, 0));
        var scroll = new ScrollPane(list);
        scroll.setFitToWidth(true);
        scroll.getStyleClass().addAll("scroll-pane", "prizm-shell-scroll");
        VBox.setVgrow(scroll, Priority.ALWAYS);

        var settings = new Label("Workspace settings");
        settings.getStyleClass().add("prizm-shell-panel-action");
        var footSpacer = new Region();
        HBox.setHgrow(footSpacer, Priority.ALWAYS);
        var signOut = new Label("Sign out");
        signOut.getStyleClass().add("prizm-shell-panel-action-danger");
        var footer = new HBox(settings, footSpacer, signOut);
        footer.setPadding(new Insets(8, 12, 8, 12));
        footer.getStyleClass().add("prizm-shell-panel-footer");

        var panel = new VBox(header, card, scroll, footer);
        panel.getStyleClass().add("prizm-shell-panel");
        return panel;
    }

    private PrizmRadioGroupItem workspaceItem(Workspace w, PrizmRadioGroup group) {
        var name = new Label(w.name());
        name.getStyleClass().add("prizm-shell-ws-name");
        var nameRow = new HBox(8, name);
        nameRow.setAlignment(Pos.CENTER_LEFT);
        if (w.tag() != null) {
            var tag = new PrizmBadge(w.tag().toUpperCase(), badgeVariant(w.tagVariant()));
            tag.getStyleClass().add("prizm-shell-ws-tag");
            nameRow.getChildren().add(tag);
        }
        var detail = new Label(w.detail());
        detail.getStyleClass().add("prizm-shell-ws-detail");
        var content = new VBox(2, nameRow, detail);
        // Gap between the radio dot and the row content. graphicTextGap only
        // applies between graphic and text (there is no text here), so pad the
        // content directly to reproduce the web's gap-3.
        content.setPadding(new Insets(0, 0, 0, 12));

        var item = new PrizmRadioGroupItem();
        item.setToggleGroup(group.getToggleGroup());
        item.setGraphic(content);
        item.setUserData(w.name());
        item.getStyleClass().add("prizm-shell-ws-radio");
        item.setMaxWidth(Double.MAX_VALUE);
        item.setGraphicTextGap(0);
        item.setAlignment(Pos.TOP_LEFT);
        return item;
    }

    private static PrizmBadge.Variant badgeVariant(String v) {
        return switch (v) {
            case "danger" -> PrizmBadge.Variant.DANGER;
            case "warning" -> PrizmBadge.Variant.WARNING;
            case "info" -> PrizmBadge.Variant.INFO;
            default -> PrizmBadge.Variant.SUBTLE;
        };
    }

    /* ============================================================
       Default canvas — stylised map placeholder
       ============================================================ */

    private Node defaultCanvas() {
        var canvas = new Canvas();
        // A Canvas is not resizable, so if it's a managed child its min/pref size
        // locks to its current width/height. Bound to the grid, that size only
        // ever grows, becoming a layout floor that stops the shell shrinking when
        // the window is made smaller (chrome gets pushed off-screen). Unmanage it
        // so it fills via the binding without dictating layout size.
        canvas.setManaged(false);
        var grid = new StackPane(canvas);
        grid.setMinSize(0, 0);
        grid.getStyleClass().add("prizm-shell-map");
        canvas.widthProperty().bind(grid.widthProperty());
        canvas.heightProperty().bind(grid.heightProperty());
        canvas.widthProperty().addListener((o, a, b) -> drawGrid(canvas));
        canvas.heightProperty().addListener((o, a, b) -> drawGrid(canvas));

        var label = new Label("Map placeholder — substitute your real map here");
        label.getStyleClass().add("prizm-shell-map-label");
        StackPane.setAlignment(label, Pos.BOTTOM_RIGHT);
        StackPane.setMargin(label, new Insets(0, 12, 12, 0));
        grid.getChildren().add(label);
        return grid;
    }

    private void drawGrid(Canvas canvas) {
        double w = canvas.getWidth();
        double h = canvas.getHeight();
        if (w <= 0 || h <= 0) {
            return;
        }
        GraphicsContext g = canvas.getGraphicsContext2D();
        g.clearRect(0, 0, w, h);

        // The canvas draws imperatively so it can't read looked-up CSS colours;
        // mirror the C3 token hexes per mode (border / border-strong / accent /
        // danger from styles/tokens/c3-*.css).
        boolean dark = mode == PrizmTheme.Mode.DARK;
        Color border = Color.web(dark ? "#314158" : "#cad5e2");
        // The web draws both grids from -color-border at reduced opacity (minor 0.4,
        // major 0.6) — not the full-opacity border / border-strong hexes, which read
        // too bright. Same hue, two alphas.
        Color minor = withAlpha(border, 0.4);
        Color major = withAlpha(border, 0.6);
        Color accent = Color.web(dark ? "#00d3f2" : "#007595");
        Color danger = Color.web(dark ? "#e7000b" : "#c10007");
        Color fgSubtle = Color.web(dark ? "#90a1b9" : "#45556c");
        Color fgMuted = Color.web(dark ? "#cad5e2" : "#314158");

        // Radial accent/danger glows — the subtle coloured backdrop the web draws
        // (matches shell.tsx: two accent zones + one danger, ~16% peak). Drawn
        // first so the grid + terrain sit on top.
        drawGlow(g, w, h, 0.35, 0.60, 0.55, accent);
        drawGlow(g, w, h, 0.78, 0.25, 0.42, danger);
        drawGlow(g, w, h, 0.65, 0.78, 0.45, accent);

        // Minor grid (12px, thin) + major grid (every 8th line = 96px, 1px).
        for (double x = 0; x <= w; x += 12) {
            boolean maj = ((int) Math.round(x / 12)) % 8 == 0;
            g.setStroke(maj ? major : minor);
            g.setLineWidth(maj ? 1 : 0.75);
            g.strokeLine(x + 0.5, 0, x + 0.5, h);
        }
        for (double y = 0; y <= h; y += 12) {
            boolean maj = ((int) Math.round(y / 12)) % 8 == 0;
            g.setStroke(maj ? major : minor);
            g.setLineWidth(maj ? 1 : 0.75);
            g.strokeLine(0, y + 0.5, w, y + 0.5);
        }

        // Terrain silhouette — the decorative "coastline" fill + edge (matches
        // shell.tsx). Scaled from the web's 0–100 viewBox path.
        drawTerrain(g, w, h, fgSubtle);

        // Route line — dashed accent poly running across the canvas.
        g.setStroke(accent);
        g.setLineWidth(1.5);
        g.setGlobalAlpha(0.7);
        g.setLineDashes(6, 4);
        g.beginPath();
        g.moveTo(w * 0.08, h * 0.10);
        g.bezierCurveTo(w * 0.28, h * 0.14, w * 0.34, h * 0.42, w * 0.55, h * 0.52);
        g.bezierCurveTo(w * 0.72, h * 0.62, w * 0.86, h * 0.66, w * 0.96, h * 0.90);
        g.stroke();
        g.setLineDashes(null);
        g.setGlobalAlpha(1);

        // Markers — accent contacts + one danger, sized small/med/large.
        double[][] pts = {
            {0.30, 0.40, 5, 0}, {0.55, 0.52, 7, 0}, {0.44, 0.70, 5, 0},
            {0.72, 0.38, 6, 1}, {0.82, 0.62, 5, 0}, {0.65, 0.82, 4, 0},
        };
        for (double[] p : pts) {
            double cx = w * p[0];
            double cy = h * p[1];
            double r = p[2];
            Color c = p[3] == 1 ? danger : accent;
            g.setGlobalAlpha(0.25);
            g.setFill(c);
            g.fillOval(cx - r - 3, cy - r - 3, (r + 3) * 2, (r + 3) * 2);
            g.setGlobalAlpha(1);
            g.setFill(c);
            g.fillOval(cx - r, cy - r, r * 2, r * 2);
        }

        // Compass rose — top-right (fg-muted, like the web).
        drawCompass(g, w - 34, 34, 15, fgMuted, fgMuted);

        // Scale bar — bottom-left.
        drawScaleBar(g, h, fgMuted);
    }

    private static Color withAlpha(Color c, double a) {
        return Color.color(c.getRed(), c.getGreen(), c.getBlue(), a);
    }

    private void drawGlow(GraphicsContext g, double w, double h, double cx, double cy, double r, Color c) {
        // Proportional radial gradient → stretches to the canvas aspect (an ellipse),
        // matching the web's radial-gradient(ellipse …). ~16% peak, fades to clear.
        var grad = new RadialGradient(0, 0, cx, cy, r, true, CycleMethod.NO_CYCLE,
            new Stop(0, Color.color(c.getRed(), c.getGreen(), c.getBlue(), 0.16)),
            new Stop(1, Color.color(c.getRed(), c.getGreen(), c.getBlue(), 0)));
        g.setFill(grad);
        g.fillRect(0, 0, w, h);
    }

    private void drawTerrain(GraphicsContext g, double w, double h, Color c) {
        double sx = w / 100.0;
        double sy = h / 100.0;
        // Filled silhouette down to the bottom edge.
        g.beginPath();
        g.moveTo(0, 72 * sy);
        g.bezierCurveTo(12 * sx, 68 * sy, 22 * sx, 76 * sy, 30 * sx, 70 * sy);
        g.bezierCurveTo(40 * sx, 62 * sy, 50 * sx, 68 * sy, 60 * sx, 60 * sy);
        g.bezierCurveTo(72 * sx, 50 * sy, 84 * sx, 58 * sy, 92 * sx, 52 * sy);
        g.lineTo(100 * sx, 50 * sy);
        g.lineTo(100 * sx, 100 * sy);
        g.lineTo(0, 100 * sy);
        g.closePath();
        g.setFill(Color.color(c.getRed(), c.getGreen(), c.getBlue(), 0.08));
        g.fill();
        // Edge stroke along the crest.
        g.beginPath();
        g.moveTo(0, 72 * sy);
        g.bezierCurveTo(12 * sx, 68 * sy, 22 * sx, 76 * sy, 30 * sx, 70 * sy);
        g.bezierCurveTo(40 * sx, 62 * sy, 50 * sx, 68 * sy, 60 * sx, 60 * sy);
        g.bezierCurveTo(72 * sx, 50 * sy, 84 * sx, 58 * sy, 92 * sx, 52 * sy);
        g.lineTo(100 * sx, 50 * sy);
        g.setStroke(Color.color(c.getRed(), c.getGreen(), c.getBlue(), 0.16));
        g.setLineWidth(0.6);
        g.stroke();
    }

    private void drawScaleBar(GraphicsContext g, double h, Color c) {
        double x = 12;
        double y = h - 26;
        double seg = 48;
        g.setLineWidth(1);
        g.setStroke(c);
        g.setFill(Color.color(c.getRed(), c.getGreen(), c.getBlue(), 0.3));
        g.fillRect(x, y, seg, 6);
        g.strokeRect(x + 0.5, y + 0.5, seg, 6);
        g.strokeRect(x + seg + 0.5, y + 0.5, seg, 6);
        g.setFill(c);
        g.setFont(Font.font("JetBrains Mono", 9));
        g.fillText("0", x, y + 20);
        g.fillText("1km", x + seg - 8, y + 20);
        g.fillText("2km", x + 2 * seg - 14, y + 20);
    }

    private void drawCompass(GraphicsContext g, double cx, double cy, double r, Color ring, Color cross) {
        g.setGlobalAlpha(0.7);
        g.setStroke(ring);
        g.setLineWidth(1);
        g.strokeOval(cx - r, cy - r, r * 2, r * 2);
        g.setGlobalAlpha(0.4);
        g.setStroke(cross);
        g.strokeLine(cx, cy - r, cx, cy + r);
        g.strokeLine(cx - r, cy, cx + r, cy);
        g.setGlobalAlpha(1);
        g.setFill(ring);
        g.beginPath();
        g.moveTo(cx, cy - r + 2);
        g.lineTo(cx + 3, cy);
        g.lineTo(cx, cy - 2);
        g.lineTo(cx - 3, cy);
        g.closePath();
        g.fill();
    }

    /* ============================================================
       Shared helpers
       ============================================================ */

    private PrizmButton iconButton(Node graphic, String tooltip) {
        var btn = new PrizmButton();
        btn.setVariant(PrizmButton.Variant.GHOST);
        btn.setSize(PrizmButton.Size.ICON);
        btn.setGraphic(graphic);
        btn.getStyleClass().add("prizm-shell-icon-btn");
        // Chrome toggles don't keep a persistent focus ring (web relies on
        // focus-visible); clicking the bell shouldn't leave an accent border.
        btn.setFocusTraversable(false);
        javafx.scene.control.Tooltip.install(btn, new javafx.scene.control.Tooltip(tooltip));
        return btn;
    }

    private static SVGPath icon(String path, String styleClass) {
        var p = new SVGPath();
        p.setContent(path);
        p.getStyleClass().add(styleClass);
        return p;
    }

    /**
     * A lucide icon at a target px size. Lucide paths live in a 24×24 viewport;
     * the web renders them scaled to 16/20px (h-4 / h-5), which also scales the
     * effective stroke. Mirror that by scaling the node so geometry AND stroke
     * match the web at the same nominal stroke-width.
     */
    private static SVGPath icon(String path, String styleClass, double px) {
        var p = icon(path, styleClass);
        double s = px / 24.0;
        p.setScaleX(s);
        p.setScaleY(s);
        return p;
    }

    private void retheme() {
        var scene = getScene();
        if (scene != null) {
            PrizmTheme.apply(scene, mode, pack);
        }
        // Redraw the imperatively-drawn map grid in the new tone.
        canvasHolder.getChildren().forEach(n -> {
            if (n instanceof StackPane sp) {
                sp.getChildren().forEach(c -> {
                    if (c instanceof Canvas canvas) {
                        drawGrid(canvas);
                    }
                });
            }
        });
    }

    private static List<RailItem> defaultRail() {
        return List.of(
            new RailItem("dashboard", "Dashboard", SVG_APP_DASHBOARD),
            new RailItem("ops-log", "Ops Log", SVG_APP_OPS_LOG),
            new RailItem("incidents", "Incidents", SVG_APP_ALERT_TRIANGLE, 3, BadgeTone.DANGER),
            new RailItem("tasks", "Tasks", SVG_APP_TASKS, 2, BadgeTone.WARNING),
            new RailItem("orbat", "ORBAT", SVG_APP_NETWORK),
            new RailItem("chat", "Chat", SVG_APP_CHAT, 5, BadgeTone.INFO));
    }

    private static final javafx.css.PseudoClass ACTIVE = javafx.css.PseudoClass.getPseudoClass("active");

    // ---- Icon paths — verbatim lucide-react v0.460 data (rects/circles
    // converted to path commands; plain paths copied exactly). ----
    private static final String SVG_BELL =
        "M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9 M10.3 21a1.94 1.94 0 0 0 3.4 0";
    private static final String SVG_SUN =
        "M8 12a4 4 0 1 0 8 0 4 4 0 1 0-8 0"
        + " M12 2v2 M12 20v2 M4.93 4.93l1.41 1.41 M17.66 17.66l1.41 1.41"
        + " M2 12h2 M20 12h2 M6.34 17.66l-1.41 1.41 M19.07 4.93l-1.41 1.41";
    private static final String SVG_MOON =
        "M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z";
    private static final String SVG_CHEVRONS_RIGHT =
        "M6 17l5-5-5-5 M13 17l5-5-5-5";
    private static final String SVG_CHEVRONS_LEFT =
        "M11 17l-5-5 5-5 M18 17l-5-5 5-5";
    private static final String SVG_CLOSE =
        "M18 6 6 18 M6 6l12 12";
    private static final String SVG_SEV_ALERT_CIRCLE =
        "M2 12a10 10 0 1 0 20 0 10 10 0 1 0-20 0 M12 8v4 M12 16h.01";
    private static final String SVG_SEV_INFO =
        "M2 12a10 10 0 1 0 20 0 10 10 0 1 0-20 0 M12 16v-4 M12 8h.01";
    private static final String SVG_SEV_CHECK_CIRCLE =
        "M2 12a10 10 0 1 0 20 0 10 10 0 1 0-20 0 M9 12l2 2 4-4";
    private static final String SVG_USERS =
        "M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2 M5 7a4 4 0 1 0 8 0 4 4 0 1 0-8 0"
        + " M22 21v-2a4 4 0 0 0-3-3.87 M16 3.13a4 4 0 0 1 0 7.75";

    // ---- Rail app icons ----
    private static final String SVG_APP_DASHBOARD =
        "M4 3h5a1 1 0 0 1 1 1v7a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1z"
        + " M15 3h5a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1h-5a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1z"
        + " M15 12h5a1 1 0 0 1 1 1v7a1 1 0 0 1-1 1h-5a1 1 0 0 1-1-1v-7a1 1 0 0 1 1-1z"
        + " M4 16h5a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1v-3a1 1 0 0 1 1-1z";
    private static final String SVG_APP_OPS_LOG =
        "M15 12h-5 M15 8h-5 M19 17V5a2 2 0 0 0-2-2H4"
        + " M8 21h12a2 2 0 0 0 2-2v-1a1 1 0 0 0-1-1H11a1 1 0 0 0-1 1v1a2 2 0 1 1-4 0V5a2 2 0 1 0-4 0v2a1 1 0 0 0 1 1h3";
    private static final String SVG_APP_ALERT_TRIANGLE =
        "m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3 M12 9v4 M12 17h.01";
    private static final String SVG_APP_TASKS =
        "M9 2h6a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1H9a1 1 0 0 1-1-1V3a1 1 0 0 1 1-1z"
        + " M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"
        + " M12 11h4 M12 16h4 M8 11h.01 M8 16h.01";
    private static final String SVG_APP_NETWORK =
        "M17 16h4a1 1 0 0 1 1 1v4a1 1 0 0 1-1 1h-4a1 1 0 0 1-1-1v-4a1 1 0 0 1 1-1z"
        + " M3 16h4a1 1 0 0 1 1 1v4a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1v-4a1 1 0 0 1 1-1z"
        + " M10 2h4a1 1 0 0 1 1 1v4a1 1 0 0 1-1 1h-4a1 1 0 0 1-1-1V3a1 1 0 0 1 1-1z"
        + " M5 16v-3a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v3 M12 12V8";
    private static final String SVG_APP_CHAT =
        "M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z";
    private static final String SVG_APP_LAYOUT_GRID =
        "M4 3h5a1 1 0 0 1 1 1v5a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1z"
        + " M15 3h5a1 1 0 0 1 1 1v5a1 1 0 0 1-1 1h-5a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1z"
        + " M15 14h5a1 1 0 0 1 1 1v5a1 1 0 0 1-1 1h-5a1 1 0 0 1-1-1v-5a1 1 0 0 1 1-1z"
        + " M4 14h5a1 1 0 0 1 1 1v5a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1v-5a1 1 0 0 1 1-1z";

    // ---- App Store add-on icons + pin actions ----
    private static final String SVG_ADDON_TRUCK =
        "M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2 M15 18H9"
        + " M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.624l-3.48-4.35A1 1 0 0 0 17.52 8H14"
        + " M15 18a2 2 0 1 0 4 0 2 2 0 1 0-4 0 M5 18a2 2 0 1 0 4 0 2 2 0 1 0-4 0";
    private static final String SVG_ADDON_EYE =
        "M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696"
        + " 10.75 10.75 0 0 1-19.876 0 M9 12a3 3 0 1 0 6 0 3 3 0 1 0-6 0";
    private static final String SVG_ADDON_PLANE =
        "M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5"
        + "l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2"
        + "c.4-.3.6-.7.5-1.2z";
    private static final String SVG_ADDON_LIFE_BUOY =
        "M2 12a10 10 0 1 0 20 0 10 10 0 1 0-20 0 M4.93 4.93l4.24 4.24 M14.83 9.17l4.24-4.24"
        + " M14.83 14.83l4.24 4.24 M9.17 14.83l-4.24 4.24 M8 12a4 4 0 1 0 8 0 4 4 0 1 0-8 0";
    private static final String SVG_ADDON_HEART_PULSE =
        "M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2"
        + "A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z M3.22 12H9.5l.5-1 2 4.5 2-7 1.5 3.5h5.27";
    private static final String SVG_ADDON_HOUSE =
        "M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8"
        + " M3 10a2 2 0 0 1 .709-1.528l7-5.999a2 2 0 0 1 2.582 0l7 5.999A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z";
    private static final String SVG_PIN =
        "M12 17v5 M9 10.76a2 2 0 0 1-1.11 1.79l-1.78.9A2 2 0 0 0 5 15.24V16a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1"
        + "v-.76a2 2 0 0 0-1.11-1.79l-1.78-.9A2 2 0 0 1 15 10.76V7a1 1 0 0 1 1-1 2 2 0 0 0 0-4H8a2 2 0 0 0 0 4 1 1 0 0 1 1 1z";
    private static final String SVG_PIN_OFF =
        "M12 17v5 M15 9.34V7a1 1 0 0 1 1-1 2 2 0 0 0 0-4H7.89 M2 2l20 20"
        + " M9 9v1.76a2 2 0 0 1-1.11 1.79l-1.78.9A2 2 0 0 0 5 15.24V16a1 1 0 0 0 1 1h11";
}
