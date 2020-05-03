### TODO
Modularise character class.
Think of how you are going to control characters in the real game; e.g. who is being controlled by
my mouse clicks right now. How to get a single NPC from A to B.

Just start off simple with single character mode?

Separate assets repo. Must be DL'd like node_modules.
Maybe create a list of models (JSON style) with url to their location, and they will be named as their key, with their value being the name on the asset repo. This way it'll be easy to update single assets to different versions. Then the assets folder can be placed in the .gitignore

shouldn't need to do anything inside a docker container - just make it part of the production bundling process. assets will be generated @ the same time and placed wherever.


think how you’re gonna do the assets folder…
Maybe think about production build early on too


sketchfab.com



Login system for dev mode:
Just enter username. No password. Generate sid as usual.