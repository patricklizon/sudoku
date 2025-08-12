import { Router } from "@solidjs/router";
import { render } from "@solidjs/testing-library";
import { page, userEvent } from "@vitest/browser/context";
import { test, expect, vi } from "vitest";
import { VitestBrowserAdapter } from "#test/test-po-vitest-adapter";
import { Anchor } from "./anchor";
import { AnchorPO } from "./anchor.po";

test("Renders with defaults", async () => {
	const adapter = new VitestBrowserAdapter(page);
	const po = new AnchorPO(adapter);

	render(() => <Router root={() => <Anchor href="#"> </Anchor>} />);

	const sut = po.root();

	await expect.element(sut).toHaveTextContent("");
	await expect.element(sut).toHaveAttribute("href", "/#");
});

test("Overrides 'data-testid' prop", async () => {
	const testId = "my-custom-anchor-id";
	const textContent = "Anchor with custom test id";
	const adapter = new VitestBrowserAdapter(page);
	const po = new AnchorPO(adapter, { testId });

	render(() => (
		<Router
			root={() => (
				<Anchor href="#" data-testid={testId}>
					{textContent}
				</Anchor>
			)}
		/>
	));

	const sut = po.root();

	await expect.element(sut).toHaveTextContent(textContent);
	await expect.element(sut).toHaveAttribute("href", "/#");
});

test("Renders with custom href", async () => {
	const customHref = "/some-path";
	const textContent = "Link to somewhere";
	const adapter = new VitestBrowserAdapter(page);
	const po = new AnchorPO(adapter);

	render(() => <Router root={() => <Anchor href={customHref}>{textContent}</Anchor>} />);

	const sut = po.root();

	await expect.element(sut).toHaveTextContent(textContent);
	await expect.element(sut).toHaveAttribute("href", customHref);
});

test("Clicking an element calls 'onClick' callback", async () => {
	const adapter = new VitestBrowserAdapter(page);
	const po = new AnchorPO(adapter);
	const user = userEvent.setup();
	const onClickSpy = vi.fn();

	render(() => (
		<Router
			root={() => (
				<Anchor href="#" onClick={onClickSpy}>
					Click Me If You Can
				</Anchor>
			)}
		/>
	));

	const sut = po.root();
	await user.click(sut.element());

	expect(onClickSpy).toHaveBeenCalledTimes(1);
});

test("Clicking an 'aria-disabled' element does not call 'onClick' callback", async () => {
	const adapter = new VitestBrowserAdapter(page);
	const po = new AnchorPO(adapter);
	const user = userEvent.setup();
	const onClickSpy = vi.fn();

	render(() => (
		<Router
			root={() => (
				<Anchor href="#" onClick={onClickSpy} aria-disabled="true">
					Click Me If You Can
				</Anchor>
			)}
		/>
	));

	const sut = po.root();
	await expect.element(sut).toBeDisabled();
	await user.click(sut.element(), { force: true });

	expect(onClickSpy).toHaveBeenCalledTimes(1);
});

test("Renders with target and rel attributes", async () => {
	const adapter = new VitestBrowserAdapter(page);
	const po = new AnchorPO(adapter);
	const textContent = "External Link";

	render(() => (
		<Router
			root={() => (
				<Anchor href="https://example.com" target="_blank" rel="noopener noreferrer">
					{textContent}
				</Anchor>
			)}
		/>
	));

	const sut = po.root();

	await expect.element(sut).toHaveTextContent(textContent);
	await expect.element(sut).toHaveAttribute("href", "https://example.com");
	await expect.element(sut).toHaveAttribute("target", "_blank");
	await expect.element(sut).toHaveAttribute("rel", "noopener noreferrer");
});
