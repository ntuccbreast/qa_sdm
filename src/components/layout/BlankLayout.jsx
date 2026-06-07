import { Outlet } from "react-router-dom";

const BlankLayout = () => {
  return (
    <div className="layout-wrapper">
      {" "}
      {/* 保持一致，內容才不會跳動 */}
      <main style={{ flex: 1 }}>
        <Outlet />
      </main>
    </div>
  );
};

export default BlankLayout;
