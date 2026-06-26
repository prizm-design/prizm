/**
 * The JavaFX API surface for PRIZM controls.
 *
 * Parallel to lib/components-api.ts (the React surface). Keyed by the same
 * component slug so the docs site can show a JavaFX block under the C3 view of
 * /components/<slug>. Both libraries implement to the shared component spec;
 * this file documents the Java side — class, base type, constructors, and the
 * typed knobs (enums + setters) it exposes.
 *
 * SCOPE — C3 and its extension packs only; Enterprise is web-only. This is a
 * discovery reference, not a customization guide.
 *
 * MAINTENANCE — keep entries in sync with the Java source under javafx/ and
 * with the React variants in lib/components-api.ts. When the React variants
 * change, the JavaFX variants must change with them (spec parity).
 */

export interface JavaFxMember {
  /** Member name, e.g. "setVariant" or "Variant". */
  name: string;
  /** Java type or signature as a display string. */
  type: string;
  /** Default value as a display string, if any. */
  default?: string;
  description: string;
}

export interface JavaFxControlApi {
  /** Java class name, e.g. "PrizmButton". */
  className: string;
  /** Java package the class lives in. */
  package: string;
  /** The JavaFX type it extends or composes. */
  base: string;
  /** Available constructors as display signatures. */
  constructors: string[];
  /** Public API: enums, setters, key methods. */
  members: JavaFxMember[];
  /** Optional note about behaviour / styling / accessibility. */
  notes?: string;
}

export const JAVAFX_API: Record<string, JavaFxControlApi> = {
  // ----- Actions -----
  button: {
    className: "PrizmButton",
    package: "design.prizm.fx.controls",
    base: "javafx.scene.control.Button",
    constructors: [
      "PrizmButton()",
      "PrizmButton(String text)",
      "PrizmButton(String text, Variant variant)",
    ],
    members: [
      {
        name: "Variant",
        type: "enum { SOLID, OUTLINE, GHOST, SUBTLE, DANGER, LINK }",
        default: "SOLID",
        description:
          "Visual style. Mirrors the React Button variants. `SOLID` for primary CTAs, `OUTLINE` for secondary, `GHOST` for tertiary, `SUBTLE` for dense UIs, `DANGER` for destructive, `LINK` for inline.",
      },
      {
        name: "Size",
        type: "enum { SM, MD, LG, ICON }",
        default: "MD",
        description: "Control size. `ICON` is a square 36×36 for icon-only buttons.",
      },
      {
        name: "setVariant",
        type: "(Variant) → void",
        description: "Swap the variant; updates the style class.",
      },
      {
        name: "setSize",
        type: "(Size) → void",
        description: "Swap the size; updates the style class.",
      },
    ],
    notes:
      "Inherits all Button behaviour (actions, keyboard, accessibility). Variant/size map to style classes consumed by prizm.css. In spec parity with components/ui/button.tsx.",
  },

  // ----- Forms -----
  input: {
    className: "PrizmInput",
    package: "design.prizm.fx.controls",
    base: "javafx.scene.control.TextField",
    constructors: [
      "PrizmInput()",
      "PrizmInput(String text)",
      "PrizmInput(String text, String promptText)",
    ],
    members: [
      {
        name: "promptText",
        type: "StringProperty",
        description:
          "Placeholder shown when empty (inherited from TextField; styled via -fx-prompt-text-fill).",
      },
      {
        name: "disabled",
        type: "BooleanProperty",
        default: "false",
        description: "Inherited from Node; dims the field via the :disabled pseudo-class.",
      },
    ],
    notes:
      "Thin subclass of TextField; styling comes from the .text-field rules in prizm.css. For obscured entry use a PasswordField equivalent (not in this slice). Mirrors components/ui/input.tsx.",
  },

  // ----- Layout -----
  card: {
    className: "PrizmCard",
    package: "design.prizm.fx.controls",
    base: "javafx.scene.layout.VBox",
    constructors: ["PrizmCard()", "PrizmCard(String titleText, String bodyText)"],
    members: [
      { name: "setTitle", type: "(String) → void", description: "Set the card title text." },
      { name: "setBody", type: "(String) → void", description: "Set the card body text." },
      {
        name: "titleLabel",
        type: "() → Label",
        description: "The title Label, for further styling.",
      },
      {
        name: "bodyLabel",
        type: "() → Label",
        description: "The body Label, for further styling.",
      },
      {
        name: "addContent",
        type: "(Node...) → void",
        description: "Append arbitrary content below the title and body.",
      },
    ],
    notes:
      "A composite surface over VBox (no stock 1:1 control). Styled by the .prizm-card rules in prizm.css. Mirrors Card + CardTitle + CardDescription in components/ui/card.tsx.",
  },

  separator: {
    className: "PrizmSeparator",
    package: "design.prizm.fx.controls",
    base: "javafx.scene.control.Separator",
    constructors: ["PrizmSeparator()", "PrizmSeparator(Orientation orientation)"],
    members: [
      {
        name: "orientation",
        type: "ObjectProperty<Orientation>",
        default: "HORIZONTAL",
        description: "Inherited from Separator; HORIZONTAL or VERTICAL.",
      },
    ],
    notes:
      "Thin subclass of the stock Separator; the rule is restyled to a 1px -color-border line (no extra padding) via the .prizm-separator rules in prizm.css. Mirrors components/ui/separator.tsx.",
  },

  stack: {
    className: "PrizmStack",
    package: "design.prizm.fx.controls",
    base: "javafx.scene.layout.VBox",
    constructors: [
      "PrizmStack()",
      "PrizmStack(PrizmGap gap)",
      "PrizmStack(PrizmGap gap, Node... children)",
    ],
    members: [
      {
        name: "PrizmGap",
        type: "enum { NONE, XXS, XS, SM, MD, LG, XL, XXL }",
        default: "MD",
        description:
          "Gap between children, in px (0/4/8/12/16/24/32/48). Mirrors the web Stack gap scale.",
      },
      {
        name: "setGap",
        type: "(PrizmGap) → void",
        description: "Set the gap from the PRIZM spacing scale (wraps VBox.setSpacing).",
      },
    ],
    notes:
      "Thin subclass of VBox — children stacked vertically with a PRIZM-scale gap. Defaults to gap MD (16px) and fillWidth (stretch). Use the inherited setAlignment / setFillWidth for other alignments. Pure layout, no paint. Mirrors components/ui/stack.tsx.",
  },

  group: {
    className: "PrizmGroup",
    package: "design.prizm.fx.controls",
    base: "javafx.scene.layout.HBox",
    constructors: [
      "PrizmGroup()",
      "PrizmGroup(PrizmGap gap)",
      "PrizmGroup(PrizmGap gap, Node... children)",
    ],
    members: [
      {
        name: "PrizmGap",
        type: "enum { NONE, XXS, XS, SM, MD, LG, XL, XXL }",
        default: "XS",
        description: "Gap between children, in px (shared with PrizmStack).",
      },
      {
        name: "setGap",
        type: "(PrizmGap) → void",
        description: "Set the gap from the PRIZM spacing scale (wraps HBox.setSpacing).",
      },
    ],
    notes:
      "Thin subclass of HBox — related controls laid out horizontally with a PRIZM-scale gap, vertically centred. Defaults to gap XS (8px). Use the inherited setAlignment for other alignment / justification; wrapping (the web `wrap` option) has no HBox equivalent — use a FlowPane. Pure layout, no paint. Mirrors components/ui/group.tsx.",
  },

  // ----- Forms -----
  textarea: {
    className: "PrizmTextarea",
    package: "design.prizm.fx.controls",
    base: "javafx.scene.control.TextArea",
    constructors: [
      "PrizmTextarea()",
      "PrizmTextarea(String text)",
      "PrizmTextarea(String text, String promptText)",
    ],
    members: [
      { name: "promptText", type: "StringProperty", description: "Placeholder shown when empty." },
      { name: "prefRowCount", type: "int", description: "Suggested visible height in rows." },
    ],
    notes:
      "Thin subclass of TextArea; styling from the .text-area rules in prizm.css. Mirrors components/ui/textarea.tsx.",
  },

  checkbox: {
    className: "PrizmCheckbox",
    package: "design.prizm.fx.controls",
    base: "javafx.scene.control.CheckBox",
    constructors: ["PrizmCheckbox()", "PrizmCheckbox(String text)"],
    members: [
      {
        name: "selected",
        type: "BooleanProperty",
        default: "false",
        description: "Checked state; accent fill when selected.",
      },
      {
        name: "indeterminate",
        type: "BooleanProperty",
        default: "false",
        description: "Tri-state indeterminate (enable via allowIndeterminate).",
      },
    ],
    notes:
      "Thin subclass of CheckBox; styling from the .check-box rules in prizm.css. Mirrors components/ui/checkbox.tsx.",
  },

  "radio-group": {
    className: "PrizmRadioGroup",
    package: "design.prizm.fx.controls",
    base: "javafx.scene.layout.VBox",
    constructors: ["PrizmRadioGroup()", "PrizmRadioGroup(String... options)"],
    members: [
      {
        name: "addOption",
        type: "(String) → PrizmRadioGroupItem",
        description: "Add an option; returns the item, already joined to the shared ToggleGroup.",
      },
      {
        name: "getSelected",
        type: "() → String",
        description: "The selected option's text, or null.",
      },
      {
        name: "select",
        type: "(String) → void",
        description: "Select the option with the given text.",
      },
      { name: "getToggleGroup", type: "() → ToggleGroup", description: "The shared toggle group." },
    ],
    notes:
      "JavaFX has no radio-group container, so PrizmRadioGroup is a composite (VBox + shared ToggleGroup) holding PrizmRadioGroupItem options, styled by the .radio-button rules in prizm.css. Mirrors RadioGroup + RadioGroupItem in components/ui/radio-group.tsx.",
  },

  switch: {
    className: "PrizmSwitch",
    package: "design.prizm.fx.controls",
    base: "javafx.scene.control.ToggleButton",
    constructors: ["PrizmSwitch()", "PrizmSwitch(boolean selected)"],
    members: [
      {
        name: "selected",
        type: "BooleanProperty",
        default: "false",
        description: "On/off state (inherited from ToggleButton); the thumb slides on change.",
      },
      {
        name: "disabled",
        type: "BooleanProperty",
        default: "false",
        description: "Inherited from Node; dims the track via the :disabled pseudo-class.",
      },
    ],
    notes:
      "JavaFX has no stock switch, so PrizmSwitch is a ToggleButton restyled as a track + sliding thumb (PrizmSwitchSkin), styled by the .prizm-switch rules in prizm.css. Carries no label text — pair it with a PrizmLabel / PrizmField. Accessible role is TOGGLE_BUTTON (JavaFX has no SWITCH role). Mirrors components/ui/switch.tsx.",
  },

  select: {
    className: "PrizmSelect<T>",
    package: "design.prizm.fx.controls",
    base: "javafx.scene.control.ComboBox<T>",
    constructors: ["PrizmSelect()", "PrizmSelect(ObservableList<T> items)"],
    members: [
      {
        name: "items",
        type: "ObservableList<T>",
        description: "The options — add via getItems().addAll(...).",
      },
      { name: "value", type: "ObjectProperty<T>", description: "The selected item." },
    ],
    notes:
      "Thin subclass of ComboBox; trigger + popup styled by the .combo-box / .combo-box-popup rules in prizm.css. Mirrors components/ui/select.tsx.",
  },

  slider: {
    className: "PrizmSlider",
    package: "design.prizm.fx.controls",
    base: "javafx.scene.control.Slider",
    constructors: ["PrizmSlider()", "PrizmSlider(double min, double max, double value)"],
    members: [
      { name: "value", type: "DoubleProperty", description: "Current value." },
      { name: "min / max", type: "DoubleProperty", description: "Range bounds." },
    ],
    notes:
      "Thin subclass of Slider; muted track + accent-ringed thumb via the .slider rules. A custom skin (PrizmSliderSkin) adds the accent fill from the track start to the thumb, since JavaFX has no stock filled track. Mirrors components/ui/slider.tsx.",
  },

  // ----- Typography -----
  label: {
    className: "PrizmLabel",
    package: "design.prizm.fx.controls",
    base: "javafx.scene.control.Label",
    constructors: ["PrizmLabel()", "PrizmLabel(String text)"],
    members: [
      {
        name: "labelFor",
        type: "ObjectProperty<Node>",
        description:
          "Associates the label with a control (focus / mnemonic), inherited from Label.",
      },
    ],
    notes:
      "Thin subclass of Label carrying the prizm-label style class (medium weight). Mirrors components/ui/label.tsx.",
  },

  field: {
    className: "PrizmField",
    package: "design.prizm.fx.controls",
    base: "javafx.scene.layout.VBox",
    constructors: [
      "PrizmField()",
      "PrizmField(String labelText)",
      "PrizmField(String labelText, Node control)",
    ],
    members: [
      { name: "setLabel", type: "(String) → void", description: "Set the field label text." },
      {
        name: "setControl",
        type: "(Node) → void",
        description: "Set/replace the wrapped control; pairs it with the label (labelFor).",
      },
      {
        name: "setDescription",
        type: "(String) → void",
        description: 'Helper / hint text below the control; null or "" hides it.',
      },
      {
        name: "setError",
        type: "(String) → void",
        description: 'Validation error below the field; null or "" clears it.',
      },
      {
        name: "labelNode",
        type: "() → PrizmLabel",
        description: "The label, for further styling.",
      },
    ],
    notes:
      "A composite over VBox (no stock 1:1 control), styled by the .prizm-field rules in prizm.css. Carries no validation engine (a web concern) — drive the error line with setError. Mirrors Field + FieldLabel + FieldControl + FieldDescription + FieldError in components/ui/field.tsx.",
  },

  // ----- Feedback -----
  alert: {
    className: "PrizmAlert",
    package: "design.prizm.fx.controls",
    base: "javafx.scene.layout.HBox",
    constructors: [
      "PrizmAlert()",
      "PrizmAlert(Variant variant, String titleText, String bodyText)",
    ],
    members: [
      {
        name: "Variant",
        type: "enum { DEFAULT, INFO, SUCCESS, WARNING, DANGER }",
        default: "DEFAULT",
        description: "Status variant; sets the border and title colour.",
      },
      { name: "setVariant", type: "(Variant) → void", description: "Swap the variant." },
      {
        name: "setTitle",
        type: "(String) → void",
        description: "Set the title (hidden if empty).",
      },
      {
        name: "setBody",
        type: "(String) → void",
        description: "Set the description (hidden if empty).",
      },
      {
        name: "setIcon",
        type: "(Node) → void",
        description: "Optional leading icon; colour it yourself. Pass null to remove.",
      },
    ],
    notes:
      "A composite over HBox (no stock 1:1 control), styled by the .prizm-alert rules. Each variant tints the background + border and colours the whole text, mirroring the web; since JavaFX CSS can't alpha-mix a looked-up colour, the tints are precomputed (status over bg) as -color-<status>-subtle / -border tokens by the theme generator. Mirrors Alert + AlertTitle + AlertDescription in components/ui/alert.tsx.",
  },

  spinner: {
    className: "PrizmSpinner",
    package: "design.prizm.fx.controls",
    base: "javafx.scene.layout.Region",
    constructors: ["PrizmSpinner()", "PrizmSpinner(Size size)"],
    members: [
      {
        name: "Size",
        type: "enum { SM, MD, LG, XL }",
        default: "MD",
        description: "Diameter in px (12 / 16 / 24 / 40), mirroring the web sizes.",
      },
      { name: "setSize", type: "(Size) → void", description: "Set the diameter from the scale." },
    ],
    notes:
      "A custom Region — a muted track ring (25% opacity) plus a 90° arc rotated continuously, matching the web. (The stock ProgressIndicator's indeterminate state renders as spinning segments, which don't match.) Styled by the .prizm-spinner rules. Mirrors components/ui/spinner.tsx.",
  },

  progress: {
    className: "PrizmProgress",
    package: "design.prizm.fx.controls",
    base: "javafx.scene.control.ProgressBar",
    constructors: ["PrizmProgress()", "PrizmProgress(double progress)"],
    members: [
      {
        name: "progress",
        type: "DoubleProperty",
        default: "0.0",
        description: "0.0–1.0; INDETERMINATE_PROGRESS (-1) renders the animated state.",
      },
    ],
    notes:
      "Thin subclass of ProgressBar — muted track + accent fill, 8px tall, via the .prizm-progress rules. Mirrors components/ui/progress.tsx.",
  },

  "empty-state": {
    className: "PrizmEmptyState",
    package: "design.prizm.fx.controls",
    base: "javafx.scene.layout.VBox",
    constructors: ["PrizmEmptyState()", "PrizmEmptyState(String titleText)"],
    members: [
      { name: "setTitle", type: "(String) → void", description: "Set the title text." },
      {
        name: "setDescription",
        type: "(String) → void",
        description: 'Optional supporting text; null or "" hides it.',
      },
      {
        name: "setIcon",
        type: "(Node) → void",
        description: "Optional icon shown in a muted circle. Pass null to remove.",
      },
      {
        name: "setAction",
        type: "(Node) → void",
        description: "Optional action below the text (e.g. a PrizmButton). Pass null to remove.",
      },
    ],
    notes:
      "A centred composite over VBox (no stock 1:1 control), styled by the .prizm-empty-state rules. Mirrors components/ui/empty-state.tsx.",
  },

  // ----- Data display -----
  badge: {
    className: "PrizmBadge",
    package: "design.prizm.fx.controls",
    base: "javafx.scene.control.Label",
    constructors: [
      "PrizmBadge()",
      "PrizmBadge(String text)",
      "PrizmBadge(String text, Variant variant)",
    ],
    members: [
      {
        name: "Variant",
        type: "enum { SOLID, OUTLINE, SUBTLE, SUCCESS, WARNING, DANGER, INFO }",
        default: "SUBTLE",
        description:
          "Pill style. Status variants reuse the composited -color-<status>-subtle tints.",
      },
      { name: "setVariant", type: "(Variant) → void", description: "Swap the variant." },
    ],
    notes:
      "Thin subclass of Label (carries text + optional graphic), styled as a rounded pill by the .prizm-badge rules. Mirrors components/ui/badge.tsx.",
  },

  avatar: {
    className: "PrizmAvatar",
    package: "design.prizm.fx.controls",
    base: "javafx.scene.layout.StackPane",
    constructors: [
      "PrizmAvatar()",
      "PrizmAvatar(Size size)",
      "PrizmAvatar(String initials, Size size)",
    ],
    members: [
      {
        name: "Size",
        type: "enum { SM, MD, LG, XL }",
        default: "MD",
        description: "Diameter in px (24 / 32 / 40 / 56), mirroring the web sizes.",
      },
      {
        name: "setInitials",
        type: "(String) → void",
        description: "Fallback text shown when there's no image.",
      },
      {
        name: "setImage",
        type: "(Image) → void",
        description: "Image clipped to the circle, over the fallback. Pass null to clear.",
      },
      { name: "setSize", type: "(Size) → void", description: "Set the diameter from the scale." },
    ],
    notes:
      "A composite over StackPane (no stock 1:1 control) — a muted circular background with an initials fallback and an optional clipped image. Styled by the .prizm-avatar rules. Mirrors Avatar + AvatarImage + AvatarFallback in components/ui/avatar.tsx.",
  },

  table: {
    className: "PrizmTable<T>",
    package: "design.prizm.fx.controls",
    base: "javafx.scene.control.TableView<T>",
    constructors: ["PrizmTable()", "PrizmTable(ObservableList<T> items)"],
    members: [
      {
        name: "items",
        type: "ObservableList<T>",
        description: "Row data — set via setItems / getItems().addAll(...).",
      },
      {
        name: "columns",
        type: "ObservableList<TableColumn<T, ?>>",
        description: "Add TableColumns with cell-value factories via getColumns().",
      },
    ],
    notes:
      "Thin subclass of TableView; header / row separators / hover / selection styled by the .prizm-table rules. PARADIGM NOTE: the web Table is compositional (hand-written rows/cells); JavaFX is data-driven (items + TableColumns) — the API differs by design, only the visual styling is in parity. Mirrors components/ui/table.tsx.",
  },

  // ----- Overlays -----
  toast: {
    className: "PrizmToast",
    package: "design.prizm.fx.controls",
    base: "javafx.scene.layout.HBox",
    constructors: ["PrizmToast(Variant variant, String title, String message)"],
    members: [
      {
        name: "Variant",
        type: "enum { DEFAULT, INFO, SUCCESS, WARNING, ERROR }",
        default: "DEFAULT",
        description:
          "Status; colours the leading dot (a small dot stands in for the web's per-type icon).",
      },
      {
        name: "PrizmToaster(StackPane host)",
        type: "manager",
        description: "Bind one to a host StackPane; the bottom-right overlay that stacks toasts.",
      },
      {
        name: "PrizmToaster.show",
        type: "(Variant, String title, String message[, Duration timeout]) → PrizmToast",
        description:
          "Show a toast; slides + fades in, auto-dismisses after the timeout (default 5s).",
      },
      {
        name: "PrizmToaster.dismiss",
        type: "(PrizmToast) → void",
        description: "Dismiss early (also on the toast's ✕).",
      },
    ],
    notes:
      "PrizmToast is one notification card (styled by .prizm-toast); PrizmToaster manages a bottom-right stack on a host StackPane (slide+fade, 5s auto-dismiss) — the instance-bound equivalent of the web `toast` singleton + ToastProvider. Mirrors components/ui/toast.tsx.",
  },

  // ----- Typography -----
  heading: {
    className: "PrizmHeading",
    package: "design.prizm.fx.controls",
    base: "javafx.scene.control.Label",
    constructors: [
      "PrizmHeading()",
      "PrizmHeading(String text)",
      "PrizmHeading(String text, Size size)",
    ],
    members: [
      {
        name: "Size",
        type: "enum { XL4, XL3, XL2, XL, LG, MD }",
        default: "XL2",
        description:
          "Visual size in px: 36 / 30 / 24 / 20 / 18 / 16. (No semantic tags in JavaFX.)",
      },
    ],
    notes:
      "Thin Label subclass — semibold, tight tracking, via the .prizm-heading rules. Mirrors components/ui/heading.tsx.",
  },
  text: {
    className: "PrizmText",
    package: "design.prizm.fx.controls",
    base: "javafx.scene.control.Label",
    constructors: ["PrizmText()", "PrizmText(String text)"],
    members: [
      {
        name: "Size",
        type: "enum { XS, SM, MD, LG }",
        default: "MD",
        description: "12 / 14 / 16 / 18 px.",
      },
      {
        name: "Tone",
        type: "enum { DEFAULT, MUTED, SUBTLE }",
        default: "DEFAULT",
        description: "fg / fg-muted / fg-subtle.",
      },
      {
        name: "Weight",
        type: "enum { NORMAL, MEDIUM, SEMIBOLD }",
        default: "NORMAL",
        description: "400 / 500 / 600.",
      },
    ],
    notes:
      "Thin Label subclass with size/tone/weight presets (chainable setters), via the .prizm-text rules. Mirrors components/ui/text.tsx.",
  },
  code: {
    className: "PrizmCode",
    package: "design.prizm.fx.controls",
    base: "javafx.scene.control.Label",
    constructors: ["PrizmCode()", "PrizmCode(String text)"],
    members: [],
    notes:
      "Inline code token — monospace on a muted bordered chip, via the .prizm-code rules. Mirrors the inline Code in components/ui/code.tsx.",
  },
  kbd: {
    className: "PrizmKbd",
    package: "design.prizm.fx.controls",
    base: "javafx.scene.control.Label",
    constructors: ["PrizmKbd()", "PrizmKbd(String text)"],
    members: [],
    notes:
      "Keyboard key indicator — monospace key-cap chip, via the .prizm-kbd rules. Mirrors components/ui/kbd.tsx.",
  },
  prose: {
    className: "PrizmProse",
    package: "design.prizm.fx.controls",
    base: "javafx.scene.layout.VBox",
    constructors: ["PrizmProse()", "PrizmProse(Node... children)"],
    members: [],
    notes:
      "A reading-width VBox that stacks PrizmHeading / PrizmText with paragraph spacing (JavaFX has no HTML to style, so it's a layout container, not a rich-text styler). Mirrors components/ui/prose.tsx.",
  },

  // ----- Forms (searchable select) -----
  combobox: {
    className: "PrizmCombobox<T>",
    package: "design.prizm.fx.controls",
    base: "javafx.scene.layout.Region (custom: search field + filtered popup list)",
    constructors: ["PrizmCombobox()", "PrizmCombobox(ObservableList<T> items)"],
    members: [
      {
        name: "getSourceItems",
        type: "() → ObservableList<T>",
        description: "The backing options — add / remove here.",
      },
      {
        name: "value",
        type: "ObjectProperty<T>",
        description: "The committed value (what the check marks); changes only on Enter / click.",
      },
      {
        name: "setPromptText",
        type: "(String) → void",
        description: "Placeholder for the search field.",
      },
    ],
    notes:
      "A custom control (not the stock editable ComboBox, whose arrow-keys mutate the value). A search field filters a popup list; the single highlight (selected row) follows keyboard AND hover, while the check marks only the committed value and never moves during navigation. Enter / click commits. The non-editable picker is PrizmSelect. Mirrors components/ui/combobox.tsx.",
  },

  // ----- Layout / Feedback (leftovers) -----
  frame: {
    className: "PrizmFrame",
    package: "design.prizm.fx.controls",
    base: "javafx.scene.layout.VBox",
    constructors: ["PrizmFrame()"],
    members: [
      {
        name: "setFramePadding",
        type: "(Padding) → void",
        description: "NONE/SM/MD/LG/XL = 0/16/24/32/48px. Default MD.",
      },
      {
        name: "setFrameMaxWidth",
        type: "(MaxWidth) → void",
        description: "SM/MD/LG/XL/XXL/FULL = 384/672/896/1152/1280/∞. Default XL.",
      },
    ],
    notes:
      "Max-width padded container. The web centres with mx-auto; in JavaFX place it in a centring parent. Mirrors components/ui/frame.tsx.",
  },
  skeleton: {
    className: "PrizmSkeleton",
    package: "design.prizm.fx.controls",
    base: "javafx.scene.layout.Region",
    constructors: ["PrizmSkeleton()", "PrizmSkeleton(double width, double height)"],
    members: [],
    notes:
      "Muted loading block with an indefinite opacity pulse (mirrors animate-pulse). Size via the constructor / setPrefSize. Mirrors components/ui/skeleton.tsx.",
  },

  // ----- Data -----
  calendar: {
    className: "PrizmCalendar",
    package: "design.prizm.fx.controls",
    base: "javafx.scene.layout.VBox",
    constructors: ["PrizmCalendar()"],
    members: [
      {
        name: "setSelected",
        type: "(LocalDate) → void",
        description: "Set the selected date (also moves to its month).",
      },
      { name: "getSelected", type: "() → LocalDate", description: "The selected date, or null." },
      {
        name: "setOnSelect",
        type: "(Consumer<LocalDate>) → void",
        description: "Called when a day is picked.",
      },
    ],
    notes:
      "A custom month grid (header nav + day-name row + 7-col day cells; today outlined, selected filled). JavaFX has no standalone month grid. Mirrors components/ui/calendar.tsx.",
  },

  // ----- Navigation -----
  link: {
    className: "PrizmLink",
    package: "design.prizm.fx.controls",
    base: "javafx.scene.control.Hyperlink",
    constructors: ["PrizmLink()", "PrizmLink(String text)"],
    members: [],
    notes:
      "Hyperlink restyled to accent text, underline-on-hover, no focus border. Wire navigation with setOnAction. Mirrors components/ui/link.tsx.",
  },
  tabs: {
    className: "PrizmTabs",
    package: "design.prizm.fx.controls",
    base: "javafx.scene.control.TabPane",
    constructors: ["PrizmTabs()"],
    members: [
      {
        name: "tabs",
        type: "ObservableList<Tab>",
        description: "Add Tabs via getTabs(); closing policy defaults to UNAVAILABLE.",
      },
    ],
    notes:
      "Thin TabPane subclass; muted labels, accent + muted-fill on the selected tab, via the .prizm-tabs rules. Mirrors components/ui/tabs.tsx.",
  },
  breadcrumb: {
    className: "PrizmBreadcrumb",
    package: "design.prizm.fx.controls",
    base: "javafx.scene.layout.HBox",
    constructors: ["PrizmBreadcrumb()"],
    members: [
      {
        name: "addCrumb",
        type: "(String) → Hyperlink",
        description: "Add a clickable ancestor crumb (wire setOnAction).",
      },
      {
        name: "addCurrent",
        type: "(String) → Label",
        description: "Add the non-link current page (the tail).",
      },
    ],
    notes:
      "Composite HBox of muted crumb links separated by chevrons, ending in the current page. Mirrors components/ui/breadcrumb.tsx.",
  },
  pagination: {
    className: "PrizmPagination",
    package: "design.prizm.fx.controls",
    base: "javafx.scene.layout.HBox",
    constructors: ["PrizmPagination(int pageCount)"],
    members: [
      {
        name: "setCurrent",
        type: "(int) → void",
        description: "Set the active page (fires onPageChange).",
      },
      { name: "getCurrent", type: "() → int", description: "The active page (1-based)." },
      {
        name: "setOnPageChange",
        type: "(IntConsumer) → void",
        description: "Called when the page changes.",
      },
    ],
    notes:
      "Composite of Previous / numbered pages / Next PrizmButtons (active outlined, others ghost). Shows all pages (no ellipsis). Mirrors components/ui/pagination.tsx.",
  },
  "navigation-menu": {
    className: "PrizmNavigationMenu",
    package: "design.prizm.fx.controls",
    base: "javafx.scene.layout.HBox",
    constructors: ["PrizmNavigationMenu()"],
    members: [
      {
        name: "addMenu",
        type: "(String label, MenuItem... items) → MenuButton",
        description: "Add a top-level trigger with its dropdown items; returns the MenuButton.",
      },
    ],
    notes:
      "An HBox of MenuButton triggers (a MenuBar can't show/animate a trigger chevron). Each trigger has a chevron graphic that rotates down→up (150ms) on open, styled by .prizm-nav-trigger; dropdowns reuse the .context-menu / .menu-item rules. Mirrors components/ui/navigation-menu.tsx.",
  },

  // ----- Overlays (hover card, command) -----
  "hover-card": {
    className: "PrizmHoverCard",
    package: "design.prizm.fx.controls",
    base: "javafx.scene.control.PopupControl",
    constructors: ["PrizmHoverCard()", "PrizmHoverCard(Node content)"],
    members: [
      { name: "setContent", type: "(Node) → void", description: "The card body." },
      {
        name: "attach",
        type: "(Node owner) → void",
        description: "Show on mouse-enter of the owner, hide on exit.",
      },
    ],
    notes:
      "Like PrizmPopover but hover-triggered; built on PopupControl (inherits the scene theme), reuses the .prizm-popover surface. Mirrors components/ui/hover-card.tsx.",
  },
  command: {
    className: "PrizmCommand",
    package: "design.prizm.fx.controls",
    base: "javafx.scene.layout.VBox",
    constructors: ["PrizmCommand()"],
    members: [
      {
        name: "addGroup",
        type: "(String heading) → PrizmCommand.Group",
        description: "Add a titled section; add entries on the returned Group.",
      },
      {
        name: "Group.add",
        type: "(Node icon, String title, String subtitle, List<String> keywords, Runnable action) → Group",
        description: "Add a two-line entry with an icon box (chainable).",
      },
      {
        name: "icon (static)",
        type: "(String svgPathContent) → Node",
        description: "Build a stroked lucide icon (24×24 path) in the standard rounded icon box.",
      },
    ],
    notes:
      "An inline command palette (shown as-is, not behind a trigger): a VBox with a search row, a scrollable list of grouped two-line items, and a footer with keyboard hints and a live result count. Items filter live by title, subtitle, and keywords; Up/Down move the active row and Enter runs it. Mirrors components/ui/command.tsx.",
  },

  sheet: {
    className: "PrizmSheet",
    package: "design.prizm.fx.controls",
    base: "(controller; overlays a StackPane)",
    constructors: ["PrizmSheet(Side side)", "PrizmSheet(Side side, Node content)"],
    members: [
      {
        name: "setContent",
        type: "(Node) → void",
        description: "The panel body; compose it yourself.",
      },
      {
        name: "setSize",
        type: "(double) → void",
        description: "Panel width (LEFT/RIGHT) or height (TOP/BOTTOM) in px. Default 360 / 280.",
      },
      {
        name: "show",
        type: "(StackPane host) → void",
        description:
          "Overlay on a full-size host (e.g. the scene root wrapped in a StackPane) and slide in.",
      },
      {
        name: "hide",
        type: "() → void",
        description: "Slide out and remove from the host (also on scrim click).",
      },
    ],
    notes:
      "No stock JavaFX equivalent — a controller that overlays a host StackPane with a scrim + a panel sliding from the chosen Side (200ms). Styled by the .prizm-sheet / .prizm-sheet-scrim rules. Mirrors components/ui/sheet.tsx (which covers all four sides).",
  },

  dialog: {
    className: "PrizmDialog",
    package: "design.prizm.fx.controls",
    base: "(controller; overlays a StackPane)",
    constructors: ["PrizmDialog()", "PrizmDialog(String title, String message)"],
    members: [
      { name: "setTitle", type: "(String) → void", description: "The in-card title." },
      { name: "setBody", type: "(String) → void", description: "Body message text." },
      {
        name: "setBody",
        type: "(Node) → void",
        description: "Body as an arbitrary node (replaces the text).",
      },
      {
        name: "addAction",
        type: "(String text, PrizmButton.Variant variant, Runnable action) → PrizmButton",
        description: "Add a footer button; the action runs after dismiss (null just closes).",
      },
      {
        name: "show / hide",
        type: "(StackPane host) → void / () → void",
        description: "Overlay on / remove from a full-size host StackPane.",
      },
    ],
    notes:
      "An in-scene modal overlay (scrim + centred card), not a native window — so the rounded card renders cleanly with no OS-chrome corner artifacts, and it inherits the scene theme like the other overlays (Sheet / Command). The scrim, a top-right ✕, Esc, and any action button all dismiss it. Needs a full-size host StackPane. Mirrors components/ui/dialog.tsx.",
  },

  popover: {
    className: "PrizmPopover",
    package: "design.prizm.fx.controls",
    base: "javafx.scene.control.PopupControl",
    constructors: ["PrizmPopover()", "PrizmPopover(Node content)"],
    members: [
      {
        name: "setContent",
        type: "(Node) → void",
        description: "The body; compose it yourself (e.g. a VBox of labels).",
      },
      {
        name: "show",
        type: "(Node owner) → void",
        description:
          "Show anchored below the owner; auto-fixes on-screen. Inherited show(owner, x, y) for custom placement.",
      },
    ],
    notes:
      "Built on PopupControl, so its content inherits the owner scene's PRIZM theme (like Tooltip / ContextMenu). Auto-hides on focus loss, styled by the .prizm-popover rules. The web `glass` variant is NOT ported. Mirrors components/ui/popover.tsx.",
  },

  tooltip: {
    className: "PrizmTooltip",
    package: "design.prizm.fx.controls",
    base: "javafx.scene.control.Tooltip",
    constructors: ["PrizmTooltip()", "PrizmTooltip(String text)"],
    members: [
      {
        name: "showDelay",
        type: "ObjectProperty<Duration>",
        default: "400ms",
        description: "Hover delay before the tooltip appears (inherited from Tooltip).",
      },
    ],
    notes:
      "Thin subclass of Tooltip; surface-elevated background + hairline border via the .prizm-tooltip rules. Install with control.setTooltip(...). The web `glass` variant is NOT ported (liquid glass is web-only). Mirrors components/ui/tooltip.tsx.",
  },

  menu: {
    className: "PrizmMenu",
    package: "design.prizm.fx.controls",
    base: "javafx.scene.control.MenuButton",
    constructors: [
      "PrizmMenu()",
      "PrizmMenu(String text)",
      "PrizmMenu(String text, MenuItem... items)",
    ],
    members: [
      {
        name: "items",
        type: "ObservableList<MenuItem>",
        description:
          "Stock JavaFX items via getItems(): MenuItem, CheckMenuItem, RadioMenuItem, SeparatorMenuItem, nested Menu submenus; setAccelerator is the web's shortcut.",
      },
    ],
    notes:
      "Extends MenuButton (JavaFX has no standalone menu) — the trigger is styled by .prizm-menu, the popup + items by the shared .context-menu / .menu-item rules. Mirrors components/ui/menu.tsx.",
  },

  "context-menu": {
    className: "PrizmContextMenu",
    package: "design.prizm.fx.controls",
    base: "javafx.scene.control.ContextMenu",
    constructors: ["PrizmContextMenu()", "PrizmContextMenu(MenuItem... items)"],
    members: [
      {
        name: "items",
        type: "ObservableList<MenuItem>",
        description:
          "Stock JavaFX menu items (same set as PrizmMenu). Attach via control.setContextMenu(...).",
      },
    ],
    notes:
      "Thin subclass of ContextMenu; the popup + items use the shared .context-menu / .menu-item rules (same styling as PrizmMenu's popup). Mirrors components/ui/context-menu.tsx.",
  },
};
