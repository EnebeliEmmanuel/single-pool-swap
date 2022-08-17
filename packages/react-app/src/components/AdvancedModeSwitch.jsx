import { Switch } from "antd";
import React, { useEffect, useState } from "react";
import { useThemeSwitcher } from "react-css-theme-switcher";

export default function AdvancedModeSwitch (props) {
    const isAdvancedMode = props.isAdvancedMode;
    const advancedModeChanger = props.advancedModeChanger;

    
const toggleAdvancedMode = isChecked => {
    advancedModeChanger(isChecked);
    
  };


  return (
      <div className="advancedModeSwitch">
          <h3>Advanced mode</h3>
          <Switch checked={isAdvancedMode} onChange={toggleAdvancedMode} />
      </div>

  );
}
