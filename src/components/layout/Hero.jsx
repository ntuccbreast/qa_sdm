import ImageAvatars from "../common/ImageAvatars";

const Hero = ({ title, description, imageUrl }) => {
  // 1. 這裡定義標題樣式
  const titleStyle = {
    fontSize: "1.8rem",
    color: "#333",
    marginTop: "15px",
    marginBottom: "0px",
    maxWidth: "480px", // 👈 標題寬度上限
    marginLeft: "auto", // 👈 置中
    marginRight: "auto", // 👈 置中
    fontWeight: "bold",
  };

  // 2. 這裡定義描述樣式
  const descriptionStyle = {
    color: "#666",
    marginTop: "10px",
    fontSize: "1.05rem",
    lineHeight: "1.6",
    maxWidth: "420px", // 👈 描述文字縮得比標題更窄（420px），視覺層次最好
    marginLeft: "auto", // 👈 置中
    marginRight: "auto",
  };

  return (
    <div
      className="hero-section"
      style={{
        textAlign: "center",
        backgroundColor: "white", // 確保背景是白的，或者跟你的背景色一致
        paddingTop: "40px", // 👈 增加這行！控制頭像跟最頂端的距離
        paddingBottom: "0px",
        paddingLeft: "20px",
        paddingRight: "20px",
        minHeight: "250px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      {/* 頭像組件 */}
      <div style={{ minHeight: "80px" }}>
        <ImageAvatars imageUrl={imageUrl} />
      </div>
      {/* 標題 */}
      <h1 style={titleStyle}>{title}</h1>

      {/* 描述文字 */}
      <p style={descriptionStyle}>{description}</p>
    </div>
  );
};

export default Hero;
