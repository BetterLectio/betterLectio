import { tv, type VariantProps } from 'tailwind-variants';

import Root from './alert.svelte';
import Description from './alert-description.svelte';
import Title from './alert-title.svelte';

export const alertVariants = tv({
	base: 'relative w-full rounded-lg border px-4 py-3 text-sm flex items-center [&>svg]:mr-2 [&>svg]:text-foreground',
	variants: {
		variant: {
			default: 'text-foreground',
			destructive:
				'border-destructive/50 text-destructive dark:border-destructive [&>svg]:text-destructive'
		},
		level: {
			default: 'bg-background',
			"1": 'dark:bg-dark-1',
			"2": 'dark:bg-dark-2'
		}
	},
	defaultVariants: {
		variant: 'default',
		level: 'default'
	}
});

export type Variant = VariantProps<typeof alertVariants>['variant'];
export type Level = VariantProps<typeof alertVariants>['level'];
export type HeadingLevel = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';

export {
	Root,
	Description,
	Title,
	//
	Root as Alert,
	Description as AlertDescription,
	Title as AlertTitle
};
