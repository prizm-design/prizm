package design.prizm.fx.controls;

import javafx.scene.control.ProgressBar;

/**
 * A PRIZM determinate progress indicator. Thin subclass of the stock
 * {@link ProgressBar}; the track and accent fill are styled via the
 * {@code .prizm-progress} rules in {@code prizm.css}. Value runs 0.0–1.0
 * ({@code INDETERMINATE_PROGRESS} also renders, animated). Mirrors the React
 * {@code Progress} ({@code components/ui/progress.tsx}).
 */
public class PrizmProgress extends ProgressBar {

    public PrizmProgress() {
        super(0);
        init();
    }

    public PrizmProgress(double progress) {
        super(progress);
        init();
    }

    private void init() {
        getStyleClass().add("prizm-progress");
        setMaxWidth(Double.MAX_VALUE);
    }
}
