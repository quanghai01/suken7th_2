btn_close_active="$(tr '\n' ' ' < btn-close-active.svg )"
btn_close_disabled="$(tr '\n' ' ' < btn-close-disabled.svg )"
btn_close_down="$(tr '\n' ' ' < btn-close-down.svg )"
btn_close_inactive="$(tr '\n' ' ' < btn-close-inactive.svg )"
btn_open_active="$(tr '\n' ' ' < btn-open-active.svg )"
btn_open_disabled="$(tr '\n' ' ' < btn-open-disabled.svg )"
btn_open_down="$(tr '\n' ' ' < btn-open-down.svg )"
btn_open_inactive="$(tr '\n' ' ' < btn-open-inactive.svg )"
btn_reload_disabled="$(tr '\n' ' ' < btn-reload-disabled.svg )"
btn_reload_down="$(tr '\n' ' ' < btn-reload-down.svg )"
btn_reload_inactive="$(tr '\n' ' ' < btn-reload-inactive.svg )"
seekbar_icon_start="$(tr '\n' ' ' < seekbar-icon-start.svg )"
seekbar_icon_end="$(tr '\n' ' ' < seekbar-icon-end.svg )"
seekbar_line="$(tr '\n' ' ' < seekbar-line.svg )"
seekbar_cursor="$(tr '\n' ' ' < seekbar-cursor.svg )"

json="{btn_close_active: '$btn_close_active',btn_close_disabled: '$btn_close_disabled',btn_close_down: '$btn_close_down',btn_close_inactive: '$btn_close_inactive',btn_open_active: '$btn_open_active',btn_open_disabled: '$btn_open_disabled',btn_open_down: '$btn_open_down',btn_open_inactive: '$btn_open_inactive',btn_reload_disabled: '$btn_reload_disabled',btn_reload_down: '$btn_reload_down',btn_reload_inactive: '$btn_reload_inactive',seekbar_icon_start: '$seekbar_icon_start',seekbar_icon_end: '$seekbar_icon_end',seekbar_line: '$seekbar_line',seekbar_cursor: '$seekbar_cursor'}"

if [ -d "../js" ]; then
  echo "var CONFIG_SVG = " $json > ../js/config_svg.js
fi

if [ -d "../js_build" ]; then
  echo "var CONFIG_SVG = " $json > ../js_build/config_svg.js
fi

echo "update svg_config successfully"