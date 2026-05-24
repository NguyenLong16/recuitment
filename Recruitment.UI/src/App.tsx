import { BrowserRouter } from "react-router-dom";
import { Provider, useDispatch, useSelector } from "react-redux";
import { store, AppDispatch, RootState } from "./redux/store";
import AppRoutes from "./routes/AppRoutes";
import ScrollToTop from "./components/ScrollToTop";
import { useEffect } from "react";
import { fetchSavedJobIds, clearSavedIds } from "./redux/slices/savedJobSlice";

// Inner component so it can access Redux hooks
const AppInit = () => {
  const dispatch = useDispatch<AppDispatch>();
  const user = useSelector((state: RootState) => state.auth.user);

  useEffect(() => {
    if (user) {
      dispatch(fetchSavedJobIds());
    } else {
      dispatch(clearSavedIds());
    }
  }, [user, dispatch]);

  return null;
};

function App() {
  return (
    <>
      <Provider store={store}>
        <BrowserRouter>
          <ScrollToTop />
          <AppInit />
          <AppRoutes />
        </BrowserRouter>
      </Provider>
    </>
  );
}

export default App;
