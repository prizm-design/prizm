/**
 * The canonical registry of every PRIZM component.
 *
 * This file is read by:
 *  - the component browser page (/components)
 *  - the per-component pages (/components/[name])
 *  - the LLM layer (root llms.txt, per-component llms.txt files)
 *  - the air-gap audit (to enumerate the surface area)
 *
 * When a new component is added, register it here. Source files live in
 * /components/ui/<slug>.tsx. Slugs are kebab-case and stable — they are
 * also the URL segment and the filename.
 */

export type ComponentCategory =
  | "actions"
  | "forms"
  | "data"
  | "layout"
  | "feedback"
  | "navigation"
  | "overlay"
  | "typography";

export type ComponentStatus = "stable" | "alpha" | "planned";

export interface ComponentEntry {
  slug: string;
  name: string;
  category: ComponentCategory;
  description: string;
  status: ComponentStatus;
  builtOn?: string;
}

export const COMPONENTS: ComponentEntry[] = [
  // ----- Actions -----
  {
    slug: "button",
    name: "Button",
    category: "actions",
    description: "Trigger an action. Six visual variants and four sizes.",
    status: "stable",
  },
  {
    slug: "toggle-group",
    name: "Toggle Group",
    category: "actions",
    description: "Group of toggle buttons for view switching or multi-select.",
    status: "planned",
    builtOn: "Base UI Toggle Group",
  },

  // ----- Forms -----
  {
    slug: "input",
    name: "Input",
    category: "forms",
    description: "A single-line text input.",
    status: "stable",
  },
  {
    slug: "textarea",
    name: "Textarea",
    category: "forms",
    description: "Multi-line text input.",
    status: "stable",
  },
  {
    slug: "checkbox",
    name: "Checkbox",
    category: "forms",
    description: "Binary toggle.",
    status: "stable",
    builtOn: "Base UI Checkbox",
  },
  {
    slug: "radio-group",
    name: "Radio Group",
    category: "forms",
    description: "Pick one of several mutually exclusive options.",
    status: "stable",
    builtOn: "Base UI Radio",
  },
  {
    slug: "switch",
    name: "Switch",
    category: "forms",
    description: "Toggle a setting on or off.",
    status: "stable",
    builtOn: "Base UI Switch",
  },
  {
    slug: "select",
    name: "Select",
    category: "forms",
    description: "Choose one from a list of options.",
    status: "stable",
    builtOn: "Base UI Select",
  },
  {
    slug: "combobox",
    name: "Combobox",
    category: "forms",
    description: "Searchable select with typeahead.",
    status: "stable",
    builtOn: "Base UI Combobox",
  },
  {
    slug: "slider",
    name: "Slider",
    category: "forms",
    description: "Pick a numeric value within a range.",
    status: "stable",
    builtOn: "Base UI Slider",
  },
  {
    slug: "label",
    name: "Label",
    category: "forms",
    description: "Accessible label for form controls.",
    status: "stable",
  },
  {
    slug: "field",
    name: "Field",
    category: "forms",
    description: "Form field wrapper with label, hint, and error.",
    status: "stable",
    builtOn: "Base UI Field",
  },
  {
    slug: "number-input",
    name: "Number Input",
    category: "forms",
    description: "Numeric input with increment / decrement controls.",
    status: "planned",
    builtOn: "Base UI Number Field",
  },
  {
    slug: "date-picker",
    name: "Date Picker",
    category: "forms",
    description: "Pick a date or date range. Composes Calendar with input + popover.",
    status: "planned",
  },

  // ----- Data display -----
  {
    slug: "card",
    name: "Card",
    category: "layout",
    description: "A container with surface, border, and structured slots.",
    status: "stable",
  },
  {
    slug: "badge",
    name: "Badge",
    category: "data",
    description: "A small status indicator or label.",
    status: "stable",
  },
  {
    slug: "avatar",
    name: "Avatar",
    category: "data",
    description: "User or entity image with fallback.",
    status: "stable",
    builtOn: "Base UI Avatar",
  },
  {
    slug: "table",
    name: "Table",
    category: "data",
    description: "Structured tabular data.",
    status: "stable",
  },
  {
    slug: "calendar",
    name: "Calendar",
    category: "data",
    description: "Date picker grid.",
    status: "stable",
  },
  {
    slug: "kbd",
    name: "Kbd",
    category: "typography",
    description: "Keyboard shortcut display.",
    status: "stable",
  },
  {
    slug: "code",
    name: "Code",
    category: "typography",
    description: "Inline and block code.",
    status: "stable",
  },
  {
    slug: "tree",
    name: "Tree",
    category: "data",
    description: "Hierarchical data view with expand / collapse.",
    status: "planned",
  },

  // ----- Layout -----
  {
    slug: "separator",
    name: "Separator",
    category: "layout",
    description: "Visual dividing line.",
    status: "stable",
    builtOn: "Base UI Separator",
  },
  {
    slug: "frame",
    name: "Frame",
    category: "layout",
    description: "Constrained content frame with consistent padding.",
    status: "stable",
  },
  {
    slug: "group",
    name: "Group",
    category: "layout",
    description: "Horizontal grouping of related controls.",
    status: "stable",
  },
  {
    slug: "stack",
    name: "Stack",
    category: "layout",
    description: "Vertical spacing primitive.",
    status: "stable",
  },
  {
    slug: "accordion",
    name: "Accordion",
    category: "layout",
    description: "Vertically stacked, collapsible content sections.",
    status: "planned",
    builtOn: "Base UI Accordion",
  },
  {
    slug: "scroll-area",
    name: "Scroll Area",
    category: "layout",
    description: "Custom-styled scrollable region.",
    status: "planned",
    builtOn: "Base UI Scroll Area",
  },

  // ----- Feedback -----
  {
    slug: "alert",
    name: "Alert",
    category: "feedback",
    description: "Inline message block.",
    status: "stable",
  },
  {
    slug: "toast",
    name: "Toast",
    category: "feedback",
    description: "Transient notification.",
    status: "stable",
    builtOn: "Base UI Toast",
  },
  {
    slug: "progress",
    name: "Progress",
    category: "feedback",
    description: "Determinate progress indicator.",
    status: "stable",
    builtOn: "Base UI Progress",
  },
  {
    slug: "spinner",
    name: "Spinner",
    category: "feedback",
    description: "Indeterminate loading indicator.",
    status: "stable",
  },
  {
    slug: "skeleton",
    name: "Skeleton",
    category: "feedback",
    description: "Loading placeholder.",
    status: "stable",
  },
  {
    slug: "empty-state",
    name: "Empty State",
    category: "feedback",
    description: "Placeholder for empty content regions.",
    status: "stable",
  },

  // ----- Navigation -----
  {
    slug: "tabs",
    name: "Tabs",
    category: "navigation",
    description: "Switch between related views.",
    status: "stable",
    builtOn: "Base UI Tabs",
  },
  {
    slug: "breadcrumb",
    name: "Breadcrumb",
    category: "navigation",
    description: "Hierarchical navigation trail.",
    status: "stable",
  },
  {
    slug: "pagination",
    name: "Pagination",
    category: "navigation",
    description: "Page navigation for long lists.",
    status: "stable",
  },
  {
    slug: "navigation-menu",
    name: "Navigation Menu",
    category: "navigation",
    description: "Multi-level navigation bar.",
    status: "stable",
    builtOn: "Base UI Navigation Menu",
  },
  {
    slug: "command",
    name: "Command",
    category: "navigation",
    description: "Command palette / fuzzy launcher.",
    status: "stable",
  },
  {
    slug: "link",
    name: "Link",
    category: "navigation",
    description: "Inline hyperlink with PRIZM styling.",
    status: "stable",
  },

  // ----- Overlay -----
  {
    slug: "dialog",
    name: "Dialog",
    category: "overlay",
    description: "Modal dialog for focused tasks.",
    status: "stable",
    builtOn: "Base UI Dialog",
  },
  {
    slug: "sheet",
    name: "Sheet",
    category: "overlay",
    description: "Edge-anchored sliding panel. Opens from any side.",
    status: "stable",
    builtOn: "Base UI Dialog",
  },
  {
    slug: "popover",
    name: "Popover",
    category: "overlay",
    description: "Floating contextual panel.",
    status: "stable",
    builtOn: "Base UI Popover",
  },
  {
    slug: "tooltip",
    name: "Tooltip",
    category: "overlay",
    description: "Hover label for compact UI elements.",
    status: "stable",
    builtOn: "Base UI Tooltip",
  },
  {
    slug: "menu",
    name: "Menu",
    category: "overlay",
    description: "Action menu with keyboard support.",
    status: "stable",
    builtOn: "Base UI Menu",
  },
  {
    slug: "context-menu",
    name: "Context Menu",
    category: "overlay",
    description: "Right-click action menu.",
    status: "stable",
    builtOn: "Base UI Context Menu",
  },
  {
    slug: "hover-card",
    name: "Hover Card",
    category: "overlay",
    description: "Rich preview on hover.",
    status: "stable",
    builtOn: "Base UI Preview Card",
  },

  // ----- Typography -----
  {
    slug: "heading",
    name: "Heading",
    category: "typography",
    description: "Display and section headings.",
    status: "stable",
  },
  {
    slug: "text",
    name: "Text",
    category: "typography",
    description: "Body text primitive.",
    status: "stable",
  },
  {
    slug: "prose",
    name: "Prose",
    category: "typography",
    description: "Long-form content block.",
    status: "stable",
  },
];

export const CATEGORIES: Record<ComponentCategory, { label: string; description: string }> = {
  actions: { label: "Actions", description: "Things users click to do something." },
  forms: { label: "Forms", description: "Inputs, fields, and form controls." },
  data: { label: "Data display", description: "Surface information visually." },
  layout: { label: "Layout", description: "Structure and spacing primitives." },
  feedback: { label: "Feedback", description: "Inform users of state changes." },
  navigation: { label: "Navigation", description: "Move between views and pages." },
  overlay: { label: "Overlay", description: "Floating UI layered above content." },
  typography: { label: "Typography", description: "Text-shaped content primitives." },
};

export function getComponent(slug: string): ComponentEntry | undefined {
  return COMPONENTS.find((c) => c.slug === slug);
}

export function getStableComponents(): ComponentEntry[] {
  return COMPONENTS.filter((c) => c.status === "stable");
}

export function getComponentsByCategory(): Record<ComponentCategory, ComponentEntry[]> {
  const grouped = {} as Record<ComponentCategory, ComponentEntry[]>;
  for (const category of Object.keys(CATEGORIES) as ComponentCategory[]) {
    grouped[category] = COMPONENTS.filter((c) => c.category === category);
  }
  return grouped;
}
