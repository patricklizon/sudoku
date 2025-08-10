import type { JSX } from "solid-js";

export const ButtonTestId = {
	root: "button-component-root",
};

export type ButtonProps = ComponentCommonProps<JSX.ButtonHTMLAttributes<HTMLButtonElement>>;

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
