import type { JSX } from "solid-js";
import { ButtonTestId } from "./button.testid";

export type ButtonProps = ComponentCommonTypes<JSX.ButtonHTMLAttributes<HTMLButtonElement>>;

export function Button(props: ButtonProps): JSX.Element {
	return (
		<button
			{...props}
			disabled={props.disabled ?? false}
			type={props.type ?? "button"}
			data-testid={props["data-testid"] ?? ButtonTestId.root}
		>
			{props.children}
		</button>
	);
}
