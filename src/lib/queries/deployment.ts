import { query } from "@solidjs/router";
import { getRequestEvent } from "solid-js/web";
import type { DeploymentInfo } from "#src/lib/domain/deployment";
import { isNil } from "#src/lib/utils/is-nil";
import type { Option } from "#src/lib/utils/types/option";

type DeploymentInfoQueryResult = {
	id: Option<DeploymentInfo["id"]>;
	url: Option<DeploymentInfo["url"]>;
};

/**
 * Handles GET requests to retrieve deployment information.
 * This function extracts deployment data from the Cloudflare environment
 * available through the SolidStart request event.
 */
export const getDeploymentInfoQuery = query(() => {
	"use server";

	const event = getRequestEvent();
	if (isNil(event)) throw new Error("No request context");

	const env = event.nativeEvent.context.cloudflare.env;
	const result: DeploymentInfoQueryResult = {
		id: env.DEPLOYMENT_ID,
		url: env.DEPLOY_URL,
	};

	return result;
}, "deployment-info");
