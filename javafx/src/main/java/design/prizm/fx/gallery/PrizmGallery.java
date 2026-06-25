package design.prizm.fx.gallery;

import design.prizm.fx.PrizmTheme;
import design.prizm.fx.controls.PrizmButton;
import design.prizm.fx.controls.PrizmCard;
import design.prizm.fx.controls.PrizmCheckbox;
import design.prizm.fx.controls.PrizmInput;
import design.prizm.fx.controls.PrizmLabel;
import design.prizm.fx.controls.PrizmRadioGroup;
import design.prizm.fx.controls.PrizmSelect;
import design.prizm.fx.controls.PrizmSlider;
import design.prizm.fx.controls.PrizmTextarea;
import java.util.List;
import javafx.application.Application;
import javafx.geometry.Insets;
import javafx.geometry.Pos;
import javafx.scene.Node;
import javafx.scene.Scene;
import javafx.scene.control.CheckBox;
import javafx.scene.control.Label;
import javafx.scene.control.ScrollPane;
import javafx.scene.layout.FlowPane;
import javafx.scene.layout.HBox;
import javafx.scene.layout.Priority;
import javafx.scene.layout.Region;
import javafx.scene.layout.VBox;
import javafx.stage.Stage;

/**
 * PRIZM JavaFX gallery — a runnable showcase of every JavaFX-ready control, in
 * all variants and states, with live theme (dark/light) and capability-pack
 * (RC3 Ember) toggles.
 *
 * <p>Because the docs site can't render JavaFX, this gallery is the canonical
 * *visual* reference for the library. Add a {@link Section} to {@link #sections()}
 * as each control ships — that single edit is all the gallery needs.
 *
 * <pre>
 *   gradle run        launch from source (developer)
 *   gradle jpackage   build a self-contained native app (see build.gradle.kts)
 * </pre>
 */
public class PrizmGallery extends Application {

    private PrizmTheme.Mode mode = PrizmTheme.Mode.DARK;
    private PrizmTheme.Pack pack = PrizmTheme.Pack.NONE;
    private Scene scene;

    /** Registry of gallery sections — one entry per JavaFX-ready control. */
    private List<Section> sections() {
        return List.of(
            new Section("Button", "Six variants, four sizes, plus disabled.", buttons()),
            new Section("Input", "Prompt, filled, and disabled.", inputs()),
            new Section("Textarea", "Multi-line input.", textarea()),
            new Section("Checkbox", "Selected, unselected, disabled.", checkboxes()),
            new Section("Radio Group", "Single-select group.", radios()),
            new Section("Select", "Dropdown selection.", select()),
            new Section("Slider", "Range input.", slider()),
            new Section("Label", "Form label paired with a control.", labels()),
            new Section("Card", "Surface container with title, body, and a content slot.", cards()));
    }

    @Override
    public void start(Stage stage) {
        var content = new VBox(28);
        content.setPadding(new Insets(28));
        for (var section : sections()) {
            content.getChildren().add(sectionView(section));
        }

        var scroll = new ScrollPane(content);
        scroll.setFitToWidth(true);

        var root = new VBox(toolbar(), scroll);
        root.getStyleClass().add("gallery-root");
        VBox.setVgrow(scroll, Priority.ALWAYS);

        scene = new Scene(root, 720, 760);
        retheme();
        stage.setTitle("PRIZM JavaFX — gallery");
        stage.setScene(scene);
        stage.show();
    }

    private Region toolbar() {
        var title = new Label("PRIZM JavaFX");
        title.getStyleClass().add("gallery-title");

        var dark = new CheckBox("Dark");
        dark.setSelected(true);
        dark.setOnAction(e -> {
            mode = dark.isSelected() ? PrizmTheme.Mode.DARK : PrizmTheme.Mode.LIGHT;
            retheme();
        });

        var rc3 = new CheckBox("RC3 pack (Ember)");
        rc3.setOnAction(e -> {
            pack = rc3.isSelected() ? PrizmTheme.Pack.RC3 : PrizmTheme.Pack.NONE;
            retheme();
        });

        var spacer = new Region();
        HBox.setHgrow(spacer, Priority.ALWAYS);

        var bar = new HBox(16, title, spacer, dark, rc3);
        bar.setAlignment(Pos.CENTER_LEFT);
        bar.setPadding(new Insets(14, 20, 14, 20));
        bar.getStyleClass().add("gallery-toolbar");
        return bar;
    }

    private Node sectionView(Section section) {
        var heading = new Label(section.title());
        heading.getStyleClass().add("gallery-heading");
        var head = new VBox(2, heading, caption(section.blurb()));
        return new VBox(14, head, section.content());
    }

    private Node buttons() {
        var variants = new FlowPane(8, 8,
            new PrizmButton("Solid", PrizmButton.Variant.SOLID),
            new PrizmButton("Outline", PrizmButton.Variant.OUTLINE),
            new PrizmButton("Ghost", PrizmButton.Variant.GHOST),
            new PrizmButton("Subtle", PrizmButton.Variant.SUBTLE),
            new PrizmButton("Danger", PrizmButton.Variant.DANGER),
            new PrizmButton("Link", PrizmButton.Variant.LINK));

        var sm = new PrizmButton("Small", PrizmButton.Variant.SOLID);
        sm.setSize(PrizmButton.Size.SM);
        var md = new PrizmButton("Medium", PrizmButton.Variant.SOLID);
        var lg = new PrizmButton("Large", PrizmButton.Variant.SOLID);
        lg.setSize(PrizmButton.Size.LG);
        var sizes = new FlowPane(8, 8, sm, md, lg);

        var disabled = new PrizmButton("Disabled", PrizmButton.Variant.SOLID);
        disabled.setDisable(true);

        return new VBox(10,
            labelled("Variants", variants),
            labelled("Sizes", sizes),
            labelled("States", new FlowPane(8, 8, disabled)));
    }

    private Node cards() {
        var card = new PrizmCard("Mission", "Sortie 04 — nominal. Two platforms on task.");
        var acknowledge = new PrizmButton("Acknowledge", PrizmButton.Variant.SOLID);
        acknowledge.setSize(PrizmButton.Size.SM);
        var details = new PrizmButton("Details", PrizmButton.Variant.OUTLINE);
        details.setSize(PrizmButton.Size.SM);
        card.addContent(new HBox(8, acknowledge, details));
        card.setMaxWidth(360);
        return card;
    }

    private Node inputs() {
        var prompt = new PrizmInput("", "Search platforms…");
        prompt.setPrefWidth(180);
        var filled = new PrizmInput("UGV-04");
        filled.setPrefWidth(140);
        var disabled = new PrizmInput("Read-only");
        disabled.setPrefWidth(140);
        disabled.setDisable(true);
        return new FlowPane(8, 8, prompt, filled, disabled);
    }

    private Node textarea() {
        var ta = new PrizmTextarea("", "Mission notes…");
        ta.setPrefRowCount(3);
        ta.setPrefWidth(320);
        return ta;
    }

    private Node checkboxes() {
        var a = new PrizmCheckbox("Geofence enabled");
        a.setSelected(true);
        var b = new PrizmCheckbox("Auto-RTB on low battery");
        var c = new PrizmCheckbox("Locked (disabled)");
        c.setSelected(true);
        c.setDisable(true);
        return new VBox(8, a, b, c);
    }

    private Node radios() {
        var group = new PrizmRadioGroup("Patrol", "Loiter", "Return to base");
        group.select("Patrol");
        return group;
    }

    private Node select() {
        var combo = new PrizmSelect<String>();
        combo.getItems().addAll("UGV-04", "UAV-11", "USV-02");
        combo.setValue("UGV-04");
        combo.setPrefWidth(220);
        return combo;
    }

    private Node slider() {
        var s = new PrizmSlider(0, 100, 60);
        s.setPrefWidth(260);
        return s;
    }

    private Node labels() {
        return new VBox(6, new PrizmLabel("Call sign"), new PrizmInput("", "e.g. UGV-04"));
    }

    private Node labelled(String text, Node node) {
        return new VBox(6, caption(text), node);
    }

    private Label caption(String text) {
        var label = new Label(text);
        label.getStyleClass().add("gallery-caption");
        return label;
    }

    private void retheme() {
        PrizmTheme.apply(scene, mode, pack);
    }

    public static void main(String[] args) {
        launch(args);
    }

    private record Section(String title, String blurb, Node content) {}
}
