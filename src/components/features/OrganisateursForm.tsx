"use client";

import { useFormState, useFormStatus } from "react-dom";
import { submitOrganisateur } from "@/app/(public)/actions";
import type { ContactActionState } from "@/app/(public)/actions";

const initialState: ContactActionState = { success: false };

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="btn-primary w-full py-3 text-base disabled:opacity-60"
    >
      {pending ? "Envoi en cours..." : "Envoyer la demande"}
    </button>
  );
}

export function OrganisateursForm() {
  const [state, formAction] = useFormState(submitOrganisateur, initialState);

  if (state.success) {
    return (
      <div className="rounded-xl border border-green-200 bg-green-50 p-8 text-center">
        <div className="mb-3 flex justify-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
            <svg
              className="h-6 w-6 text-green-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
        </div>
        <h3 className="text-lg font-bold text-green-800">Demande envoyee !</h3>
        <p className="mt-2 text-sm text-green-700">
          Merci pour votre interet. Nous reviendrons vers vous sous 48h pour discuter de votre
          projet.
        </p>
      </div>
    );
  }

  return (
    <form
      action={formAction}
      className="space-y-6 rounded-xl border border-gray-200 bg-white p-6 shadow-md md:p-8"
    >
      {state.error && (
        <div
          role="alert"
          className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
        >
          {state.error}
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="orgName" className="mb-1 block text-sm font-medium text-gray-700">
            Nom de l&apos;organisation *
          </label>
          <input
            type="text"
            id="orgName"
            name="orgName"
            required
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm transition-shadow focus:outline-none focus:ring-2 focus:ring-brand-red focus:ring-offset-1"
            placeholder="Votre structure"
          />
        </div>
        <div>
          <label htmlFor="eventName" className="mb-1 block text-sm font-medium text-gray-700">
            Nom de l&apos;evenement *
          </label>
          <input
            type="text"
            id="eventName"
            name="eventName"
            required
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm transition-shadow focus:outline-none focus:ring-2 focus:ring-brand-red focus:ring-offset-1"
            placeholder="Nom de votre evenement"
          />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="orgFirstName" className="mb-1 block text-sm font-medium text-gray-700">
            Prenom du contact *
          </label>
          <input
            type="text"
            id="orgFirstName"
            name="firstName"
            required
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm transition-shadow focus:outline-none focus:ring-2 focus:ring-brand-red focus:ring-offset-1"
            placeholder="Votre prenom"
          />
        </div>
        <div>
          <label htmlFor="orgLastName" className="mb-1 block text-sm font-medium text-gray-700">
            Nom du contact *
          </label>
          <input
            type="text"
            id="orgLastName"
            name="lastName"
            required
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm transition-shadow focus:outline-none focus:ring-2 focus:ring-brand-red focus:ring-offset-1"
            placeholder="Votre nom"
          />
        </div>
      </div>

      <div>
        <label htmlFor="orgEmail" className="mb-1 block text-sm font-medium text-gray-700">
          Adresse e-mail *
        </label>
        <input
          type="email"
          id="orgEmail"
          name="email"
          required
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm transition-shadow focus:outline-none focus:ring-2 focus:ring-brand-red focus:ring-offset-1"
          placeholder="contact@votre-evenement.com"
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="orgPhone" className="mb-1 block text-sm font-medium text-gray-700">
            Telephone
          </label>
          <input
            type="tel"
            id="orgPhone"
            name="phone"
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm transition-shadow focus:outline-none focus:ring-2 focus:ring-brand-red focus:ring-offset-1"
            placeholder="06 12 34 56 78"
          />
        </div>
        <div>
          <label htmlFor="eventDates" className="mb-1 block text-sm font-medium text-gray-700">
            Dates de l&apos;evenement
          </label>
          <input
            type="text"
            id="eventDates"
            name="eventDates"
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm transition-shadow focus:outline-none focus:ring-2 focus:ring-brand-red focus:ring-offset-1"
            placeholder="Ex : 15-17 novembre 2025"
          />
        </div>
      </div>

      <div>
        <label htmlFor="orgMessage" className="mb-1 block text-sm font-medium text-gray-700">
          Description de votre besoin *
        </label>
        <textarea
          id="orgMessage"
          name="message"
          required
          rows={5}
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm transition-shadow focus:outline-none focus:ring-2 focus:ring-brand-red focus:ring-offset-1"
          placeholder="Decrivez votre evenement, le nombre de benevoles souhaites, les missions envisagees..."
        />
      </div>

      <p className="text-xs text-gray-500">
        * Champs obligatoires. Vos donnees sont utilisees uniquement pour traiter votre demande de
        partenariat.
      </p>

      <SubmitButton />
    </form>
  );
}
