package design.prizm.fx.controls;

import java.util.ArrayList;
import java.util.List;
import javafx.geometry.Pos;
import javafx.scene.Node;
import javafx.scene.control.Label;
import javafx.scene.control.ScrollPane;
import javafx.scene.layout.HBox;
import javafx.scene.layout.Priority;
import javafx.scene.layout.Region;
import javafx.scene.layout.StackPane;
import javafx.scene.layout.VBox;
import javafx.scene.shape.SVGPath;

/**
 * A PRIZM command palette — a search field over a filtered, grouped action list.
 * Shown inline (like the web example), not behind a trigger: an {@link VBox} with
 * a search row, a scrollable list of grouped two-line items, and a footer with
 * keyboard hints and a live result count. Items filter live by title, subtitle,
 * and keywords; Up/Down move the active row and Enter runs it. Styled by the
 * {@code .prizm-command} rules in {@code prizm.css}. Mirrors the React
 * {@code Command} ({@code components/ui/command.tsx}).
 */
public class PrizmCommand extends VBox {

    /** lucide Search, 24×24 — the magnifier in the search row. */
    private static final String SEARCH_ICON =
        "M19 11 A8 8 0 1 1 3 11 A8 8 0 1 1 19 11 Z M21 21 L16.7 16.7";
    /** lucide Check, 24×24 — the trailing mark on the selected entry. */
    private static final String CHECK_ICON = "M20 6 L9 17 L4 12";

    private final PrizmInput search = new PrizmInput("", "Type a command or search…");
    private final VBox listBox = new VBox();
    private final Label emptyLabel = new Label("No results found.");
    private final Label countLabel = new Label();

    private final List<Group> groups = new ArrayList<>();
    private final List<Row> visible = new ArrayList<>();
    private int activeIndex = -1;
    private Row selected;

    /** One palette entry: its node, the lower-cased text to match, a trailing check, and its action. */
    private static final class Row {
        final HBox node;
        final String haystack;
        final Node check;
        final Runnable action;

        Row(HBox node, String haystack, Node check, Runnable action) {
            this.node = node;
            this.haystack = haystack;
            this.check = check;
            this.action = action;
        }
    }

    /** A titled section of the palette; add entries via {@link #add}. */
    public final class Group {
        private final VBox box = new VBox();
        private final Region separator = new Region();
        private final List<Row> rows = new ArrayList<>();

        private Group(String heading, boolean first) {
            separator.getStyleClass().add("prizm-command__separator");
            var headingLabel = new Label(heading);
            headingLabel.getStyleClass().add("prizm-command__group-heading");
            box.getStyleClass().add("prizm-command__group");
            box.getChildren().add(headingLabel);
            if (!first) {
                listBox.getChildren().add(separator);
            }
            listBox.getChildren().add(box);
        }

        /** Add an entry with an icon box, a title, a subtitle, search keywords, and an action. */
        public Group add(Node icon, String title, String subtitle, List<String> keywords, Runnable action) {
            var titleLabel = new Label(title);
            titleLabel.getStyleClass().add("prizm-command__item-title");
            var subtitleLabel = new Label(subtitle);
            subtitleLabel.getStyleClass().add("prizm-command__item-subtitle");
            var text = new VBox(titleLabel, subtitleLabel);
            HBox.setHgrow(text, Priority.ALWAYS);

            var check = new SVGPath();
            check.setContent(CHECK_ICON);
            check.getStyleClass().add("prizm-command__check");
            check.setScaleX(16.0 / 24.0);
            check.setScaleY(16.0 / 24.0);
            var checkBox = new StackPane(check);
            checkBox.setMinSize(16, 16);
            checkBox.setVisible(false);
            checkBox.setManaged(false);

            var node = new HBox(12, icon, text, checkBox);
            node.getStyleClass().add("prizm-command__item");
            node.setAlignment(Pos.CENTER_LEFT);

            var haystack = (title + " " + subtitle + " " + String.join(" ", keywords)).toLowerCase();
            var row = new Row(node, haystack, checkBox, action);
            rows.add(row);

            node.setOnMouseEntered(e -> setActive(row));
            node.setOnMouseClicked(e -> run(row));
            box.getChildren().add(node);
            recompute();
            return this;
        }
    }

    public PrizmCommand() {
        getStyleClass().add("prizm-command");

        var icon = new SVGPath();
        icon.setContent(SEARCH_ICON);
        icon.getStyleClass().add("prizm-command__search-icon");
        icon.setScaleX(16.0 / 24.0);
        icon.setScaleY(16.0 / 24.0);
        var iconBox = new StackPane(icon);
        iconBox.setMinWidth(20);
        search.getStyleClass().add("prizm-command__search");
        HBox.setHgrow(search, Priority.ALWAYS);
        var searchRow = new HBox(4, iconBox, search);
        searchRow.getStyleClass().add("prizm-command__search-row");
        searchRow.setAlignment(Pos.CENTER_LEFT);

        search.textProperty().addListener((obs, was, now) -> recompute());
        search.setOnKeyPressed(e -> {
            switch (e.getCode()) {
                case DOWN -> moveActive(1);
                case UP -> moveActive(-1);
                case ENTER -> runActive();
                default -> { }
            }
        });

        emptyLabel.getStyleClass().add("prizm-command__empty");
        emptyLabel.setMaxWidth(Double.MAX_VALUE);
        emptyLabel.setAlignment(Pos.CENTER);

        listBox.getStyleClass().add("prizm-command__list");
        var content = new VBox(listBox, emptyLabel);
        var scroll = new ScrollPane(content);
        scroll.getStyleClass().add("prizm-command__scroll");
        scroll.setFitToWidth(true);
        scroll.setMaxHeight(288);
        scroll.setHbarPolicy(ScrollPane.ScrollBarPolicy.NEVER);

        var footer = footer();
        getChildren().addAll(searchRow, scroll, footer);
        recompute();
    }

    /** Add a titled group; entries are added on the returned {@link Group}. */
    public Group addGroup(String heading) {
        var group = new Group(heading, groups.isEmpty());
        groups.add(group);
        recompute();
        return group;
    }

    /** Build a stroked lucide icon (24×24 path) inside the standard rounded icon box. */
    public static Node icon(String svgPathContent) {
        var path = new SVGPath();
        path.setContent(svgPathContent);
        path.getStyleClass().add("prizm-command__icon");
        path.setScaleX(16.0 / 24.0);
        path.setScaleY(16.0 / 24.0);
        var box = new StackPane(path);
        box.getStyleClass().add("prizm-command__icon-box");
        box.setMinSize(28, 28);
        box.setPrefSize(28, 28);
        box.setMaxSize(28, 28);
        return box;
    }

    private Node footer() {
        var footer = new HBox();
        footer.getStyleClass().add("prizm-command__footer");
        footer.setAlignment(Pos.CENTER_LEFT);
        var spacer = new Region();
        HBox.setHgrow(spacer, Priority.ALWAYS);
        countLabel.getStyleClass().add("prizm-command__count");
        var hints = new HBox(12, hint("↑↓", "navigate"), hint("↵", "select"));
        hints.setAlignment(Pos.CENTER_LEFT);
        footer.getChildren().addAll(hints, spacer, countLabel);
        return footer;
    }

    private Node hint(String keys, String text) {
        var kbd = new Label(keys);
        kbd.getStyleClass().add("prizm-command__kbd");
        var label = new Label(text);
        label.getStyleClass().add("prizm-command__hint");
        var row = new HBox(4, kbd, label);
        row.setAlignment(Pos.CENTER_LEFT);
        return row;
    }

    /** Re-filter every row against the query, then refresh groups, count, and selection. */
    private void recompute() {
        var q = search.getText() == null ? "" : search.getText().toLowerCase().trim();
        visible.clear();
        var anyGroupBefore = false;
        for (var group : groups) {
            var groupHasVisible = false;
            for (var row : group.rows) {
                var show = q.isEmpty() || row.haystack.contains(q);
                row.node.setVisible(show);
                row.node.setManaged(show);
                if (show) {
                    groupHasVisible = true;
                    visible.add(row);
                }
            }
            group.box.setVisible(groupHasVisible);
            group.box.setManaged(groupHasVisible);
            var showSeparator = groupHasVisible && anyGroupBefore;
            group.separator.setVisible(showSeparator);
            group.separator.setManaged(showSeparator);
            anyGroupBefore |= groupHasVisible;
        }

        var none = visible.isEmpty();
        emptyLabel.setVisible(none);
        emptyLabel.setManaged(none);
        countLabel.setText(visible.size() + (visible.size() == 1 ? " result" : " results"));

        activeIndex = none ? -1 : 0;
        highlight();
    }

    private void setActive(Row row) {
        var index = visible.indexOf(row);
        if (index >= 0) {
            activeIndex = index;
            highlight();
        }
    }

    private void moveActive(int delta) {
        if (visible.isEmpty()) {
            return;
        }
        activeIndex = Math.floorMod(activeIndex + delta, visible.size());
        highlight();
    }

    private void highlight() {
        for (var group : groups) {
            for (var row : group.rows) {
                row.node.getStyleClass().remove("is-active");
            }
        }
        if (activeIndex >= 0 && activeIndex < visible.size()) {
            visible.get(activeIndex).node.getStyleClass().add("is-active");
        }
    }

    private void runActive() {
        if (activeIndex >= 0 && activeIndex < visible.size()) {
            run(visible.get(activeIndex));
        }
    }

    private void run(Row row) {
        selected = row;
        for (var group : groups) {
            for (var r : group.rows) {
                var on = r == selected;
                r.check.setVisible(on);
                r.check.setManaged(on);
                r.node.getStyleClass().remove("is-selected");
                if (on) {
                    r.node.getStyleClass().add("is-selected");
                }
            }
        }
        if (row.action != null) {
            row.action.run();
        }
    }
}
