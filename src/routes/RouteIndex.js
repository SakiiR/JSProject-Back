import Route from "./Route";
import packageJson from "../../package.json";
import authMiddleware from "../middlewares/Auth";

@Route.Route({
  routeBase: "/",
  middlewares: [authMiddleware]
})
class RouteIndex extends Route {
  constructor(params) {
    super({ ...params });
  }

  @Route.Get({
    path: "/"
  })
  index(ctx) {
    this.sendOk(ctx, {
      name: packageJson.name,
      version: packageJson.version
    });
  }
}

export default RouteIndex;
