import { getRequestEvent } from "solid-js/web";
import type { DeploymentInfo } from "#lib/domain/deployment/types";

export class DeploymentRepository {
	/**
	 * Fetches the deployment information from the specified base URL.
	 */
	async getDeploymentInfo(): Promise<DeploymentInfo> {
		const event = getRequestEvent();
		if (!event) throw new Error("No request context available");

		const url = new URL("/api/deployment-info", event.request.url);
		const response = await fetch(url);
		if (!response.ok) {
			throw new Error(`Failed to fetch deployment info: ${response.statusText}`);
		}
		return response.json() as unknown as Promise<DeploymentInfo>;
	}
}
