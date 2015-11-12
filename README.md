# BaBoom

Big Bomb Bot - self destructs for nuke-sized explosion, commander-sized if hit

## Piecemeal Unit Mods

This is also a test-bed for piecemeal units mods. Three great beasts bar the way:

- Unable to update strategic icons: Icon Reloader can refresh previously known icon ids; BaBoom is currently using `paratrooper`
- Build bar is defined statically in the UI: This mod has a proof of concept for incremental additions, but is still jamming itself into `["bot", 1]` without regard for previous occupants.
- `unit_list.json`: this one is going to be a PITA

## Development

The generated project includes a `package.json` that lists the dependencies, but you'll need to run `npm install` to download them.

PA will upload **all files** in the mod directory, including `node_modules` and maybe even `.git` - you probably don't want to use this in `server_mods` directly, unless you really like waiting.  The template is set up run to run as a project within a peer directory of `server_mods` - I use `server_mods_dev/mod_name`.  The task `grunt copy:mod` will copy the mod files to `../../server_mods/identifier`, you can change the `modPath` in the Gruntfile if you want to run it from somewhere else.

### Available Tasks

- copy:mod - copy the mod files into `server_mods`
- copy:static - copy the mod icon into the pa directory
- proc - create the unit, weapons, and `unit_list` in the local pa
- default: proc, copy:static, copy:mod
