import { students, commsLog } from "@/mocks/data";
import type { AttendanceStatus } from "@/types/types";
const wait = (ms = 150) => new Promise((r) => setTimeout(r, ms));
export const fetchStudents = async () => (await wait(), students);
export const fetchComms = async () => (await wait(), commsLog);
export const saveStatus = async (_id: string, _s: AttendanceStatus) => { await wait(); };
export const sendHomework = async (_d: unknown) => { await wait(300); };
