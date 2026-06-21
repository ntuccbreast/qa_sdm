import React from "react";
import ToggleButton from "@mui/material/ToggleButton";
import Tooltip from "@mui/material/Tooltip";

const OptionButton = ({ label, isSelected, isDisabled, onClick, tooltip, style }) => {
  const button = (
    <ToggleButton
      disableRipple
      value={label}
      selected={isSelected}
      disabled={isDisabled}
      onChange={onClick} // ToggleButton 使用 onChange
      fullWidth
      sx={{
        maxWidth: "480px",
        margin: "0 auto 12px auto",
        display: "flex",
        justifyContent: "flex-start",
        padding: "16px",
        borderRadius: "10px !important",
        fontSize: "1.08rem",
        textAlign: "left",
        textTransform: "none",
        border: "1px solid #ddd !important",
        marginBottom: "12px",
        transition: "all 0.2s ease",
        ...style,

        // 選中狀態
        "&.Mui-selected": {
          backgroundColor: "#fff5f7 !important",
          color: "#b9375d !important",
          border: "2px solid #b9375d !important",
          fontWeight: "bold",
        },

        // 懸停效果
        "&:hover": {
          backgroundColor: "#fdf2f5",
          borderColor: "#b9375d !important",
        },

        // 禁用狀態
        "&.Mui-disabled": {
          backgroundColor: "#f9f9f9",
          opacity: 0.6,
        },
      }}
    >
      {label}
    </ToggleButton>
  );

  if (tooltip) {
    return (
      // span wrapper needed because Tooltip requires a non-disabled child to fire events
      <Tooltip title={tooltip} placement="top" arrow>
        <span style={{ display: "block", maxWidth: "480px", margin: "0 auto" }}>
          {button}
        </span>
      </Tooltip>
    );
  }

  return button;
};

export default OptionButton;
