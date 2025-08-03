import { render } from "@solidjs/testing-library";
import { page, userEvent } from "@vitest/browser/context";
import { test, expect, vi } from "vitest";
import { VitestBrowserAdapter } from "#test/test-po-vitest-adapter";
import { Button } from "./button";
import { ButtonPO } from "./button.po";

test("Renders with defaults", async () => {
	const adapter = new VitestBrowserAdapter(page);
	const po = new ButtonPO(adapter);

	render(() => (
		<Button>
			<input data-testid="some-random-test" disabled />
		</Button>
	));

	const sut = po.getButton();

	await expect.element(sut).toHaveTextContent("");
	await expect.element(sut).toHaveAttribute("type", "button");
});

test("Overrides 'data-testid' prop", async () => {
	const testId = "my-custom-button-id";
	const textContent = "Button with custom test id";
	const adapter = new VitestBrowserAdapter(page);
	const po = new ButtonPO(adapter, { testId });

	render(() => <Button data-testid={testId}>{textContent}</Button>);

	const sut = po.getButton();

	await expect.element(sut).toHaveTextContent(textContent);
});

test("Clicking an element calls 'onClick' callback", async () => {
	const adapter = new VitestBrowserAdapter(page);
	const po = new ButtonPO(adapter);
	const user = userEvent.setup();
	const onClickSpy = vi.fn();

	render(() => <Button onClick={onClickSpy}>Click Me If You Can</Button>);

	const sut = po.getButton();
	await user.click(sut.element());

	expect(onClickSpy).toHaveBeenCalledTimes(1);
});

test("Clicking a 'disabled' element does not call 'onClick' callback", async () => {
	const adapter = new VitestBrowserAdapter(page);
	const po = new ButtonPO(adapter);
	const user = userEvent.setup();
	const onClickSpy = vi.fn();

	render(() => (
		<Button onClick={onClickSpy} disabled>
			Click Me If You Can
		</Button>
	));

	const sut = po.getButton();
	await expect.element(sut).toBeDisabled();
	await user.click(sut.element(), { force: true });

	expect(onClickSpy).toHaveBeenCalledTimes(0);
});
