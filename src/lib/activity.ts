import { db } from "./firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

/**
 * Log an admin/system activity event to Firestore.
 */
interface LogActivityParams {
  type?: string;        // e.g. 'Story', 'Game', 'Parent', 'Admin', 'Child'
  activity: string;     // Human-readable description
  role?: string;        // 'Admin' | 'Parent' | 'System'
  targetName?: string;   // Name of the affected entity
  changes?: string[];   // Specific field changes
}

export const logActivity = async ({
  type = "Admin",
  activity,
  role = "Admin",
  targetName = "",
  changes = [],
}: LogActivityParams) => {
  if (!activity) return;
  try {
    await addDoc(collection(db, "activity_logs"), {
      type,
      activity,
      role,
      targetName,
      changes,
      timestamp: serverTimestamp(),
      displayTime: new Date().toLocaleString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }),
    });
  } catch (err) {
    console.warn("logActivity failed:", err);
  }
};
