export type SidebarItemParams = {
	id: number;
	title: string;
	icon: string;
	onClick?: Function;
}

export type SidebarParams =  {
	autoCollapse?: boolean;
	items?: SidebarItemParams[];
}