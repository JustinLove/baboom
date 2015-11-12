;(function() {
  var customUnits = [{
    spec_id: '/pa/units/land/baboom/baboom.json',
    preferred_builds: [['bot', 1]],
  }]

  if (window.Build) {
    var source = Build.HotkeyModel.toString()
    customUnits.forEach(function(unit) {
      var item = '"' + unit.spec_id + '": ' + JSON.stringify(unit.preferred_builds[0])
      source = source.replace(/\](\r\n\s+)/, '],$1    ' + item + '$1')
    })
    Build.HotkeyModel = eval('(' + source + ')')

    if (model.buildHotkeyModel) {
      var build = model.buildHotkeyModel.SpecIdToGridMap()
      customUnits.forEach(function(unit) {
        build[unit.spec_id] = unit.preferred_builds[0]
      })
      model.buildHotkeyModel.SpecIdToGridMap.notifySubscribers()
    }
  }
})()