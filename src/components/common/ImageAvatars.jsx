import Avatar from "@mui/material/Avatar";

const ImageAvatars = ({ imageUrl }) => {
  return (
    <Avatar
      alt="HelperImage"
      src={imageUrl}
      sx={{ width: 100, height: 100, margin: "0 auto 15px" }}
    />
  );
};

export default ImageAvatars;