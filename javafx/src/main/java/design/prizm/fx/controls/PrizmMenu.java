package design.prizm.fx.controls;

import javafx.scene.control.MenuButton;
import javafx.scene.control.MenuItem;

/**
 * A PRIZM action menu — a trigger button that opens a dropdown of items. JavaFX
 * has no standalone "menu" control, so this extends {@link MenuButton} (the
 * idiomatic trigger-plus-popup), styled by the {@code .prizm-menu} rules (the
 * trigger) and the shared {@code .context-menu} / {@code .menu-item} rules (the
 * popup) in {@code prizm.css}.
 *
 * <p>Holds stock JavaFX menu items — {@link MenuItem},
 * {@link javafx.scene.control.CheckMenuItem}, {@link javafx.scene.control.RadioMenuItem},
 * {@link javafx.scene.control.SeparatorMenuItem}, nested
 * {@link javafx.scene.control.Menu} submenus, and item accelerators (the web's
 * shortcut). Mirrors the React {@code Menu} ({@code components/ui/menu.tsx}).
 */
public class PrizmMenu extends MenuButton {

    public PrizmMenu() {
        init();
    }

    public PrizmMenu(String text) {
        super(text);
        init();
    }

    public PrizmMenu(String text, MenuItem... items) {
        super(text, null, items);
        init();
    }

    private void init() {
        getStyleClass().add("prizm-menu");
    }
}
