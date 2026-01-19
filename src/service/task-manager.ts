import { uuidv4 } from "@/utils/uuid";

type TaskEntity = {
	id: string;
	abort: () => void;
};

const taskMap = new Map();

export const addTask = (task: () => Promise<unknown>) => {
	const id = uuidv4();
	const controller = new AbortController();
	const abort = () => {
		taskMap.delete(id);
		controller.abort();
	};
	taskMap.set(id, { id, abort });
	task();
	return id;
};

export const ready = () => {};

export const abortTask = (id: string) => {
	const task = taskMap.get(id);
	if (task) {
		task.abort();
	}
};
