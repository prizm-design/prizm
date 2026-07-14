/**
 * The JavaFX API surface for RC3 (Robotics & Autonomy) extension-pack organisms.
 *
 * Parallel to lib/javafx-api.ts (the C3-primitive surface), keyed by the same RC3
 * organism slug so each /c3/rc3/components/<slug> page can show a JavaFX block —
 * mirroring how /components/<slug> surfaces the C3 controls. Both the React and
 * JavaFX organisms implement to the shared spec; this file documents the Java
 * side — class, base type, constructors, and the typed knobs it exposes.
 *
 * SCOPE — all nine RC3 signature organisms are ported to JavaFX, including
 * perception-view (a JavaFX Canvas reference renderer).
 *
 * MAINTENANCE — keep entries in sync with the Java source under javafx/.../rc3/
 * and with the React organisms in components/rc3/. When the React organism's API
 * changes, the JavaFX one must change with it (spec parity).
 */

import type { JavaFxControlApi } from "@/lib/javafx-api";

export const RC3_JAVAFX_API: Record<string, JavaFxControlApi> = {
  "safety-actions": {
    className: "Rc3SafetyActions",
    package: "design.prizm.fx.rc3",
    base: "javafx.scene.layout.HBox",
    constructors: ["Rc3SafetyActions()", "Rc3SafetyActions(Scope scope)"],
    members: [
      {
        name: "Scope",
        type: "enum",
        description:
          "PLATFORM / GROUP / SWARM / MISSION — determines the primary + secondary action set.",
      },
      {
        name: "ActionKey",
        type: "enum",
        description:
          "The action that fired: E_STOP, OVERRIDE, RECALL_GROUP, RECALL_SWARM, ABORT, PAUSE, SUSPEND.",
      },
      {
        name: "setScope",
        type: "(Scope) → void",
        description: "Rebuilds the surfaced actions for the scope.",
      },
      {
        name: "setConfirm",
        type: "(boolean) → void",
        default: "true",
        description:
          "Require the armed second tap on the primary action. Don't disable in production.",
      },
      {
        name: "setOnAction",
        type: "(Consumer<ActionKey>) → void",
        description: "Fires when an action commits.",
      },
    ],
    notes:
      "The primary is always visible; the first tap arms it (CONFIRM · X, pulsing, ✕ cancel), a second tap within 3 s fires. ESCAPE / ✕ disarms; the secondary fires immediately. Danger uses the semantic tokens, never Ember. Reuses PrizmButton. Mirrors components/rc3/safety-actions.tsx.",
  },

  "comms-health-strip": {
    className: "Rc3CommsHealthStrip",
    package: "design.prizm.fx.rc3",
    base: "javafx.scene.layout.HBox",
    constructors: ["Rc3CommsHealthStrip()"],
    members: [
      {
        name: "Scope",
        type: "enum",
        description:
          "PLATFORM shows a single rich row; group / swarm / mission show an aggregated summary.",
      },
      {
        name: "LinkStatus",
        type: "enum",
        description: "GOOD / DEGRADED / LOST — drives colour + link label.",
      },
      {
        name: "PlatformLink",
        type: "record(String id, int signal, Integer battery, boolean gpsLock, LinkStatus status)",
        description: "One platform's link state; battery may be null.",
      },
      {
        name: "setScope",
        type: "(Scope) → void",
        description: "Switches between single and aggregated views.",
      },
      {
        name: "setPlatform",
        type: "(PlatformLink) → void",
        description: "The single platform at PLATFORM scope.",
      },
      {
        name: "setPlatforms",
        type: "(List<PlatformLink>) → void",
        description: "Aggregated scopes; per-platform pips show at group / swarm when ≤ 12.",
      },
    ],
    notes:
      "Status uses the success / warning / danger tokens — no Ember. Honours behavioural invariant 2. Mirrors components/rc3/comms-health-strip.tsx.",
  },

  "autonomy-mode-selector": {
    className: "Rc3AutonomyModeSelector",
    package: "design.prizm.fx.rc3",
    base: "javafx.scene.layout.VBox",
    constructors: ["Rc3AutonomyModeSelector()"],
    members: [
      {
        name: "Scope",
        type: "enum",
        description: "PLATFORM / GROUP / SWARM / MISSION — header context.",
      },
      {
        name: "AutonomyRung",
        type: "record(String key, index, label, authority, blurb)",
        description: "A ladder rung; blurb optional.",
      },
      {
        name: "DEFAULT_RUNGS",
        type: "List<AutonomyRung>",
        description: "L0 MANUAL → L3 AUTONOMOUS, task-agnostic.",
      },
      {
        name: "setRungs",
        type: "(List<AutonomyRung>) → void",
        description: "Ordered lowest → highest authority-to-machine.",
      },
      {
        name: "setActiveKey / getActiveKey",
        type: "(String) / () → String",
        description: "The active rung; setting it resets any pending consent.",
      },
      {
        name: "setOnTransition",
        type: "(Consumer<String>) → void",
        description:
          "Fires with the target key on commit (controlled — the caller updates activeKey).",
      },
      {
        name: "setConsent",
        type: "(boolean) → void",
        default: "true",
        description: "Arm-on-climb gate; descent is always immediate.",
      },
      {
        name: "setCompact",
        type: "(boolean) → void",
        default: "true",
        description: "Glance row + disclosure vs the full rail.",
      },
      {
        name: "setFramed",
        type: "(boolean) → void",
        default: "false",
        description: "Hairline bezel + surface fill.",
      },
    ],
    notes:
      "Vertical notched rail with an Ember chevron pointer (inlined so it reads honestly with or without the pack accent). Honours behavioural invariant 4. Mirrors components/rc3/autonomy-mode-selector.tsx.",
  },

  "video-tile": {
    className: "Rc3VideoTile",
    package: "design.prizm.fx.rc3",
    base: "javafx.scene.layout.StackPane",
    constructors: ["Rc3VideoTile()", "Rc3VideoTile(String source, FeedStatus status)"],
    members: [
      {
        name: "FeedStatus",
        type: "enum",
        description: "LIVE / DEGRADED / LOST — corner label + no-signal overlay.",
      },
      {
        name: "AspectRatio",
        type: "enum",
        default: "R16_9",
        description: "R16_9 / R4_3 / R9_16 / R1_1 / AUTO — height derives from width.",
      },
      { name: "SensorMode", type: "enum", description: "EO / IR / LL — sensor badge cell." },
      {
        name: "setContent",
        type: "(Node) → void",
        description: "The consumer's video / canvas / player; fills the tile.",
      },
      {
        name: "setSource / setStatus",
        type: "(String) / (FeedStatus) → void",
        description: "Source label + feed status.",
      },
      {
        name: "setRecording / setReticle",
        type: "(boolean) → void",
        description: "REC chip + centre reticle overlays.",
      },
      {
        name: "setCoordinates / setBearing / setRange / setZoom / setSensor",
        type: "→ void",
        description: "Telemetry burn-in cells (suppressed when lost).",
      },
    ],
    notes:
      "Ships the surface; the consumer plugs the feed. Honours invariant 5 — a lost feed reads NO SIGNAL, never a frozen frame. The source dot is Ember. JavaFX has no backdrop-blur, so overlay pills use a solid fill. Mirrors components/rc3/video-tile.tsx.",
  },

  "telemetry-hud": {
    className: "Rc3TelemetryHud",
    package: "design.prizm.fx.rc3",
    base: "javafx.scene.layout.StackPane",
    constructors: ["Rc3TelemetryHud()"],
    members: [
      {
        name: "UxvDomain",
        type: "enum",
        description:
          "AERIAL / GROUND / SURFACE / UNDERWATER — drives ALT / ELEV / DEPTH and V/S / DIVE labels.",
      },
      {
        name: "HudMode",
        type: "enum",
        default: "STRIP",
        description: "STRIP (inline row) or FRAME (four-edge overlay around a viewport).",
      },
      {
        name: "SpeedUnit / VerticalUnit",
        type: "enum",
        description: "M_S / KM_H / KN and M / FT.",
      },
      { name: "TelemetryField", type: "enum", description: "Keys for per-field staleness." },
      {
        name: "setDomain / setMode / setPlatform",
        type: "→ void",
        description: "Domain, posture, and the Ember-dotted platform cell.",
      },
      {
        name: "setSpeed / setVertical / setVerticalRate / setHeading / setBattery / setFuel / setRoll / setPitch / setSlope / setAltitudeAboveBottom",
        type: "→ void",
        description: "Domain-tuned cells (slope is ground-only).",
      },
      {
        name: "setStale",
        type: "(Map<TelemetryField, Integer>) → void",
        description: "Seconds since last fresh; the cell dims + shows a STALE tag.",
      },
      { name: "setContent", type: "(Node) → void", description: "Centred viewport in FRAME mode." },
    ],
    notes:
      "Honours invariant 5 — a stale field never passes for live. Battery / fuel use semantic tones; the platform marker is Ember. Mirrors components/rc3/telemetry-hud.tsx.",
  },

  "controller-interface": {
    className: "Rc3ControllerInterface",
    package: "design.prizm.fx.rc3",
    base: "javafx.scene.layout.HBox",
    constructors: ["Rc3ControllerInterface()"],
    members: [
      {
        name: "StickState",
        type: "record(double x, double y)",
        description: "-1..1 per axis; y positive up.",
      },
      {
        name: "ControllerButton",
        type: "record(String id, label, boolean pressed, String binding)",
        description: "binding optional; pressed pills invert.",
      },
      { name: "setPlatform", type: "(String) → void", description: "Ember-dotted leading cell." },
      {
        name: "setLeftStick / setRightStick",
        type: "(StickState, String label) → void",
        description: "Stick well + axis readout.",
      },
      {
        name: "setLeftTrigger / setRightTrigger",
        type: "(Double, String label) → void",
        description: "Vertical trigger bar (0..1).",
      },
      {
        name: "setButtons",
        type: "(List<ControllerButton>) → void",
        description: "Button pill row.",
      },
      {
        name: "updateInputs",
        type: "(StickState, StickState, Double, Double) → void",
        description: "Live-update sticks + triggers in one rebuild — for frame-rate input feeds.",
      },
    ],
    notes:
      "Read-only input visualisation — the consumer wires the gamepad / WebSocket feed. Honours invariant 5 by extension (stop feeding a value rather than holding the last). Mirrors components/rc3/controller-interface.tsx.",
  },

  "platform-roster": {
    className: "Rc3PlatformRoster",
    package: "design.prizm.fx.rc3",
    base: "javafx.scene.layout.VBox",
    constructors: ["Rc3PlatformRoster()"],
    members: [
      {
        name: "LinkStatus",
        type: "enum",
        description: "GOOD / DEGRADED / LOST — signal-bar colour + link label.",
      },
      {
        name: "RosterEntry",
        type: "record(String id, LinkStatus link, Integer signal, Integer battery, String autonomy, String klass)",
        description: "Optional fields may be null; signal falls back to a status default.",
      },
      { name: "setPlatforms", type: "(List<RosterEntry>) → void", description: "Display order." },
      {
        name: "setActiveId",
        type: "(String) → void",
        description: "Ember-marked active row (left bar + dot).",
      },
      {
        name: "setOnSelect",
        type: "(Consumer<String>) → void",
        description: "Makes rows interactive.",
      },
      { name: "setLabel", type: "(String) → void", description: "Optional roster header." },
      {
        name: "setFillHeight",
        type: "(boolean) → void",
        default: "false",
        description: "Fit-and-scroll — needs a height-constrained parent.",
      },
    ],
    notes:
      "Honours invariant 3 (active context unambiguous). Mirrors components/rc3/platform-roster.tsx.",
  },

  "platform-detail": {
    className: "Rc3PlatformDetail",
    package: "design.prizm.fx.rc3",
    base: "javafx.scene.layout.VBox",
    constructors: ["Rc3PlatformDetail()", "Rc3PlatformDetail(String platform)"],
    members: [
      {
        name: "LinkStatus / UxvDomain",
        type: "enum",
        description: "Comms status + vertical label (ALT / ELEV / DEPTH).",
      },
      {
        name: "MissionStep",
        type: "record(int current, int total, String label)",
        description: "label optional.",
      },
      {
        name: "Extra",
        type: "record(String section, String label, Node value)",
        description:
          "Domain-specific row; consecutive same-section entries group. value is any Node — pass an Rc3Indicators primitive (or a String for plain text).",
      },
      {
        name: "setLink / setSignal / setBattery",
        type: "→ void",
        description: "Comms section — signal bars + battery gauge.",
      },
      {
        name: "setPosition / setHeading / setSpeed / setVertical",
        type: "→ void",
        description: "Telemetry section — heading dial.",
      },
      { name: "setMission / setOperator", type: "→ void", description: "Mission section." },
      {
        name: "setExtras / setLastContact",
        type: "→ void",
        description: "Extra rows + last-contact footer.",
      },
      {
        name: "setFillHeight",
        type: "(boolean) → void",
        default: "false",
        description: "Pins header + footer, scrolls the body.",
      },
    ],
    notes:
      "Master-detail companion to Rc3PlatformRoster; honours invariant 3. The Rc3Indicators alphabet (pipCount / capacityBar / stateDot / stateText) composes into extra values so payload / sensor state reads as instruments. Mirrors components/rc3/platform-detail.tsx.",
  },

  "perception-view": {
    className: "Rc3PerceptionView",
    package: "design.prizm.fx.rc3",
    base: "javafx.scene.layout.StackPane",
    constructors: ["Rc3PerceptionView()"],
    members: [
      {
        name: "CoordinateFrame",
        type: "enum",
        description: "ENU / NED / Z_UP / Y_UP — the scene frame, shown in the top chip.",
      },
      {
        name: "Vec3 / FrameTransform / PerceptionSource",
        type: "record",
        description:
          "Scene-frame point, rigid transform, and a contributing platform with freshness.",
      },
      {
        name: "SceneLayer",
        type: "sealed interface",
        description:
          "PointCloudLayer / OccupancyLayer / MeshLayer — the geometry the renderer draws.",
      },
      {
        name: "AreaOfInterest / AoiKind",
        type: "record / enum",
        description:
          "Operator semantics over the geometry (objective / hazard / inspect / marker).",
      },
      {
        name: "PerceptionScene",
        type: "record(frame, sources, layers, aois)",
        description: "The consolidated scene from upstream.",
      },
      {
        name: "PerceptionStatus",
        type: "enum",
        description: "LIVE / HOLDING / LOST — a held or lost feed raises an unmistakable overlay.",
      },
      { name: "setScene", type: "(PerceptionScene) → void", description: "The scene to render." },
      {
        name: "setStatus / setStaleAfterSeconds / setAutoRotate / setBareChrome",
        type: "→ void",
        description: "Feed posture, decay threshold, orbit toggle, and hide-panels mode.",
      },
      {
        name: "setSelectedAoiId / setOnSelectAoi / setOnToggleLayer",
        type: "→ void",
        description:
          "Selection + layer-toggle state and optional listeners (interactive by default).",
      },
      {
        name: "RenderDelegate",
        type: "@FunctionalInterface",
        description:
          "Drop in a vendor 3D engine instead of the reference renderer; RC3 keeps drawing the chrome.",
      },
    ],
    notes:
      "A JavaFX Canvas reference renderer projects the scene with an orbit camera (drag / scroll-zoom / auto-rotate); chrome mirrors the web (frame chip, layer legend, source provenance, AOI registry, holding / lost overlay). Honours invariant 5 — stale geometry decays and a frozen scene never reads as live. JavaFX divergence: the renderer's neutral colours are dark-tuned constants (the web reads live CSS vars). Mirrors components/rc3/perception-view.tsx.",
  },
};
