// @refresh reload
import { mount, StartClient } from "@solidjs/start/client";

const rootElement = document.getElementById("app");
if (!rootElement) throw new Error("node for mounting the app does not exist");

mount(() => <StartClient />, rootElement);
