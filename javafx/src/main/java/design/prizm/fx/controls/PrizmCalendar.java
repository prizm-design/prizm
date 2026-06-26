package design.prizm.fx.controls;

import java.time.LocalDate;
import java.time.YearMonth;
import java.time.format.TextStyle;
import java.util.Locale;
import java.util.function.Consumer;
import javafx.geometry.Pos;
import javafx.scene.Node;
import javafx.scene.control.Label;
import javafx.scene.layout.GridPane;
import javafx.scene.layout.HBox;
import javafx.scene.layout.Priority;
import javafx.scene.layout.Region;
import javafx.scene.layout.VBox;

/**
 * A PRIZM calendar — a month grid with selection. No stock JavaFX standalone
 * month grid exists (the stock {@code DatePicker} embeds one in a popup), so
 * this is a custom {@link VBox}: a header with month navigation, a day-name row,
 * and a 7-column grid of day cells (today outlined, selected filled). Styled by
 * the {@code .prizm-calendar} rules in {@code prizm.css}. Mirrors the React
 * {@code Calendar} ({@code components/ui/calendar.tsx}).
 */
public class PrizmCalendar extends VBox {

    private static final String[] DAY_NAMES = {"Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"};

    private YearMonth shown = YearMonth.now();
    private LocalDate selected;
    private Consumer<LocalDate> onSelect;

    private final Label monthLabel = new Label();
    private final GridPane days = new GridPane();

    public PrizmCalendar() {
        getStyleClass().add("prizm-calendar");
        setSpacing(8);
        days.setVgap(2);
        getChildren().addAll(header(), dayNameRow(), days);
        render();
    }

    public void setOnSelect(Consumer<LocalDate> onSelect) {
        this.onSelect = onSelect;
    }

    public LocalDate getSelected() {
        return selected;
    }

    public void setSelected(LocalDate date) {
        this.selected = date;
        if (date != null) {
            shown = YearMonth.from(date);
        }
        render();
    }

    private Node header() {
        var prev = navButton("‹", () -> {
            shown = shown.minusMonths(1);
            render();
        });
        var next = navButton("›", () -> {
            shown = shown.plusMonths(1);
            render();
        });
        monthLabel.getStyleClass().add("prizm-calendar__month");
        var left = new Region();
        var right = new Region();
        HBox.setHgrow(left, Priority.ALWAYS);
        HBox.setHgrow(right, Priority.ALWAYS);
        var bar = new HBox(prev, left, monthLabel, right, next);
        bar.setAlignment(Pos.CENTER);
        return bar;
    }

    private Node dayNameRow() {
        var row = new GridPane();
        for (int i = 0; i < 7; i++) {
            var label = new Label(DAY_NAMES[i]);
            label.getStyleClass().add("prizm-calendar__dayname");
            label.setAlignment(Pos.CENTER);
            label.setMinSize(32, 28);
            label.setPrefSize(32, 28);
            row.add(label, i, 0);
        }
        return row;
    }

    private void render() {
        monthLabel.setText(
            shown.getMonth().getDisplayName(TextStyle.FULL, Locale.ENGLISH) + " " + shown.getYear());
        days.getChildren().clear();
        int offset = shown.atDay(1).getDayOfWeek().getValue() % 7; // Sunday = 0
        int length = shown.lengthOfMonth();
        for (int day = 1; day <= length; day++) {
            int index = offset + day - 1;
            days.add(dayCell(day), index % 7, index / 7);
        }
    }

    private Label dayCell(int day) {
        var date = shown.atDay(day);
        var cell = new Label(Integer.toString(day));
        cell.getStyleClass().add("prizm-calendar__day");
        cell.setAlignment(Pos.CENTER);
        cell.setMinSize(32, 32);
        cell.setPrefSize(32, 32);
        if (date.equals(LocalDate.now())) {
            cell.getStyleClass().add("prizm-calendar__day--today");
        }
        if (date.equals(selected)) {
            cell.getStyleClass().add("prizm-calendar__day--selected");
        }
        cell.setOnMouseClicked(e -> {
            selected = date;
            if (onSelect != null) {
                onSelect.accept(date);
            }
            render();
        });
        return cell;
    }

    private PrizmButton navButton(String label, Runnable action) {
        var btn = new PrizmButton(label, PrizmButton.Variant.GHOST);
        btn.setSize(PrizmButton.Size.SM);
        btn.getStyleClass().add("prizm-calendar__nav");
        btn.setFocusTraversable(false);
        btn.setOnAction(e -> action.run());
        return btn;
    }
}
