import { renderHook } from "@solidjs/testing-library";
import { test, expect, vi } from "vitest";
import { DeploymentCtxProvider, type DeploymentCtxProviderProps } from "#src/context/deployment";
import { useDeploymentInfo } from "./use-deployment-info";

type RequestEvent = NonNullable<
	ReturnType<NonNullable<DeploymentCtxProviderProps["_getRequestEvent"]>>
>;

test("returns full set of deployment entries", () => {
	const requestEvent = {
		nativeEvent: {
			context: {
				cloudflare: {
					env: {
						// TODO: refactor - figure out if it's possible to generate primitive
						// @ts-expect-error: cloudflare's typegen returns union instead of primitive
						PULL_REQUEST_URL: "https://github.com/test/repo/pull/42",
						// @ts-expect-error: cloudflare's typegen returns union instead of primitive
						DEPLOYMENT_ID: "abc-123",
						// @ts-expect-error: cloudflare's typegen returns union instead of primitive
						DEPLOYMENT_TIMESTAMP: "2025-08-03T18:50:39Z",
					},
				},
			},
		},
	} satisfies RequestEvent;

	const getRequestEventFn = vi.fn().mockReturnValue(requestEvent);

	const { result, cleanup } = renderHook(useDeploymentInfo, {
		wrapper: (props) => (
			<DeploymentCtxProvider _getRequestEvent={getRequestEventFn}>
				{props.children}
			</DeploymentCtxProvider>
		),
	});

	expect(result()).toMatchInlineSnapshot(`
		[
		  {
		    "isVisibleEmpty": true,
		    "label": "Deployment ID",
		    "value": "abc-123",
		  },
		  {
		    "isVisibleEmpty": true,
		    "label": "Deployed At",
		    "value": "Aug 3, 2025, 6:50:39 PM",
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
	const requestEvent = {
		nativeEvent: {
			context: {
				cloudflare: {
					env: {
						// TODO: refactor - figure out if it's possible to generate primitive
						// @ts-expect-error: cloudflare's typegen returns union instead of primitive
						PULL_REQUEST_URL: "https://github.com/test/repo/pull/42",
						// @ts-expect-error: cloudflare's typegen returns union instead of primitive
						DEPLOYMENT_ID: "abc-123",
						// @ts-expect-error: cloudflare's typegen returns union instead of primitive
						DEPLOYMENT_TIMESTAMP: "2025-08-03T18:50:39Z",
					},
				},
			},
		},
	} satisfies RequestEvent;

	const getRequestEventFn = vi.fn().mockReturnValue(requestEvent);

	const { result, cleanup } = renderHook(useDeploymentInfo, {
		wrapper: (props) => (
			<DeploymentCtxProvider _getRequestEvent={getRequestEventFn}>
				{props.children}
			</DeploymentCtxProvider>
		),
	});

	expect(result()).toMatchInlineSnapshot(`
		[
		  {
		    "isVisibleEmpty": true,
		    "label": "Deployment ID",
		    "value": "abc-123",
		  },
		  {
		    "isVisibleEmpty": true,
		    "label": "Deployed At",
		    "value": "Aug 3, 2025, 6:50:39 PM",
		  },
		  {
		    "label": "Pull Request URL",
		    "value": "https://github.com/test/repo/pull/42",
		  },
		]
	`);

	cleanup();
});
