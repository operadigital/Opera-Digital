export const DEFAULT_WHATSAPP_NUMBER = '5551992379969';

export function getStoredWhatsAppNumber(): string {
  try {
    const saved = localStorage.getItem('opera_whatsapp_number');
    if (saved) {
      const digits = saved.replace(/\D/g, '');
      if (digits.length >= 10) return digits;
    }
  } catch (e) {
    console.error(e);
  }
  return DEFAULT_WHATSAPP_NUMBER;
}

export function saveWhatsAppNumber(phone: string): string {
  const digits = phone.replace(/\D/g, '');
  const toSave = digits.length >= 10 ? digits : DEFAULT_WHATSAPP_NUMBER;
  try {
    localStorage.setItem('opera_whatsapp_number', toSave);
    fetch('/api/settings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ whatsappNumber: toSave })
    }).catch(() => {});
  } catch (e) {
    console.error(e);
  }
  return toSave;
}

export function formatWhatsAppDisplay(phone: string): string {
  const digits = phone.replace(/\D/g, '');
  if (!digits) return '+55 (51) 99237-9969';
  if (digits.length === 13) {
    return `+${digits.slice(0, 2)} (${digits.slice(2, 4)}) ${digits.slice(4, 9)}-${digits.slice(9)}`;
  }
  if (digits.length === 11) {
    return `+55 (${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
  }
  if (digits.length === 10) {
    return `+55 (${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
  }
  return phone.startsWith('+') ? phone : `+${phone}`;
}
