var spec = require('./lib/spec')
var prompt = require('prompt')
prompt.start()

var modPath = '../../server_mods/com.wondible.pa.baboom/'
var stream = 'stable'
var media = require('./lib/path').media(stream)

module.exports = function(grunt) {
  // Project configuration.
  grunt.initConfig({
    copy: {
      mod: {
        files: [
          {
            src: [
              'modinfo.json',
              'LICENSE.txt',
              'README.md',
              'CHANGELOG.md',
              'ui/**',
              'pa/**'],
            dest: modPath,
          },
        ],
      },
    },
    clean: ['pa', modPath],
    // copy files from PA, transform, and put into mod
    proc: {
      baboom: {
        src: [
          'pa/units/land/bot_bomb/bot_bomb.json',
          'pa/units/commanders/base_commander/base_commander.json',
        ],
        cwd: media,
        dest: 'pa/units/land/baboom/baboom.json',
        process: function(spec, com) {
          spec.display_name = 'BaBoom'
          spec.description = 'Big Bomb Bot - self destructs for nuke-sized exlosion, commander-sized if hit'
          spec.build_metal_cost = 8000
          spec.death_weapon = com.death_weapon
          spec.tools[0].spec_id = '/pa/units/land/baboom/baboom_tool_weapon.json'
          return spec
        }
      },
      baboom_tool_weapon: {
        src: [
          'pa/units/land/bot_bomb/bot_bomb_tool_weapon.json',
        ],
        cwd: media,
        dest: 'pa/units/land/baboom/baboom_tool_weapon.json',
        process: function(spec) {
          spec.target_layers.push('WL_Orbital', 'WL_Air')
          spec.ammo_id = '/pa/units/land/baboom/baboom_ammo.json'
          return spec
        }
      },
      baboom_ammo: {
        src: [
          'pa_ex1/units/land/nuke_launcher/nuke_launcher_ammo.json',
          'pa/units/land/nuke_launcher/nuke_launcher_ammo_explosion_ent.json',
        ],
        cwd: media,
        dest: 'pa/units/land/baboom/baboom_ammo.json',
        process: function(missile, explosion) {
          return {
            ammo_type: 'PBAOE',
            damage: missile.damage,
            damage_volume: missile.damage_volume,
            armor_damage_map: missile.armor_damage_map,
            full_damage_splash_radius: missile.full_damage_splash_radius,
            splash_damage: missile.splash_damage,
            splash_radius: missile.splash_radius,
            splash_damage_orbital: missile.splash_damage_orbital,
            splash_damages_allies: missile.splash_damages_allies,
            burn_damage: missile.burn_damage,
            burn_radius: missile.burn_radius,
            recon: explosion.recon,
            spawn_response: explosion.spawn_response,
            impact_decals: missile.impact_decals,
          }
        }
      },
    }
  });

  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-copy');

  grunt.registerMultiTask('proc', 'Process unit files into the mod', function() {
    if (this.data.targets) {
      var specs = spec.copyPairs(grunt, this.data.targets, media)
      spec.copyUnitFiles(grunt, specs, this.data.process)
    } else {
      var specs = this.filesSrc.map(function(s) {return grunt.file.readJSON(media + s)})
      var out = this.data.process.apply(this, specs)
      grunt.file.write(this.data.dest, JSON.stringify(out, null, 2))
    }
  })

  // Default task(s).
  grunt.registerTask('default', ['proc', 'copy:mod']);

};

