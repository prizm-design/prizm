---
component: safety-actions
slug: safety-actions
pack: rc3
platform: javafx
status: stable
source: javafx/src/main/java/design/prizm/fx/rc3/Rc3SafetyActions.java
---

# Rc3SafetyActions (JavaFX)

The RC3 primary safety affordance for a thick-client (JavaFX) C3 app — one tap to
reach, a deliberate second tap to fire. An `HBox` composing secondary
`PrizmButton`s and a danger primary button. Honours behavioural invariants 1
(reachable in one tap) and 4 (deliberate confirmation). Danger uses the semantic
`-color-danger` tokens — never the Ember signature colour. Mirrors the React
`SafetyActions` (`components/rc3/safety-actions.tsx`).

## API

| member | type | notes |
|--------|------|-------|
| `Scope` | enum `PLATFORM / GROUP / SWARM / MISSION` | Determines the primary + secondary action set. |
| `ActionKey` | enum | The action that fired: `E_STOP`, `OVERRIDE`, `RECALL_GROUP`, `RECALL_SWARM`, `ABORT`, `PAUSE`, `SUSPEND`. |
| `setScope(Scope)` | void | Rebuilds the action set. |
| `setConfirm(boolean)` | void | Require the armed second tap (default `true`). Don't disable in production. |
| `setOnAction(Consumer<ActionKey>)` | void | Fires when an action commits. |
| `setDisable(boolean)` | void | Inherited from `Node`; blocks all actions. |

Constructors: `Rc3SafetyActions()`, `Rc3SafetyActions(Scope)`.

Scope → actions: `PLATFORM` E-Stop / Override · `GROUP` Recall Group / Pause ·
`SWARM` Recall Swarm / Suspend · `MISSION` Abort Mission / Pause.

## Behaviour

The primary is always visible; the first tap arms it ("CONFIRM · X", pulsing, ✕
cancel badge), a second tap within 3 s fires. ESCAPE or the ✕ badge disarms. The
secondary fires immediately (recoverable by design).

## Usage

```java
var safety = new Rc3SafetyActions(Rc3SafetyActions.Scope.PLATFORM);
safety.setOnAction(key -> {
    if (key == Rc3SafetyActions.ActionKey.E_STOP) emergencyStop(id);
    if (key == Rc3SafetyActions.ActionKey.OVERRIDE) takeManualControl(id);
});
```

## Accessibility

The primary carries the danger `PrizmButton` semantics; ESCAPE disarms.
`setDisable(true)` dims and blocks all controls.

## Theming

Requires a PRIZM theme on the Scene (`PrizmTheme.apply(scene, mode)`), with or
without `Pack.RC3` — danger tokens are identical in C3 and RC3, so the control
renders correctly either way.

## Source

`javafx/src/main/java/design/prizm/fx/rc3/Rc3SafetyActions.java`. Styling:
`javafx/src/main/resources/prizm/rc3.css`.
