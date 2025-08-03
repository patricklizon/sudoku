type _ComponentCommonTypes = {
	class?: string;
	classList?: { [className: string]: boolean } | undefined;
	"data-testid"?: string;
};

type ComponentCommonTypes<T> = Omit<T, keyof _ComponentCommonTypes> & _ComponentCommonTypes;
