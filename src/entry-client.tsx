// @refresh reload
import { mount, StartClient } from "@solidjs/start/client";

const rootElement = document.querySelector("#app");
if (!rootElement) throw new Error("node for mounting the app does not exist");

mount(() => <StartClient />, rootElement);
