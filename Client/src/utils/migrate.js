import { api } from "./api";

/**
 * Migrate legacy LocalStorage boards into the API.
 * Call this once after logging in, from the browser console.
 */
export const migrateLocalStorage = async () => {
  const raw = localStorage.getItem("vellum_state_v1");
  if (!raw) return { migrated: 0, message: "No legacy data found" };

  let parsed;
  try {
    parsed = JSON.parse(raw);
  } catch {
    return { migrated: 0, message: "Corrupt legacy data" };
  }

  const boards = parsed.boards || [];
  let migrated = 0;

  for (const legacyBoard of boards) {
    try {
      // 1. Create the board (this auto-creates To Do/In Progress/Done)
      const { board: newBoard } = await api.createBoard({
        title: legacyBoard.title,
      });

      // 2. Delete the auto-created lists (we'll recreate from legacy)
      for (const l of newBoard.lists) {
        await api.deleteList(l.id);
      }

      // 3. Recreate the legacy lists in order
      for (const legacyList of legacyBoard.lists) {
        const { list: newList } = await api.createList(newBoard.id, {
          title: legacyList.title,
        });

        // 4. Recreate the cards
        for (const card of legacyList.cards) {
          await api.createCard(newList.id, {
            title: card.title,
            description: card.description || "",
            priority: card.priority || "medium",
            dueDate: card.dueDate || undefined,
            labels: card.labels || [],
            assignee: card.assignee || "",
          });
        }
      }

      migrated++;
    } catch (err) {
      console.error("Migration error for board:", legacyBoard.title, err);
    }
  }

  return { migrated, message: `Migrated ${migrated} of ${boards.length} boards` };
};