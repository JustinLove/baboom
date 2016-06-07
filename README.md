# BaBoom

Big Bomb Bot - self destructs for nuke-sized explosion, commander-sized if hit

## Composable Unit Mods

This is also a test-bed for composable units mods. Serveral problems have been solved and the last is tractable:

- `unit_list.json`: Scratched. We can calculate buildable lists but the server does not accept the build commands. Theoretically solvable with run-time mod creation.

## Development

The generated project includes a `package.json` that lists the dependencies, but you'll need to run `npm install` to download them.

PA will upload **all files** in the mod directory, including `node_modules` and maybe even `.git` - you probably don't want to use this in `server_mods` directly, unless you really like waiting.  The template is set up run to run as a project within a peer directory of `server_mods` - I use `server_mods_dev/mod_name`.  The task `grunt copy:mod` will copy the mod files to `../../server_mods/identifier`, you can change the `modPath` in the Gruntfile if you want to run it from somewhere else.

### Available Tasks

- copy:mod - copy the mod files into `server_mods`
- copy:static - copy the mod icon into the pa directory
- proc - create the unit, weapons, and `unit_list` in the local pa
- default: proc, copy:static, copy:mod
