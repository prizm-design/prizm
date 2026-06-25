package design.prizm.fx.controls;

import javafx.scene.control.RadioButton;

/**
 * A single option within a {@link PrizmRadioGroup}. Thin subclass of
 * {@link RadioButton}; styling comes from the {@code .radio-button} rules in
 * {@code prizm.css}. Mirrors the React {@code RadioGroupItem}
 * ({@code components/ui/radio-group.tsx}).
 */
public class PrizmRadioGroupItem extends RadioButton {

    public PrizmRadioGroupItem() {
        super();
    }

    public PrizmRadioGroupItem(String text) {
        super(text);
    }
}
