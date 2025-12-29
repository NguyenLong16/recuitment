import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "./redux/store";
import AppRoutes from "./routes/AppRoutes";

function App() {
  return (
    <>
      <Provider store={store}>
        <BrowserRouter>
          {/* Không cần AuthProvider nữa */}
          <AppRoutes />
        </BrowserRouter>
      </Provider>
    </>
  );
}

export default App;
