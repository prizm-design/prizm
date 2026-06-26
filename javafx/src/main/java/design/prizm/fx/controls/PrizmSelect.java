package design.prizm.fx.controls;

import javafx.collections.ObservableList;
import javafx.scene.control.ComboBox;
import javafx.scene.control.ContentDisplay;
import javafx.scene.control.Label;
import javafx.scene.control.ListCell;
import javafx.scene.layout.Region;
import javafx.scene.layout.StackPane;

/**
 * A PRIZM-styled dropdown select. Subclass of {@link ComboBox}; styling comes
 * from the {@code .combo-box} / {@code .combo-box-popup} rules in {@code prizm.css}.
 * The popup marks the selected row with an accent check (like the web Select);
 * the trigger shows just the value (or the prompt). Mirrors the React
 * {@code Select} ({@code components/ui/select.tsx}).
 *
 * @param <T> the item type
 */
public class PrizmSelect<T> extends ComboBox<T> {

    public PrizmSelect() {
        super();
        init();
    }

    public PrizmSelect(ObservableList<T> items) {
        super(items);
        init();
    }

    private void init() {
        // Replace the ComboBox's default arrow with the exact same `›` glyph the
        // nav trigger uses (rotated to point down), so the two read identically.
        skinProperty().addListener((obs, was, skin) -> {
            if (skin != null) {
                installChevron();
            }
        });

        // Popup cells: item text plus an accent check on the selected row. The
        // check's space is always reserved, so every row aligns (like web pl-8).
        setCellFactory(listView -> new ListCell<>() {
            private final Region check = new Region();

            {
                check.getStyleClass().add("prizm-select-check");
                setContentDisplay(ContentDisplay.LEFT);
                setGraphicTextGap(8);
            }

            @Override
            protected void updateItem(T item, boolean empty) {
                super.updateItem(item, empty);
                if (empty || item == null) {
                    setText(null);
                    setGraphic(null);
                    return;
                }
                setText(item.toString());
                setGraphic(check);
                check.setVisible(item.equals(PrizmSelect.this.getValue()));
            }
        });

        // Trigger cell: the value, or the prompt when empty — never a check.
        setButtonCell(new ListCell<>() {
            @Override
            protected void updateItem(T item, boolean empty) {
                super.updateItem(item, empty);
                setText(empty || item == null ? PrizmSelect.this.getPromptText() : item.toString());
            }
        });
    }

    /** Swap the skin's default `.arrow` region for the shared `›` chevron glyph. */
    private void installChevron() {
        applyCss();
        if (!(lookup(".arrow-button") instanceof StackPane arrowButton)) {
            return;
        }
        if (arrowButton.lookup(".prizm-select-chevron") != null) {
            return; // already installed
        }
        Region arrow = (Region) arrowButton.lookup(".arrow");
        if (arrow != null) {
            arrow.setVisible(false);
            arrow.setManaged(false);
        }
        var chevron = new Label("›");
        chevron.getStyleClass().addAll("prizm-nav-chevron", "prizm-select-chevron");
        chevron.setRotate(90);
        arrowButton.getChildren().add(chevron);
    }
}
