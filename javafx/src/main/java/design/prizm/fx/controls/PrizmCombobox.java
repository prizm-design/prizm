package design.prizm.fx.controls;

import javafx.beans.property.ObjectProperty;
import javafx.beans.property.SimpleObjectProperty;
import javafx.collections.FXCollections;
import javafx.collections.ObservableList;
import javafx.collections.transformation.FilteredList;
import javafx.geometry.Bounds;
import javafx.scene.Node;
import javafx.scene.input.KeyCode;
import javafx.scene.input.KeyEvent;
import javafx.scene.control.ContentDisplay;
import javafx.scene.control.ListCell;
import javafx.scene.control.ListView;
import javafx.scene.control.PopupControl;
import javafx.scene.control.Skin;
import javafx.scene.control.TextField;
import javafx.scene.layout.Region;
import javafx.scene.layout.StackPane;

/**
 * A PRIZM searchable select with typeahead. Rather than wrap JavaFX's editable
 * {@link javafx.scene.control.ComboBox} (whose arrow-keys mutate the value and
 * preview it in the editor — coupling highlight to selection), this is a custom
 * control that keeps the two separate, matching the web:
 *
 * <ul>
 *   <li><b>Highlight</b> — the popup list's selection, driven by BOTH keyboard
 *       (Up/Down) and hover (entering a row selects it), so exactly one row is
 *       highlighted at a time.</li>
 *   <li><b>Check</b> — marks the committed {@code value}, which changes ONLY when
 *       an item is chosen (Enter / click). Navigating never moves it.</li>
 * </ul>
 *
 * <p>Typing in the field filters the list. Add options via {@link #getSourceItems()}.
 * Styled by the {@code .prizm-combobox-*} rules in {@code prizm.css}. Mirrors the
 * React {@code Combobox} ({@code components/ui/combobox.tsx}).
 *
 * @param <T> the item type
 */
public class PrizmCombobox<T> extends Region {

    private final TextField field = new TextField();
    private final ObservableList<T> source = FXCollections.observableArrayList();
    private final FilteredList<T> filtered = new FilteredList<>(source, it -> true);
    private final ListView<T> list = new ListView<>(filtered);
    private final StackPane popupBox = new StackPane(list);
    private final PopupControl popup = new PopupControl();
    private final ObjectProperty<T> value = new SimpleObjectProperty<>();

    public PrizmCombobox() {
        init();
    }

    public PrizmCombobox(ObservableList<T> items) {
        source.setAll(items);
        init();
    }

    /** The backing options — add / remove here. */
    public ObservableList<T> getSourceItems() {
        return source;
    }

    /** The committed value (what the check marks). Changes only on Enter / click. */
    public ObjectProperty<T> valueProperty() {
        return value;
    }

    public T getValue() {
        return value.get();
    }

    public void setValue(T v) {
        value.set(v);
        field.setText(v == null ? "" : v.toString());
    }

    public void setPromptText(String text) {
        field.setPromptText(text);
    }

    private void init() {
        getStyleClass().add("prizm-combobox");
        field.getStyleClass().add("prizm-combobox-field");
        getChildren().add(field);
        setMinHeight(36);
        setPrefHeight(36);
        setMaxHeight(36);

        popupBox.getStyleClass().add("prizm-combobox-popup");
        list.getStyleClass().add("prizm-combobox-list");
        popup.setAutoHide(true);
        popup.setSkin(new Skin<>() {
            @Override
            public PopupControl getSkinnable() {
                return popup;
            }

            @Override
            public Node getNode() {
                return popupBox;
            }

            @Override
            public void dispose() {
                // no-op
            }
        });

        list.setCellFactory(lv -> new ListCell<>() {
            private final Region check = new Region();

            {
                check.getStyleClass().add("prizm-combobox-check");
                setContentDisplay(ContentDisplay.LEFT);
                setGraphicTextGap(8);
                // Hover selects the row, so the single selection highlight follows
                // the mouse just like the keyboard.
                setOnMouseEntered(e -> {
                    if (!isEmpty()) {
                        getListView().getSelectionModel().select(getIndex());
                    }
                });
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
                check.setVisible(item.equals(value.get())); // check = committed value
            }
        });
        list.setOnMouseClicked(e -> commit(list.getSelectionModel().getSelectedItem()));
        // The popup list takes focus when shown, so Enter/Esc must be handled
        // HERE (not on the field) — the list also does the arrow nav natively.
        list.addEventFilter(KeyEvent.KEY_PRESSED, e -> {
            if (e.getCode() == KeyCode.ENTER) {
                commit(list.getSelectionModel().getSelectedItem());
                e.consume();
            } else if (e.getCode() == KeyCode.ESCAPE) {
                popup.hide();
                e.consume();
            }
        });
        // Re-render checks if the value changes while the list is realised.
        value.addListener((o, ov, nv) -> list.refresh());

        // Type to filter; auto-highlight the first match so Enter can commit it.
        field.textProperty().addListener((obs, old, text) -> {
            var q = text == null ? "" : text.toLowerCase().trim();
            filtered.setPredicate(it -> it != null && it.toString().toLowerCase().contains(q));
            list.getSelectionModel().selectFirst();
            if (!popup.isShowing()) {
                showPopup();
            }
        });

        // Keyboard. Enter / Esc go through an event FILTER (capturing phase) so
        // they fire before the TextField's built-in behaviour consumes Enter
        // (firing its own action). Down/Up move the highlight.
        field.addEventFilter(KeyEvent.KEY_PRESSED, e -> {
            if (!popup.isShowing()) {
                return;
            }
            switch (e.getCode()) {
                case ENTER -> {
                    commit(list.getSelectionModel().getSelectedItem());
                    e.consume();
                }
                case ESCAPE -> {
                    popup.hide();
                    e.consume();
                }
                case DOWN -> {
                    moveSelection(1);
                    e.consume();
                }
                case UP -> {
                    moveSelection(-1);
                    e.consume();
                }
                default -> { }
            }
        });

        // Down opens the popup when it's closed.
        field.setOnKeyPressed(e -> {
            if (e.getCode() == KeyCode.DOWN && !popup.isShowing()) {
                showPopup();
                e.consume();
            }
        });

        // Clicking the field opens the full list.
        field.setOnMouseClicked(e -> {
            if (!popup.isShowing()) {
                filtered.setPredicate(it -> true);
                showPopup();
            }
        });
    }

    private void moveSelection(int delta) {
        if (filtered.isEmpty()) {
            return;
        }
        var model = list.getSelectionModel();
        int index = model.getSelectedIndex() + delta;
        index = Math.max(0, Math.min(filtered.size() - 1, index));
        model.select(index);
        list.scrollTo(index);
    }

    private void showPopup() {
        Bounds b = localToScreen(getBoundsInLocal());
        if (b == null) {
            return;
        }
        popupBox.setMinWidth(getWidth());
        popupBox.setPrefWidth(getWidth());
        // Size the list to its contents (cap at 8 rows; 32px fixed cell + padding).
        int rows = Math.min(Math.max(filtered.size(), 1), 8);
        list.setPrefHeight(rows * 32 + 8);
        // Start the highlight on the committed row (if visible), else the first.
        int idx = value.get() == null ? 0 : filtered.indexOf(value.get());
        list.getSelectionModel().select(idx >= 0 ? idx : 0);
        popup.show(this, b.getMinX(), b.getMaxY() + 4);
    }

    private void commit(T item) {
        if (item != null) {
            value.set(item);
            field.setText(item.toString());
            field.positionCaret(field.getText().length());
        }
        popup.hide();
    }

    @Override
    protected void layoutChildren() {
        field.resizeRelocate(0, 0, getWidth(), getHeight());
    }

    @Override
    protected double computePrefWidth(double height) {
        return Math.max(160, field.prefWidth(height));
    }

    @Override
    protected double computeMinWidth(double height) {
        return 120;
    }
}
