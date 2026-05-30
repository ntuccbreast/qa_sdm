import { useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
  useParams,
} from "react-router-dom";
import { UIProvider } from "./context/UIContext";
import MainLayout from "./components/layout/MainLayout";
import Home from "./pages/Home";
import Selection from "./pages/Selection";
import Questionnaire from "./pages/Questionnaire";
import SDM from "./pages/SDM";
import Result from "./pages/Result";
import Chatbot from "./pages/Chatbot";

// 建立一個內部元件來取得 location，因為 <Router> 必須在 useLocation 的外層
function AppRoutes() {
  const location = useLocation();

  return (
    <Routes location={location}>
      {/* 當 key 改變，MainLayout 會徹底重刷，捲動位置自然會歸零 */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/Selection" element={<Selection />} />
        <Route path="/SDM" element={<SDM />} />
        <Route path="/Chatbot" element={<Chatbot />} />
        <Route path="/questionnaire/:topicKey" element={<Questionnaire />} />
        <Route path="/Result" element={<Result />} />
      </Route>
    </Routes>
  );
}

function App() {
  useEffect(() => {
    // 核心：強迫瀏覽器忘記所有捲動位置
    // 這樣不論是按「返回」還是跳轉，瀏覽器都不會自動捲動
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }
  }, []);

  return (
    <UIProvider>
      <Router>
        <AppRoutes />
      </Router>
    </UIProvider>
  );
}

export default App;
