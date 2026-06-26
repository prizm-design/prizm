package design.prizm.fx.controls;

import java.util.ArrayList;
import java.util.List;
import java.util.function.IntConsumer;
import javafx.geometry.Pos;
import javafx.scene.control.ContentDisplay;
import javafx.scene.control.Label;
import javafx.scene.layout.HBox;
import javafx.scene.shape.Circle;

/**
 * A PRIZM pagination control — Previous / numbered pages / Next. Composite over
 * {@link HBox} of {@link PrizmButton}s (active page outlined, others ghost),
 * with ellipsis truncation (always shows the first, last, and current ± 1).
 * Styled by the {@code .prizm-pagination} rules in {@code prizm.css}. Mirrors the
 * React {@code Pagination} ({@code components/ui/pagination.tsx}).
 */
public class PrizmPagination extends HBox {

    private static final int ELLIPSIS = -1;

    private final int pageCount;
    private int current = 1;
    private IntConsumer onPageChange;

    public PrizmPagination(int pageCount) {
        this.pageCount = Math.max(1, pageCount);
        getStyleClass().add("prizm-pagination");
        setSpacing(4);
        setAlignment(Pos.CENTER_LEFT);
        rebuild();
    }

    public void setOnPageChange(IntConsumer onPageChange) {
        this.onPageChange = onPageChange;
    }

    public int getCurrent() {
        return current;
    }

    public void setCurrent(int page) {
        this.current = Math.max(1, Math.min(pageCount, page));
        rebuild();
        if (onPageChange != null) {
            onPageChange.accept(current);
        }
    }

    private void rebuild() {
        getChildren().clear();
        getChildren().add(navButton("Previous", "‹", true, current > 1, () -> setCurrent(current - 1)));
        for (int p : pageList()) {
            if (p == ELLIPSIS) {
                // Three hollow dots (like the web's icon), centred on the row.
                var dots = new HBox(2, dotShape(), dotShape(), dotShape());
                dots.getStyleClass().add("prizm-pagination__ellipsis");
                dots.setMinWidth(36);
                dots.setMaxHeight(Double.MAX_VALUE);
                dots.setAlignment(Pos.CENTER);
                getChildren().add(dots);
            } else {
                final int page = p;
                var btn = new PrizmButton(
                    Integer.toString(p),
                    p == current ? PrizmButton.Variant.OUTLINE : PrizmButton.Variant.GHOST);
                btn.setFocusTraversable(false);
                btn.setOnAction(e -> setCurrent(page));
                getChildren().add(btn);
            }
        }
        getChildren().add(navButton("Next", "›", false, current < pageCount, () -> setCurrent(current + 1)));
    }

    private Circle dotShape() {
        var dot = new Circle(1.1);
        dot.getStyleClass().add("prizm-pagination__dot");
        return dot;
    }

    /** First + last + current ± 1, with ELLIPSIS markers filling the gaps. */
    private List<Integer> pageList() {
        var out = new ArrayList<Integer>();
        for (int p = 1; p <= pageCount; p++) {
            if (p == 1 || p == pageCount || (p >= current - 1 && p <= current + 1)) {
                out.add(p);
            } else if (out.isEmpty() || out.get(out.size() - 1) != ELLIPSIS) {
                out.add(ELLIPSIS);
            }
        }
        return out;
    }

    private PrizmButton navButton(String text, String chevron, boolean left, boolean enabled, Runnable action) {
        var btn = new PrizmButton(text, PrizmButton.Variant.GHOST);
        var chev = new Label(chevron);
        chev.getStyleClass().add("prizm-pagination__chevron");
        btn.setGraphic(chev);
        btn.setGraphicTextGap(9);
        btn.setContentDisplay(left ? ContentDisplay.LEFT : ContentDisplay.RIGHT);
        btn.setFocusTraversable(false);
        btn.setDisable(!enabled);
        btn.setOnAction(e -> action.run());
        return btn;
    }
}
