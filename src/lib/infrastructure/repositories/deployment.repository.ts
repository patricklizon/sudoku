import type { DeploymentInfo } from "#src/lib/domain/deployment";

export class DeploymentRepository {
	/**
	 * Fetches the deployment information from the specified base URL.
	 */
	async getDeploymentInfo(): Promise<DeploymentInfo> {
		const response = await fetch("/api/deployment-info");
		if (!response.ok) {
			throw new Error(`Failed to fetch deployment info: ${response.statusText}`);
		}
		return response.json() as unknown as Promise<DeploymentInfo>;
	}
}
