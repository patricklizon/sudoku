import { renderHook } from "@solidjs/testing-library";
import { test, expect } from "vitest";
import { DeploymentInfoCtxProvider, type TDeploymentCtx } from "#src/context/deployment";
import { useDeploymentInfo } from "./use-deployment-info";

test("returns full set of deployment entries", () => {
	const ctx = {
		id: "abc-123",
		timestamp: "2025-08-03T18:50:39Z",
		host: "https://example.com",
		pullRequestURL: "https://github.com/test/repo/pull/42",
	} satisfies TDeploymentCtx;

	const { result, cleanup } = renderHook(useDeploymentInfo, {
		wrapper: (props) => (
			<DeploymentInfoCtxProvider _override={ctx}>{props.children}</DeploymentInfoCtxProvider>
		),
	});

	expect(result()).toMatchInlineSnapshot(`
		[
		  {
		    "label": "Deployment ID",
		    "value": "abc-123",
		  },
		  {
		    "label": "Deployed At",
		    "value": "Aug 3, 2025, 6:50:39 PM",
		  },
		  {
		    "label": "Deploy URL",
		    "value": "https://example.com",
		  },
		  {
		    "label": "Pull Request URL",
		    "value": "https://github.com/test/repo/pull/42",
		  },
		]
	`);

	cleanup();
});

test("returns partial set of deployment entries", () => {
	const ctx = {
		id: "abc-123",
		timestamp: "2025-08-03T18:50:39Z",
		host: undefined,
		pullRequestURL: "https://github.com/test/repo/pull/42",
	} satisfies TDeploymentCtx;

	const { result, cleanup } = renderHook(useDeploymentInfo, {
		wrapper: (props) => (
			<DeploymentInfoCtxProvider _override={ctx}>{props.children}</DeploymentInfoCtxProvider>
		),
	});

	expect(result()).toMatchInlineSnapshot(`
		[
		  {
		    "label": "Deployment ID",
		    "value": "abc-123",
		  },
		  {
		    "label": "Deployed At",
		    "value": "Aug 3, 2025, 6:50:39 PM",
		  },
		  {
		    "label": "Deploy URL",
		    "value": undefined,
		  },
		  {
		    "label": "Pull Request URL",
		    "value": "https://github.com/test/repo/pull/42",
		  },
		]
	`);

	cleanup();
});
