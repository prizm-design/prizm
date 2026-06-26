package design.prizm.fx.controls;

import javafx.collections.ObservableList;
import javafx.scene.control.TableView;

/**
 * A PRIZM-styled data table. Thin subclass of the stock {@link TableView};
 * the header, row borders, hover, and selection are restyled via the
 * {@code .prizm-table} rules in {@code prizm.css}.
 *
 * <p><b>Paradigm note:</b> the web {@code Table} is compositional — you write
 * {@code TableRow} / {@code TableCell} markup by hand. JavaFX is data-driven:
 * you set {@code items} (an {@code ObservableList<T>}) and add {@code TableColumn}s
 * with cell-value factories. This is the idiomatic thick-client table, so the
 * API differs from the web by design; only the visual styling is in parity.
 * Mirrors {@code components/ui/table.tsx}.
 *
 * @param <T> the row item type
 */
public class PrizmTable<T> extends TableView<T> {

    public PrizmTable() {
        super();
        getStyleClass().add("prizm-table");
    }

    public PrizmTable(ObservableList<T> items) {
        super(items);
        getStyleClass().add("prizm-table");
    }
}
