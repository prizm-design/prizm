package design.prizm.fx.controls;

import javafx.scene.Node;
import javafx.scene.control.Label;
import javafx.scene.layout.VBox;

/**
 * A PRIZM surface card. No stock JavaFX control maps 1:1, so this is a small
 * composite over {@link VBox}: a styled surface with an optional title and
 * body, plus a slot for arbitrary content. Mirrors the React {@code Card}
 * ({@code components/ui/card.tsx} — {@code Card} + {@code CardTitle} +
 * {@code CardDescription}).
 */
public class PrizmCard extends VBox {

    private final Label title = new Label();
    private final Label body = new Label();

    public PrizmCard() {
        getStyleClass().add("prizm-card");
        setSpacing(8);
        title.getStyleClass().add("prizm-card__title");
        body.getStyleClass().add("prizm-card__body");
        body.setWrapText(true);
        getChildren().addAll(title, body);
    }

    public PrizmCard(String titleText, String bodyText) {
        this();
        setTitle(titleText);
        setBody(bodyText);
    }

    public void setTitle(String text) {
        title.setText(text);
    }

    public void setBody(String text) {
        body.setText(text);
    }

    public Label titleLabel() {
        return title;
    }

    public Label bodyLabel() {
        return body;
    }

    /** Append arbitrary content below the title and body. */
    public void addContent(Node... nodes) {
        getChildren().addAll(nodes);
    }
}
