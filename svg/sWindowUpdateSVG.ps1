$btn_close_active=$(Get-Content -encoding UTF8 .\btn-close-active.svg -ReadCount 3 | ForEach{$_ -Join " "})
$btn_close_disabled=$(Get-Content -encoding UTF8 .\btn-close-disabled.svg -ReadCount 3 | ForEach{$_ -Join " "})
$btn_close_down=$(Get-Content -encoding UTF8 .\btn-close-down.svg -ReadCount 3 | ForEach{$_ -Join " "})
$btn_close_inactive=$(Get-Content -encoding UTF8 .\btn-close-inactive.svg -ReadCount 3 | ForEach{$_ -Join " "})
$btn_open_active=$(Get-Content -encoding UTF8 .\btn-open-active.svg -ReadCount 3 | ForEach{$_ -Join " "})
$btn_open_disabled=$(Get-Content -encoding UTF8 .\btn-open-disabled.svg -ReadCount 3 | ForEach{$_ -Join " "})
$btn_open_down=$(Get-Content -encoding UTF8 .\btn-open-down.svg -ReadCount 3 | ForEach{$_ -Join " "})
$btn_open_inactive=$(Get-Content -encoding UTF8 .\btn-open-inactive.svg -ReadCount 3 | ForEach{$_ -Join " "})
$btn_reload_disabled=$(Get-Content -encoding UTF8 .\btn-reload-disabled.svg -ReadCount 3 | ForEach{$_ -Join " "})
$btn_reload_down=$(Get-Content -encoding UTF8 .\btn-reload-down.svg -ReadCount 3 | ForEach{$_ -Join " "})
$btn_reload_inactive=$(Get-Content -encoding UTF8 .\btn-reload-inactive.svg -ReadCount 3 | ForEach{$_ -Join " "})
$seekbar_icon_start=$(Get-Content -encoding UTF8 .\seekbar-icon-start.svg -ReadCount 3 | ForEach{$_ -Join " "})
$seekbar_icon_end=$(Get-Content -encoding UTF8 .\seekbar-icon-end.svg -ReadCount 3 | ForEach{$_ -Join " "})
$seekbar_line=$(Get-Content -encoding UTF8 .\seekbar-line.svg -ReadCount 3 | ForEach{$_ -Join " "})
$seekbar_cursor=$(Get-Content -encoding UTF8 .\seekbar-cursor.svg -ReadCount 3 | ForEach{$_ -Join " "})

json="{btn_close_active: '$btn_close_active',btn_close_disabled: '$btn_close_disabled',btn_close_down: '$btn_close_down',btn_close_inactive: '$btn_close_inactive',btn_open_active: '$btn_open_active',btn_open_disabled: '$btn_open_disabled',btn_open_down: '$btn_open_down',btn_open_inactive: '$btn_open_inactive',btn_reload_disabled: '$btn_reload_disabled',btn_reload_down: '$btn_reload_down',btn_reload_inactive: '$btn_reload_inactive',seekbar_icon_start: '$seekbar_icon_start',seekbar_icon_end: '$seekbar_icon_end',seekbar_line: '$seekbar_line',seekbar_cursor: '$seekbar_cursor'}"

if(Test-Path -Path "../js") {
  echo 'var CONFIG_SVG = ' $json > ../js/config_svg.js
}

if(Test-Path -Path "../js_build") {
  echo 'var CONFIG_SVG = ' $json > ../js_build/config_svg.js
}

echo "update svg_config successfully"