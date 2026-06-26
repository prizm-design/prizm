package design.prizm.fx.controls;

import javafx.scene.control.TabPane;

/**
 * A PRIZM tab set. Thin subclass of the stock {@link TabPane}; the headers and
 * content area are restyled by the {@code .prizm-tabs} rules in {@code prizm.css}
 * (muted unselected labels, accent + muted-fill on the selected tab). Add
 * {@link javafx.scene.control.Tab}s via {@code getTabs()}. Mirrors the React
 * {@code Tabs} ({@code components/ui/tabs.tsx}).
 */
public class PrizmTabs extends TabPane {

    public PrizmTabs() {
        getStyleClass().add("prizm-tabs");
        setTabClosingPolicy(TabClosingPolicy.UNAVAILABLE);
    }
}
