---
component: autonomy-mode-selector
slug: autonomy-mode-selector
pack: rc3
platform: javafx
status: stable
source: javafx/src/main/java/design/prizm/fx/rc3/Rc3AutonomyModeSelector.java
---

# Rc3AutonomyModeSelector (JavaFX)

A vertical notched autonomy rail for a thick-client (JavaFX) C3 app, with an Ember
chevron pointer on the active rung. Compact by default (a single glance row that
discloses the full ladder); climbing toward more machine authority arms on the
first tap and commits on the second within 3 s, descending is immediate. Honours
behavioural invariant 4. Controlled, like the web: `setOnTransition` fires and the
caller calls `setActiveKey`. Mirrors the React `AutonomyModeSelector`
(`components/rc3/autonomy-mode-selector.tsx`).

## API

| member | type | notes |
|--------|------|-------|
| `Scope` | enum `PLATFORM / GROUP / SWARM / MISSION` | Header context. |
| `AutonomyRung` | record `(String key, index, label, authority, blurb)` | A ladder rung; `blurb` optional. |
| `DEFAULT_RUNGS` | `List<AutonomyRung>` | L0 MANUAL → L3 AUTONOMOUS, task-agnostic. |
| `setRungs(List<AutonomyRung>)` | void | Ordered lowest → highest authority-to-machine. |
| `setActiveKey(String)` / `getActiveKey()` | | The active rung; setting it resets any pending consent. |
| `setOnTransition(Consumer<String>)` | void | Fires with the target key on commit. |
| `setConsent(boolean)` | void | Arm-on-climb gate (default `true`). |
| `setCompact(boolean)` | void | Glance row + disclosure (default `true`). |
| `setFramed(boolean)` | void | Hairline bezel + surface fill (default `false`). |
| `setScope(Scope)` / `setPlatform(String)` | void | |

Constructor: `Rc3AutonomyModeSelector()` (starts on `DEFAULT_RUNGS`).

## Usage

```java
var sel = new Rc3AutonomyModeSelector();
sel.setPlatform("UGV-04");
sel.setActiveKey("supervised");
sel.setOnTransition(sel::setActiveKey); // controlled self-drive
```

## Theming

Requires a PRIZM theme on the Scene. The chevron pointer and armed label are
Ember (inlined constant), so they read honestly whether or not `Pack.RC3` is
active; the rest re-reads its colours live on theme swap.

## Source

`javafx/src/main/java/design/prizm/fx/rc3/Rc3AutonomyModeSelector.java`. Styling:
`javafx/src/main/resources/prizm/rc3.css`.
