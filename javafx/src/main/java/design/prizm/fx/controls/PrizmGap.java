package design.prizm.fx.controls;

/**
 * The PRIZM spacing scale, in pixels — the gap between children of a
 * {@link PrizmStack} or {@link PrizmGroup}. Mirrors the constrained gap scale
 * the web {@code Stack} / {@code Group} expose (Tailwind spacing units):
 * {@code NONE=0, XXS=4, XS=8, SM=12, MD=16, LG=24, XL=32, XXL=48}.
 */
public enum PrizmGap {
    NONE(0),
    XXS(4),
    XS(8),
    SM(12),
    MD(16),
    LG(24),
    XL(32),
    XXL(48);

    private final double px;

    PrizmGap(double px) {
        this.px = px;
    }

    /** The gap size in pixels. */
    public double px() {
        return px;
    }
}
