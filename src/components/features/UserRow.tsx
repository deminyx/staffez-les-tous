"use client";

import { useState, useTransition } from "react";
import { Shield, UserCheck, UserX } from "lucide-react";

import { updateUserRoles, toggleUserActive } from "@/app/admin/actions";
import { RegeneratePasswordButton } from "@/components/features/RegeneratePasswordButton";

interface UserRoleData {
  role: string;
  eventId: string | null;
}

interface UserData {
  id: string;
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  isActive: boolean;
  roles: UserRoleData[];
}

interface EventData {
  id: string;
  title: string;
  slug: string;
}

interface UserRowProps {
  user: UserData;
  events: EventData[];
}

const ROLE_BADGE: Record<string, string> = {
  EDITEUR: "bg-green-100 text-green-700",
  COORDINATEUR: "bg-blue-100 text-blue-700",
  ADMINISTRATEUR: "bg-red-100 text-red-700",
  DEVELOPPEUR: "bg-purple-100 text-purple-700",
};

const ALL_ROLES = ["EDITEUR", "ADMINISTRATEUR", "COORDINATEUR", "DEVELOPPEUR"] as const;

export const UserRow = ({ user, events }: UserRowProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRoles, setSelectedRoles] = useState<UserRoleData[]>(user.roles);
  const [coordinatorEventId, setCoordinatorEventId] = useState<string>(
    user.roles.find((r) => r.role === "COORDINATEUR")?.eventId ?? "",
  );
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const handleToggleRole = (role: string) => {
    if (role === "COORDINATEUR") {
      // Handled separately with event selection
      const hasCoord = selectedRoles.some((r) => r.role === "COORDINATEUR");
      if (hasCoord) {
        setSelectedRoles((prev) => prev.filter((r) => r.role !== "COORDINATEUR"));
        setCoordinatorEventId("");
      } else if (coordinatorEventId) {
        setSelectedRoles((prev) => [
          ...prev,
          { role: "COORDINATEUR", eventId: coordinatorEventId },
        ]);
      }
      return;
    }

    const hasRole = selectedRoles.some((r) => r.role === role);
    if (hasRole) {
      setSelectedRoles((prev) => prev.filter((r) => r.role !== role));
    } else {
      setSelectedRoles((prev) => [...prev, { role, eventId: null }]);
    }
  };

  const handleCoordinatorEventChange = (eventId: string) => {
    setCoordinatorEventId(eventId);
    if (eventId) {
      setSelectedRoles((prev) => {
        const without = prev.filter((r) => r.role !== "COORDINATEUR");
        return [...without, { role: "COORDINATEUR", eventId }];
      });
    } else {
      setSelectedRoles((prev) => prev.filter((r) => r.role !== "COORDINATEUR"));
    }
  };

  const handleSaveRoles = () => {
    setError(null);
    const formData = new FormData();
    formData.set("userId", user.id);
    formData.set("roles", JSON.stringify(selectedRoles));

    startTransition(async () => {
      const result = await updateUserRoles(formData);
      if (!result.success) {
        setError(result.error ?? "Erreur inconnue.");
      } else {
        setIsModalOpen(false);
      }
    });
  };

  const handleToggleActive = () => {
    const formData = new FormData();
    formData.set("userId", user.id);
    formData.set("isActive", String(!user.isActive));

    startTransition(async () => {
      const result = await toggleUserActive(formData);
      if (!result.success) {
        setError(result.error ?? "Erreur inconnue.");
      }
    });
  };

  return (
    <>
      <tr className="border-b border-gray-50 hover:bg-gray-50/50">
        <td className="px-4 py-3">
          <p className="font-medium text-brand-black">
            {user.firstName} {user.lastName}
          </p>
        </td>
        <td className="px-4 py-3 text-gray-600">{user.username}</td>
        <td className="hidden px-4 py-3 text-gray-600 md:table-cell">{user.email}</td>
        <td className="px-4 py-3">
          <div className="flex flex-wrap gap-1">
            {user.roles.length > 0 ? (
              user.roles.map((r, i) => (
                <span
                  key={`${r.role}-${r.eventId ?? i}`}
                  className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${ROLE_BADGE[r.role] ?? "bg-gray-100 text-gray-600"}`}
                >
                  {r.role === "COORDINATEUR" && r.eventId
                    ? `Coord.`
                    : r.role.charAt(0) + r.role.slice(1).toLowerCase()}
                </span>
              ))
            ) : (
              <span className="text-xs text-gray-400">Adherent</span>
            )}
          </div>
        </td>
        <td className="px-4 py-3">
          <span
            className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${
              user.isActive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
            }`}
          >
            {user.isActive ? "Actif" : "Inactif"}
          </span>
        </td>
        <td className="px-4 py-3 text-right">
          <div className="flex items-center justify-end gap-1">
            <RegeneratePasswordButton
              userId={user.id}
              userName={`${user.firstName} ${user.lastName}`}
            />
            <button
              onClick={() => setIsModalOpen(true)}
              className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-brand-black"
              aria-label={`Modifier les roles de ${user.firstName} ${user.lastName}`}
            >
              <Shield className="h-4 w-4" />
            </button>
            <button
              onClick={handleToggleActive}
              disabled={isPending}
              className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-brand-black disabled:opacity-50"
              aria-label={
                user.isActive
                  ? `Desactiver ${user.firstName} ${user.lastName}`
                  : `Activer ${user.firstName} ${user.lastName}`
              }
            >
              {user.isActive ? <UserX className="h-4 w-4" /> : <UserCheck className="h-4 w-4" />}
            </button>
          </div>
        </td>
      </tr>

      {/* Role modal */}
      {isModalOpen && (
        <tr>
          <td colSpan={6} className="p-0">
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
              <div
                role="dialog"
                aria-modal="true"
                aria-label={`Modifier les roles de ${user.firstName} ${user.lastName}`}
                className="mx-4 w-full max-w-md rounded-xl bg-white p-6 shadow-2xl"
              >
                <h3 className="font-display text-lg font-bold text-brand-black">
                  Roles de {user.firstName} {user.lastName}
                </h3>

                {error && <p className="mt-2 text-sm text-red-600">{error}</p>}

                <div className="mt-4 space-y-3">
                  {ALL_ROLES.map((role) => (
                    <div key={role}>
                      <label className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          checked={selectedRoles.some((r) => r.role === role)}
                          onChange={() => handleToggleRole(role)}
                          className="h-4 w-4 rounded border-gray-300 text-brand-red focus:ring-brand-red"
                        />
                        <span
                          className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${ROLE_BADGE[role]}`}
                        >
                          {role.charAt(0) + role.slice(1).toLowerCase()}
                        </span>
                      </label>

                      {role === "COORDINATEUR" &&
                        selectedRoles.some((r) => r.role === "COORDINATEUR") && (
                          <select
                            value={coordinatorEventId}
                            onChange={(e) => handleCoordinatorEventChange(e.target.value)}
                            className="ml-7 mt-2 w-full rounded-lg border border-gray-200 px-3 py-1.5 text-sm focus:border-brand-red focus:outline-none focus:ring-1 focus:ring-brand-red"
                          >
                            <option value="">Selectionner un evenement</option>
                            {events.map((ev) => (
                              <option key={ev.id} value={ev.id}>
                                {ev.title}
                              </option>
                            ))}
                          </select>
                        )}
                    </div>
                  ))}
                </div>

                <div className="mt-6 flex justify-end gap-3">
                  <button
                    onClick={() => {
                      setIsModalOpen(false);
                      setSelectedRoles(user.roles);
                      setError(null);
                    }}
                    className="btn-secondary"
                  >
                    Annuler
                  </button>
                  <button onClick={handleSaveRoles} disabled={isPending} className="btn-primary">
                    {isPending ? "Enregistrement..." : "Enregistrer"}
                  </button>
                </div>
              </div>
            </div>
          </td>
        </tr>
      )}
    </>
  );
};
