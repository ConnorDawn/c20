---
title: Game state
thanks:
  gbMichelle: Reversing stock table limits
---
**Game state** is the in-memory data which describes the state of the game world as it is simulated over time. It differs from [tags](~) which, although they are also [loaded into memory](~maps#map-loading), describe static or initial properties of classes of game objects rather than the current properties of individual ones.

Game state also includes global data for systems like [scripting](~) (script globals), multiplayer [game modes](~game-modes) (scores), and [physics](~physics-engine) (game speed and gravity) to name a few. During each simulation tick (30 per second) the game runs _updates_ across the game state which result in the ongoing changes to the game world as time progresses. As an example, this might include moving a [glow](~) particle some distance based on its speed in the glow tag definition.

The game state is saved and loaded from [game saves](~files#savegame-bin) or [core saves](~scripting#functions-core-save).

# Datum arrays
Much of the game state is maintained in _datum arrays_, also called _tables_. Each entry (_datum_) in these arrays is used to store the current state of some object or effect. The structure and purpose of these datums require reverse engineering to understand.

Since the game world is dynamic, the datum count can rise up to a limit. The following limits are known ("-" if unchanged):

|Table|Legacy limit|H1A limit|Purpose|
|-----|------------|---------|-------|
|[objects](~object)|2048|-|
|cluster collidable object reference|2048|-|
|cluster noncollidable object reference|2048|-|
|collidable object cluster reference|2048|-|
|noncollidable object cluster reference|2048|-|
|cached object render states|256|-|
|[widget](~object#tag-field-widgets)|12|-|
|[flag](~)|2|-|
|[antenna](~)|12|24|
|glow|8|-|Stores the state of [glow](~glow#glow-path) systems/paths. For example, the energy sword has 2 glow paths so up to 4 energy swords can be glowing.|
|glow particles|512|-|Stores the state of individual [glow particles](~glow#particle-types), like colour and position.|
|[light volumes](~light_volume)|256|-|
|[lightnings](~lightning)|256|-|
|[device groups](~scenario#tag-field-device-groups)|1024|-|
|[lights](~light)|896|-|
|cluster light reference|2048|-|
|light cluster reference|2048|-|
|[decals](~decal)|2048|-|Stores the state of [dynamic decals](~decal#dynamic-decals]). This likely includes their position, tag ID, and expiry timer.|
|players|16|-|
|teams|16|-|
|[contrail](~)|512|-|
|contrail point|1024|-|
|[effect](~)|256|-|
|effect location|512|-|
|[particle](~)|1024|-|
|[particle systems](~particle_system)|64|-|
|particle system particles|512|-|
|object looping sounds|1024|-|
|[actor](~)|256|-|
|swarm|32|-|
|swarm component|256|-|
|prop|768|-|Part of the [AI knowledge model](~ai#props) and stores a web of relationships between units like allies and enemies. Likely used when determining if actors have more enemies than allies nearby, if enemies are reachable, occluded, etc. Props can be visualized with `ai_render_props`.|
|[encounter](~scenario#tag-field-encounters)|128|-|
|ai pursuit|256|-|
|object list header|48|-|
|list object reference|128|-|
|[hs thread](~scripting#script-threads)|256|-|
|hs globals|1024|-|Stores the state of HS globals, including [external globals](~scripting#external-globals), not just those in the level script.|
|recorded animations|64|-|
|[AI knowledge](~ai#knowledge-model)|768|-|
|[mounted weapon units](~unit#tag-field-seats-built-in-gunner)|8|-|

## Glow datum
Glow datums hold the state of [glows](~glow). For example, the gold Elite's energy sword is composed of 2 glows, one for the bottom blade and one for the top.

{% structTable
  entryModule="h1/gamestate/glow_datum"
  entryType="GlowDatum"
  showOffsets=true
  id="glow-datum"
/%}

# Related HaloScript
{% relatedHsc game="h1" tagFilter="game-state" /%}