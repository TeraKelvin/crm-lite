"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface Contact {
  id: string;
  name: string;
  title: string | null;
  email: string | null;
  phone: string | null;
  role: string;
  notes: string | null;
  isPrimary: boolean;
}

interface ContactListProps {
  contacts: Contact[];
  dealId: string;
}

const roleLabels: Record<string, { label: string; color: string }> = {
  CHAMPION: { label: "Champion", color: "bg-green-100 text-green-700" },
  ECONOMIC_BUYER: { label: "Economic Buyer", color: "bg-purple-100 text-purple-700" },
  TECHNICAL_BUYER: { label: "Technical Buyer", color: "bg-blue-100 text-blue-700" },
  INFLUENCER: { label: "Influencer", color: "bg-gray-100 text-gray-700" },
  BLOCKER: { label: "Blocker", color: "bg-red-100 text-red-700" },
};

export default function ContactList({ contacts, dealId }: ContactListProps) {
  const router = useRouter();
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    title: "",
    email: "",
    phone: "",
    role: "INFLUENCER",
    notes: "",
    isPrimary: false,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(`/api/deals/${dealId}/contacts`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setFormData({
          name: "",
          title: "",
          email: "",
          phone: "",
          role: "INFLUENCER",
          notes: "",
          isPrimary: false,
        });
        setShowForm(false);
        router.refresh();
      }
    } catch (error) {
      console.error("Error adding contact:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (contactId: string) => {
    if (!confirm("Remove this contact?")) return;

    try {
      await fetch(`/api/contacts/${contactId}`, { method: "DELETE" });
      router.refresh();
    } catch (error) {
      console.error("Error deleting contact:", error);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-900">
          Stakeholders ({contacts.length})
        </h3>
        <button
          onClick={() => setShowForm(!showForm)}
          className="text-sm text-blue-600 hover:text-blue-700 font-medium"
        >
          {showForm ? "Cancel" : "+ Add Contact"}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="mb-4 p-4 bg-gray-50 rounded-lg space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Name *
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                placeholder="John Smith"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Title
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                placeholder="VP of Engineering"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                placeholder="john@company.com"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Phone
              </label>
              <input
                type="text"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                placeholder="+1 555-123-4567"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Role
            </label>
            <select
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
            >
              <option value="CHAMPION">Champion</option>
              <option value="ECONOMIC_BUYER">Economic Buyer</option>
              <option value="TECHNICAL_BUYER">Technical Buyer</option>
              <option value="INFLUENCER">Influencer</option>
              <option value="BLOCKER">Blocker</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Notes
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
              rows={2}
              placeholder="Key info about this contact..."
            />
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="isPrimary"
              checked={formData.isPrimary}
              onChange={(e) => setFormData({ ...formData, isPrimary: e.target.checked })}
              className="rounded border-gray-300"
            />
            <label htmlFor="isPrimary" className="text-sm text-gray-700">
              Primary contact
            </label>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? "Adding..." : "Add Contact"}
          </button>
        </form>
      )}

      {contacts.length === 0 ? (
        <p className="text-sm text-gray-500 text-center py-4">
          No stakeholders added yet.
        </p>
      ) : (
        <div className="space-y-3">
          {contacts.map((contact) => {
            const roleInfo = roleLabels[contact.role] || roleLabels.INFLUENCER;
            return (
              <div
                key={contact.id}
                className={`p-3 rounded-lg border ${
                  contact.isPrimary ? "border-blue-300 bg-blue-50" : "border-gray-200"
                }`}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-gray-900">{contact.name}</span>
                      {contact.isPrimary && (
                        <span className="text-xs bg-blue-600 text-white px-2 py-0.5 rounded">
                          Primary
                        </span>
                      )}
                      <span className={`text-xs px-2 py-0.5 rounded ${roleInfo.color}`}>
                        {roleInfo.label}
                      </span>
                    </div>
                    {contact.title && (
                      <p className="text-sm text-gray-600">{contact.title}</p>
                    )}
                    <div className="flex gap-4 mt-1 text-sm text-gray-500">
                      {contact.email && <span>{contact.email}</span>}
                      {contact.phone && <span>{contact.phone}</span>}
                    </div>
                    {contact.notes && (
                      <p className="text-sm text-gray-600 mt-2 italic">{contact.notes}</p>
                    )}
                  </div>
                  <button
                    onClick={() => handleDelete(contact.id)}
                    className="text-gray-400 hover:text-red-500"
                  >
                    ×
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
