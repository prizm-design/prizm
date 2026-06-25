package design.prizm.fx.controls;

import javafx.scene.control.ToggleGroup;
import javafx.scene.layout.VBox;

/**
 * A PRIZM radio group: the container that owns a shared {@link ToggleGroup} and
 * holds {@link PrizmRadioGroupItem} options for single-select. Matches the React
 * {@code RadioGroup} / {@code RadioGroupItem} ({@code components/ui/radio-group.tsx}) —
 * JavaFX has no group container of its own, so this composite provides one.
 */
public class PrizmRadioGroup extends VBox {

    private final ToggleGroup group = new ToggleGroup();

    public PrizmRadioGroup() {
        setSpacing(8);
    }

    public PrizmRadioGroup(String... options) {
        this();
        for (String option : options) {
            addOption(option);
        }
    }

    /** Add an option and return its item (already joined to the shared group). */
    public PrizmRadioGroupItem addOption(String text) {
        var item = new PrizmRadioGroupItem(text);
        item.setToggleGroup(group);
        getChildren().add(item);
        return item;
    }

    public ToggleGroup getToggleGroup() {
        return group;
    }

    /** The selected option's text, or {@code null} if nothing is selected. */
    public String getSelected() {
        var toggle = group.getSelectedToggle();
        return toggle == null ? null : ((PrizmRadioGroupItem) toggle).getText();
    }

    /** Select the option whose text matches, if present. */
    public void select(String text) {
        for (var node : getChildren()) {
            if (node instanceof PrizmRadioGroupItem item && item.getText().equals(text)) {
                item.setSelected(true);
                return;
            }
        }
    }
}
