import { SpeedDial, SpeedDialAction, SpeedDialIcon } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";

export const CustomSpeedDial = ({
  onClick,
  onClickSearch,
  direction,
  left,
  right,
}: any) => {
  return (
    <SpeedDial
      ariaLabel="SpeedDial openIcon example"
      sx={{
        position: "fixed",
        left: left == null ? null : left,
        right: right == null ? null : right,
        marginTop: 2,
      }}
      icon={<SpeedDialIcon />}
      color="#FF5733"
      direction={direction == null ? "down" : direction}
    >
      <SpeedDialAction onClick={onClick} icon={<AddIcon />} />
      <SpeedDialAction onClick={onClickSearch} icon={<SearchIcon />} />
    </SpeedDial>
  );
};
