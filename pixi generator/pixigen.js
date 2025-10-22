import { Application, Graphics } from "https://cdn.jsdelivr.net/npm/pixi.js@8.x/dist/pixi.mjs";

(async () => {
  const app = new Application();
  await app.init({ background: "#4bdbffff", resizeTo: window });
  document.body.appendChild(app.canvas);
  const square = new Graphics().rect(0, 0, 200, 100).fill({ color : "#000000"});
  app.stage.addChild(square);
})();