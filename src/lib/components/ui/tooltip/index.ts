import { Tooltip as TooltipPrimitive } from 'bits-ui';
import TextTooltip from './text-tooltip.svelte';
import Content from './tooltip-content.svelte';

const Root = TooltipPrimitive.Root;
const Trigger = TooltipPrimitive.Trigger;

export {
	Content, Root, TextTooltip,
	//
	Root as Tooltip,
	Content as TooltipContent,
	Trigger as TooltipTrigger, Trigger
};

