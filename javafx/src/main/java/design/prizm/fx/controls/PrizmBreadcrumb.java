package design.prizm.fx.controls;

import javafx.geometry.Pos;
import javafx.scene.control.Hyperlink;
import javafx.scene.control.Label;
import javafx.scene.layout.HBox;

/**
 * A PRIZM breadcrumb trail. Composite over {@link HBox}: clickable ancestor
 * crumbs (muted → foreground on hover) separated by chevrons, ending in a
 * non-link current page. Styled by the {@code .prizm-breadcrumb} rules in
 * {@code prizm.css}. Mirrors the React {@code Breadcrumb}
 * ({@code components/ui/breadcrumb.tsx}).
 */
public class PrizmBreadcrumb extends HBox {

    public PrizmBreadcrumb() {
        getStyleClass().add("prizm-breadcrumb");
        setSpacing(6);
        setAlignment(Pos.CENTER_LEFT);
    }

    /** Add a clickable ancestor crumb; wire navigation via the returned link's setOnAction. */
    public Hyperlink addCrumb(String label) {
        separateIfNeeded();
        var link = new Hyperlink(label);
        link.getStyleClass().add("prizm-breadcrumb__link");
        getChildren().add(link);
        return link;
    }

    /** Add the current (non-link) page — the tail of the trail. */
    public Label addCurrent(String label) {
        separateIfNeeded();
        var current = new Label(label);
        current.getStyleClass().add("prizm-breadcrumb__current");
        getChildren().add(current);
        return current;
    }

    private void separateIfNeeded() {
        if (!getChildren().isEmpty()) {
            var sep = new Label("›");
            sep.getStyleClass().add("prizm-breadcrumb__sep");
            getChildren().add(sep);
        }
    }
}
