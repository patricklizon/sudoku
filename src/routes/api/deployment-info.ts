import { type CustomResponse, json } from "@solidjs/router";
import type { APIEvent } from "@solidjs/start/server";
import { getRequestEvent } from "solid-js/web";
import type { DeploymentInfo } from "#src/lib/domain/deployment";
import type { Option } from "#src/lib/utils/types/option";

type DeploymentInfoGETResult = {
	id: Option<DeploymentInfo["id"]>;
	url: Option<DeploymentInfo["url"]>;
};

/**
 * Handles GET requests to retrieve deployment information.
 * This function extracts deployment data from the Cloudflare environment
 * available through the SolidStart request event.
 */
export function GET(_: APIEvent): CustomResponse<DeploymentInfoGETResult> {
	const event = getRequestEvent();
	const env = event?.nativeEvent.context.cloudflare.env;

	return json({
		id: env?.DEPLOYMENT_ID,
		url: env?.DEPLOY_URL,
	});
}
