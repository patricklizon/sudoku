import { query } from "@solidjs/router";
import { getRequestEvent } from "solid-js/web";
import { DeploymentRepository } from "#src/lib/infrastructure/repositories/deployment.repository";
import { isNil } from "#src/lib/utils/is-nil";

const repo = new DeploymentRepository();

export const getDeploymentInfoQuery = query(async () => {
	"use server";

	const event = getRequestEvent();
	if (isNil(event?.request.url)) throw new Error("No request context");

	// const baseUrl = new URL(event.request.url).origin;
	return await repo.getDeploymentInfo();
}, "deployment-info");
