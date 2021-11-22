import { BrowserRouter, Switch, Route, withRouter } from "react-router-dom";
import "antd/dist/antd.css";
import "./App.css";
import Routes from "./routes/routes";
import { Dashboard } from "./pages/Dashboard";
import AdminPrivateRoute from "./routes/adminPrivateRoute";

function App() {
  const pageRoutes = () => {
    return (
      <div className="App">
        <Routes />
      </div>
    );
  };

  return (
    <BrowserRouter>
      <Switch>
        <AdminPrivateRoute
          path="/dashboard"
          component={withRouter(Dashboard)}
        />
        <Route component={withRouter(pageRoutes)} />
      </Switch>
    </BrowserRouter>
  );
}

export default App;
