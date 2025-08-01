import type { Opaque } from "./opaque";
import type { AnyRecord } from "./record";

export type WorkerRequestId = Opaque<"worker-request-id", string>;

export type WorkerRequest<Type extends string, Payload extends AnyRecord> = {
	type: Type;
	payload: Payload;
	requestId: WorkerRequestId;
};

export type WorkerResponse<Payload extends AnyRecord> = {
	payload: Payload;
	requestId: WorkerRequestId;
};
