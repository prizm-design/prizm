package design.prizm.fx.controls;

import javafx.scene.control.ContextMenu;
import javafx.scene.control.MenuItem;

/**
 * A PRIZM right-click action menu. Thin subclass of the stock
 * {@link ContextMenu}; the popup and its items are styled by the shared
 * {@code .context-menu} / {@code .menu-item} rules in {@code prizm.css}. Attach
 * to a control with {@code control.setContextMenu(...)}.
 *
 * <p>Holds stock JavaFX menu items — {@link MenuItem},
 * {@link javafx.scene.control.CheckMenuItem}, {@link javafx.scene.control.RadioMenuItem},
 * {@link javafx.scene.control.SeparatorMenuItem}, and nested
 * {@link javafx.scene.control.Menu} submenus — which the rules style. Mirrors
 * the React {@code ContextMenu} ({@code components/ui/context-menu.tsx}).
 */
public class PrizmContextMenu extends ContextMenu {

    public PrizmContextMenu() {
        super();
    }

    public PrizmContextMenu(MenuItem... items) {
        super(items);
    }
}
