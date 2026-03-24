import { budgetRepository } from "@/server/repositories/budget.repository";
import { AppError } from "@/lib/errors";

export const budgetService = {
  /**
   * Create a budget request and generate WhatsApp links for all matching professionals.
   * Returns the created request + list of professionals to notify via WhatsApp.
   */
  async createRequest(data: {
    categoryId: string;
    clientName: string;
    clientPhone: string;
    clientEmail?: string;
    description: string;
    city?: string;
  }) {
    // Create the budget request
    const request = await budgetRepository.create(data);

    // Find all professionals in that category with WhatsApp
    const professionals = await budgetRepository.getProfessionalsForCategory(data.categoryId);

    if (professionals.length === 0) {
      throw AppError.notFound("No hay profesionales disponibles en esta categoría");
    }

    // Build WhatsApp message for each professional
    const waMessage = encodeURIComponent(
      `🔨 *Nuevo pedido de presupuesto en OficiosGo!*\n\n` +
      `📋 *Categoría:* ${request.category.name}\n` +
      `👤 *Cliente:* ${data.clientName}\n` +
      `📱 *Teléfono:* ${data.clientPhone}\n` +
      `📝 *Descripción:*\n${data.description}\n\n` +
      `Respondé a este mensaje o contactá al cliente directamente.`
    );

    const notifications = professionals.map((pro) => ({
      profileId: pro.id,
      name: pro.user.name,
      whatsapp: pro.whatsapp!,
      waLink: `https://wa.me/54${pro.whatsapp}?text=${waMessage}`,
    }));

    // Update notified count
    await budgetRepository.updateNotifiedCount(request.id, professionals.length);

    return {
      request,
      notifications,
      totalNotified: professionals.length,
    };
  },

  async getForProfessional(categoryId: string, page = 1) {
    return budgetRepository.getForProfessional(categoryId, page);
  },
};