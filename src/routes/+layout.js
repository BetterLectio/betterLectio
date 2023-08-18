export const load = async ({ url: { pathname } }) => {
  return { pathname };
};
export const ssr = false;

import { PUBLIC_MIXPANEL_TOKEN } from "$env/static/public";
import mixpanel from "mixpanel-browser";

mixpanel.init(PUBLIC_MIXPANEL_TOKEN, {
  host: "api-eu.mixpanel.com",
  debug: true,
});
mixpanel.set_config({ persistence: "localStorage" });
