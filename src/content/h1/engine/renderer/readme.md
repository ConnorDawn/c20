---
title: Renderer
thanks:
  - to: Jakey
    for: Renderer regressions
---
The **renderer** is the system of [Halo's engine][engine] responsible for drawing the scene to the screen. Each [edition][h1] of Halo has a slightly different renderer. Halo uses a traditional Z-buffered forward rendering approach using the DirectX 9 API and shader version 2.0. When Halo was released for PC, programmable shader support in user hardware was not as widespread as today, so the renderer can be configured with [argumements][arguments#graphics-options] to use older shader versions or even [fixed function][ff] compatibility.

# PC regressions
The renderer needed to be adapted for the range of user hardware for the PC port and it was based on a pre-release version of Xbox. The [shader_transparent_generic][] tags were converted to [shader_transparent_chicago][] (or extended) tags. As a result, there are numerous graphical issues and regressions compared to the released Xbox version. Some issues are only present in Custom Edition, while others were fixed in MCC:

* The _detail after reflection_ flag of [shader_model][] is working in reverse of how it should. Enabling the flag should cause detail maps to apply after specularity/cubemaps. The client mod [Chimera][] has a built-in fix which is disabled for Halo Custom Edition (but enabled in Retail) except in the Vaporeon builds.
* Using [shader_environment][] on [gbxmodels][gbxmodel] does not function properly; specularity isn't masked, and atmospheric fog does not render correctly on such objects. This only affects Custom Edition.
* Transparent shaders occasionally Z-fight with BSP geometry due to floating point precision.
* The reflections of [projectile][] _widgets_ like [light_volumes][light_volume] in mirrored surfaces are misaligned. _Attachments_ like [contrails][contrail] are not affected, nor are vehicle widgets. This works correctly on Xbox and MCC only.
* Ripple map mipmaps for [shader_transparent_water][shader_transparent_water#known-issues] are reversed, with smaller mipmaps being used at closer distances. MCC is not affected.
* Many effects are still tied to frame rate rather than _tick rate_, like camera shake in [damage_effect][], [contrail][] point generation, and radar blips. At high frame rates, these effects may break down or progress faster than intended. Again, Chimera includes fixes for these issues.

# Troubleshooting
Some PC hardware configurations may cause problems with the renderer, specifically transparent shaders stretching/exploding, and mirror reflections exploding. If you are experiencing this, try forcing 1 core affinity for the game process.

[ff]: https://en.wikipedia.org/wiki/Fixed-function