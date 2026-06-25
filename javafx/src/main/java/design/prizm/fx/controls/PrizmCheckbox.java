package design.prizm.fx.controls;

import javafx.scene.control.CheckBox;

/**
 * A PRIZM-styled checkbox. Thin subclass of {@link CheckBox}; styling comes
 * from the {@code .check-box} rules in {@code prizm.css} (accent fill when
 * selected). Mirrors the React {@code Checkbox} ({@code components/ui/checkbox.tsx}).
 */
public class PrizmCheckbox extends CheckBox {

    public PrizmCheckbox() {
        super();
    }

    public PrizmCheckbox(String text) {
        super(text);
    }
}
