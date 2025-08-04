type _ComponentCommonProps = {
	class?: string;
	classList?: { [className: string]: boolean } | undefined;
	"data-testid"?: string;
};

type ComponentCommonProps<T> = Omit<T, keyof _ComponentCommonProps> & _ComponentCommonProps;
