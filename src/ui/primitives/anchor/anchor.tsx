import { A } from "@solidjs/router";
import type { JSX } from "solid-js";
import { AnchorTestId } from "./anchor.testid";

export type AnchorProps = ComponentCommonProps<
	JSX.AnchorHTMLAttributes<HTMLAnchorElement> & { href: string }
>;

export function Anchor(props: AnchorProps): JSX.Element {
	return (
		<A
			{...props}
			activeClass="active"
			inactiveClass="inactive"
			href={props.href}
			type={props.type ?? "button"}
			data-testid={props["data-testid"] ?? AnchorTestId.root}
		>
			{props.children}
		</A>
	);
}
