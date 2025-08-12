import { faker } from "@faker-js/faker";
import { Router } from "@solidjs/router";
import { render } from "@solidjs/testing-library";
import { page } from "@vitest/browser/context";
import { test, expect, vi } from "vitest";
import { DeploymentProvider, type DeploymentCtxProviderProps } from "#src/context/deployment";
import { VitestBrowserAdapter } from "#test/test-po-vitest-adapter";
import { DeploymentInfo } from "./deployment-info";
import { DeploymentInfoPO } from "./deployment-info.po";

type RequestEvent = NonNullable<
	ReturnType<NonNullable<DeploymentCtxProviderProps["_getRequestEvent"]>>
>;

test("renders deployment info entries", async () => {
	const adapter = new VitestBrowserAdapter(page);
	const po = new DeploymentInfoPO(adapter);
	const id = faker.string.nanoid();
	const pullRequestURL = faker.internet.url();
	const timestamp = "2022-01-29T06:12:12.829Z";
	const requestEvent = {
		nativeEvent: {
			context: {
				cloudflare: {
					env: {
						// TODO: refactor - figure out if it's possible to generate primitive
						// @ts-expect-error: cloudflare's typegen returns union instead of primitive
						PULL_REQUEST_URL: pullRequestURL,
						// @ts-expect-error: cloudflare's typegen returns union instead of primitive
						DEPLOYMENT_ID: id,
						// @ts-expect-error: cloudflare's typegen returns union instead of primitive
						DEPLOYMENT_TIMESTAMP: timestamp,
					},
				},
			},
		},
	} satisfies RequestEvent;
	const getRequestEventFn = vi.fn().mockReturnValue(requestEvent);

	render(() => (
		<Router
			root={() => (
				<DeploymentProvider _getRequestEvent={getRequestEventFn}>
					<DeploymentInfo />
				</DeploymentProvider>
			)}
		/>
	));

	await expect.element(po.getDeploymentIdEntry().getLabel()).toHaveTextContent("Deployment ID");
	await expect.element(po.getDeploymentIdEntry().getValue()).toHaveTextContent(id);
	await expect.element(po.getDeployedAtEntry().getLabel()).toHaveTextContent("Deployed At");
	await expect.element(po.getDeployedAtEntry().getValue()).not.toEqual(timestamp);
	await expect
		.element(po.getDeployedAtEntry().getValue())
		.toHaveTextContent("Jan 29, 2022, 6:12:12 AM");
	await expect
		.element(po.getPullRequestUrlEntry().getLabel())
		.toHaveTextContent("Pull Request URL");
	await expect.element(po.getPullRequestUrlEntry().getValue()).toHaveTextContent(pullRequestURL);
	await expect
		.element(po.getPullRequestUrlEntry().getValue())
		.toHaveAttribute("href", pullRequestURL);
});

test("handles non-URL values as plain text", async () => {
	const adapter = new VitestBrowserAdapter(page);
	const po = new DeploymentInfoPO(adapter);
	const id = faker.string.nanoid();
	const timestamp = faker.date.recent().toISOString();
	const requestEvent = {
		nativeEvent: {
			context: {
				cloudflare: {
					env: {
						// TODO: refactor - figure out if it's possible to generate primitive
						// @ts-expect-error: cloudflare's typegen returns union instead of primitive
						PULL_REQUEST_URL: "wwwwwww",
						// @ts-expect-error: cloudflare's typegen returns union instead of primitive
						DEPLOYMENT_ID: id,
						// @ts-expect-error: cloudflare's typegen returns union instead of primitive
						DEPLOYMENT_TIMESTAMP: timestamp,
					},
				},
			},
		},
	} satisfies RequestEvent;
	const getRequestEventFn = vi.fn().mockReturnValue(requestEvent);

	render(() => (
		<Router
			root={() => (
				<DeploymentProvider _getRequestEvent={getRequestEventFn}>
					<DeploymentInfo />
				</DeploymentProvider>
			)}
		/>
	));

	await expect.element(po.getPullRequestUrlEntry().getValue()).toHaveTextContent("wwwwwww");
	await expect.element(po.getPullRequestUrlEntry().getValue()).not.toHaveAttribute("href");
});

test("does not render optional values", async () => {
	const adapter = new VitestBrowserAdapter(page);
	const po = new DeploymentInfoPO(adapter);

	const requestEvent = {
		nativeEvent: {
			context: {
				cloudflare: {
					env: {
						// TODO: refactor - figure out if it's possible to generate primitive
						PULL_REQUEST_URL: "",
						// @ts-expect-error: cloudflare's typegen returns union instead of primitive
						DEPLOYMENT_ID: "",
						DEPLOYMENT_TIMESTAMP: "",
					},
				},
			},
		},
	} satisfies RequestEvent;
	const getRequestEventFn = vi.fn().mockReturnValue(requestEvent);

	render(() => (
		<Router
			root={() => (
				<DeploymentProvider _getRequestEvent={getRequestEventFn}>
					<DeploymentInfo />
				</DeploymentProvider>
			)}
		/>
	));

	await expect.element(po.getDeployedAtEntry().getValue()).toHaveTextContent("unknown");
	await expect.element(po.getDeploymentIdEntry().getValue()).toHaveTextContent("unknown");
});
