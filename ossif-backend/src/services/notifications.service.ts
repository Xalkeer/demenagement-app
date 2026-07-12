import { Resend } from 'resend';

const resend = new Resend(process.env.API_RESEND_KEY);

export const sendEmail = async (to: string, subject: string, text: string, html?: string) => {
  try {
    const toEmails = to || process.env.SMTP_TO_EMAILS || process.env.SMTP_EMAIL;
    
    // Resend accepte un tableau d'adresses. On gère le cas où l'utilisateur a mis des virgules dans le .env
    const toArray = typeof toEmails === 'string' ? toEmails.split(',').map(e => e.trim()) : toEmails;

    const { data, error } = await resend.emails.send({
      // ⚠️ IMPORTANT : Tant que vous n'avez pas de domaine vérifié sur Resend,
      // vous DEVEZ utiliser 'onboarding@resend.dev' en expéditeur.
      from: 'Achats App <onboarding@resend.dev>',
      to: toArray as string[],
      subject,
      text,
      html: html || text.replace(/\n/g, '<br>'), // Optionnel : convertit les sauts de ligne texte en HTML si aucun HTML n'est fourni
    });

    if (error) {
      console.error('[EMAIL ERROR] Erreur lors de l\'envoi via Resend:', error);
      throw error;
    }

    console.log('[EMAIL SUCCESS] Email envoyé avec succès via Resend, ID:', data?.id);
    return data;
  } catch (error) {
    console.error('[EMAIL EXCEPTION] Exception inattendue lors de l\'envoi via Resend:', error);
    throw error;
  }
};
