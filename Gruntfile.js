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
      static: {
        files: [
          {
            expand: true,
            src: '**',
            dest: './',
            cwd: 'static/'
          }
        ],
      },
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
      unit_list: {
        src: [
          'pa_ex1/units/unit_list.json',
        ],
        cwd: media,
        dest: 'pa/units/unit_list.json',
        process: function(spec) {
          spec.units.push('/pa/units/land/baboom/baboom.json')
          return spec
        }
      },
      baboom: {
        src: [
          'pa_ex1/units/land/bot_bomb/bot_bomb.json',
          'pa/units/commanders/base_commander/base_commander.json',
        ],
        cwd: media,
        dest: 'pa/units/land/baboom/baboom.json',
        process: function(spec, com) {
          spec.display_name = 'BaBoom'
          spec.description = 'Big Bomb Bot - self destructs for nuke-sized explosion, commander-sized if hit'
          spec.build_metal_cost = 8000
          spec.unit_types = spec.unit_types.filter(function(type) {
            return type != 'UNITTYPE_Basic' && type != 'UNITTYPE_CannonBuildable'
          })
          spec.unit_types.push('UNITTYPE_Advanced')
          spec.death_weapon = com.death_weapon
          spec.tools[0].spec_id = '/pa/units/land/baboom/baboom_tool_weapon.json'
          var scale = 3
          spec.model = {
            "filename": "/pa/units/land/baboom/baboom.papa",
            "animations": {
              "death01": "/pa/units/land/baboom/baboom_anim_death01.papa",
              "idle": "/pa/units/land/baboom/baboom_anim_idle.papa",
              "walk": "/pa/units/land/baboom/baboom_anim_run.papa"
            },
            "animtree": "/pa/anim/anim_trees/bot_bomb_anim_tree.json",
            "walk_speed": spec.model.walk_speed * scale
          }
          var head = spec.attachable.offsets.head
          for (var i in head) { head[i] = head[i] * scale }
          spec.physics.radius = spec.physics.radius * scale
          spec.selection_icon.diameter = spec.selection_icon.diameter * scale
          spec.TEMP_texelinfo = spec.TEMP_texelinfo * scale
          var mesh = spec.mesh_bounds
          for (var i in mesh) { mesh[i] = mesh[i] * scale }
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

  grunt.registerTask('printPath', function() {
    console.log(media)
  });

  // Default task(s).
  grunt.registerTask('default', ['proc', 'copy:static', 'copy:mod', 'printPath']);

};

