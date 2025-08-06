import { faker } from "@faker-js/faker";
import { render } from "@solidjs/testing-library";
import { page } from "@vitest/browser/context";
import { test, expect } from "vitest";
import { DeploymentCtx } from "#src/context/deployment";
import { VitestBrowserAdapter } from "#test/test-po-vitest-adapter";
import { DeploymentInfo } from "./deployment-info";
import { DeploymentInfoPO } from "./deployment-info.po";

test("renders deployment info entries", async () => {
	const adapter = new VitestBrowserAdapter(page);
	const po = new DeploymentInfoPO(adapter);

	const host = faker.internet.url();
	const id = faker.string.nanoid();
	const pullRequestURL = faker.internet.url();
	const timestamp = "2022-01-29T06:12:12.829Z";

	render(() => (
		<DeploymentCtx.Provider
			value={{
				host,
				id,
				pullRequestURL,
				timestamp,
			}}
		>
			<DeploymentInfo />
		</DeploymentCtx.Provider>
	));

	await expect.element(po.getEntryAtIdx(0).getLabel()).toHaveTextContent("Deployment ID");
	await expect.element(po.getEntryAtIdx(0).getValue()).toHaveTextContent(id);

	await expect.element(po.getEntryAtIdx(1).getLabel()).toHaveTextContent("Deployed At");
	await expect.element(po.getEntryAtIdx(1).getValue()).not.toEqual(timestamp);
	await expect
		.element(po.getEntryAtIdx(1).getValue())
		.toHaveTextContent("Jan 29, 2022, 6:12:12 AM");

	await expect.element(po.getEntryAtIdx(2).getLabel()).toHaveTextContent("Deploy URL");
	await expect
		.element(po.getEntryAtIdx(2).getValue()!.getByRole("link"))
		.toHaveAttribute("href", host);

	await expect.element(po.getEntryAtIdx(3).getLabel()).toHaveTextContent("Pull Request URL");
	await expect.element(po.getEntryAtIdx(3).getValue()).toHaveTextContent(pullRequestURL);
});

test("handles non-URL values as plain text", async () => {
	const adapter = new VitestBrowserAdapter(page);
	const po = new DeploymentInfoPO(adapter);

	const host = "asdf 1";
	const id = faker.string.nanoid();
	const timestamp = faker.date.recent().toISOString();

	render(() => (
		<DeploymentCtx.Provider
			value={{
				host,
				id,
				pullRequestURL: null,
				timestamp,
			}}
		>
			<DeploymentInfo />
		</DeploymentCtx.Provider>
	));

	await expect.element(po.getEntryAtIdx(2).getValue()).toHaveTextContent(host);
	await expect.element(po.getEntryAtIdx(2).getValue()).toHaveTextContent(host);

	expect(() => po.getEntryAtIdx(2).getValue()?.getByRole("link").element()).toThrow(
		"Cannot find element",
	);
});
