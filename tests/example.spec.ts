import { test, expect } from "@playwright/test";

test("can generate game", async ({ page }) => {
	await page.goto("/");
	const difficultyLevelSelector = page.getByTestId("difficulty-level-selector");
	const buttonActionGeneratePuzzle = page.getByTestId("action-generate-puzzle");
	const gameBoard = page.getByTestId("game-board");

	await expect(gameBoard).not.toBeInViewport();
	await expect(buttonActionGeneratePuzzle).toBeInViewport();
	await expect(difficultyLevelSelector).toBeInViewport();

	await buttonActionGeneratePuzzle.click();

	await page.waitForLoadState("networkidle");
	await expect(gameBoard).toBeInViewport();

	const filledCells = page.getByTestId("game-board.cell").filter({ hasText: /^[1-9]$/ });
	const count = await filledCells.count();

	expect(count).toBeGreaterThanOrEqual(50);
	expect(count).toBeLessThanOrEqual(62);
});
