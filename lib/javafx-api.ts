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
      "Thin subclass of Slider; muted track + accent-ringed thumb via the .slider rules. The accent fill before the thumb isn't shown (JavaFX has no stock track fill). Mirrors components/ui/slider.tsx.",
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
};
