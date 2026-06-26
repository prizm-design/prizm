package design.prizm.fx.controls;

import javafx.scene.AccessibleRole;
import javafx.scene.control.Skin;
import javafx.scene.control.ToggleButton;

/**
 * A PRIZM-styled switch — a sliding on/off toggle for settings that take effect
 * immediately. JavaFX has no stock switch, so this is a {@link ToggleButton}
 * (for its {@code selected} property, keyboard, and toggle behaviour) restyled
 * as a track + sliding thumb via {@link PrizmSwitchSkin} and the
 * {@code .prizm-switch} rules in {@code prizm.css}.
 *
 * <p>Carries no label text of its own — pair it with a {@link PrizmLabel} or a
 * {@link PrizmField}, like the web. Mirrors the React {@code Switch}
 * ({@code components/ui/switch.tsx}).
 */
public class PrizmSwitch extends ToggleButton {

    public PrizmSwitch() {
        init();
    }

    public PrizmSwitch(boolean selected) {
        init();
        setSelected(selected);
    }

    private void init() {
        // Drop the toggle-button / button style classes so Modena's button
        // chrome and focus ring don't apply — the track is styled by .prizm-switch.
        getStyleClass().setAll("prizm-switch");
        // No stock SWITCH role exists; TOGGLE_BUTTON is the closest semantic.
        setAccessibleRole(AccessibleRole.TOGGLE_BUTTON);
        // Fixed track footprint (34×20).
        setMinSize(34, 20);
        setPrefSize(34, 20);
        setMaxSize(34, 20);
    }

    @Override
    protected Skin<?> createDefaultSkin() {
        return new PrizmSwitchSkin(this);
    }
}
