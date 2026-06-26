package design.prizm.fx.controls;

import javafx.animation.RotateTransition;
import javafx.geometry.Pos;
import javafx.scene.control.ContentDisplay;
import javafx.scene.control.Label;
import javafx.scene.control.MenuButton;
import javafx.scene.control.MenuItem;
import javafx.scene.layout.HBox;
import javafx.util.Duration;

/**
 * A PRIZM navigation menu — a horizontal row of dropdown triggers. The web
 * {@code NavigationMenu} is a site nav whose triggers carry a chevron that flips
 * down→up when the menu opens; a stock {@link javafx.scene.control.MenuBar}
 * can't do that, so this is an {@link HBox} of {@link MenuButton} triggers, each
 * with a chevron graphic rotated on open. Triggers are styled by
 * {@code .prizm-nav-trigger}; the dropdowns reuse the shared {@code .context-menu}
 * / {@code .menu-item} rules. Mirrors the React {@code NavigationMenu}
 * ({@code components/ui/navigation-menu.tsx}).
 */
public class PrizmNavigationMenu extends HBox {

    public PrizmNavigationMenu() {
        getStyleClass().add("prizm-navigation-menu");
        setSpacing(4);
        setAlignment(Pos.CENTER_LEFT);
    }

    /** Add a top-level trigger with its dropdown items; returns the MenuButton. */
    public MenuButton addMenu(String label, MenuItem... items) {
        var trigger = new MenuButton(label);
        trigger.getStyleClass().add("prizm-nav-trigger");
        trigger.getItems().addAll(items);

        // The same thin chevron glyph as pagination (`›`), rotated to point down.
        var chevron = new Label("›");
        chevron.getStyleClass().add("prizm-nav-chevron");
        chevron.setRotate(90);
        trigger.setGraphic(chevron);
        trigger.setContentDisplay(ContentDisplay.RIGHT);
        trigger.setGraphicTextGap(6);

        // Flip the chevron down→up while the dropdown is open.
        trigger.showingProperty().addListener((obs, was, showing) -> {
            var spin = new RotateTransition(Duration.millis(150), chevron);
            spin.setToAngle(showing ? 270 : 90);
            spin.play();
        });

        getChildren().add(trigger);
        return trigger;
    }
}
