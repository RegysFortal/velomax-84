
import { Delivery } from '@/types/delivery';

/**
 * Generate a sequential minute number based on the current date
 */
export const generateMinuteNumber = (deliveries: Delivery[]): string => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const currentMonthDeliveries = deliveries.filter(d =>
    d.minuteNumber.includes(`/${month}/${year}`)
  );
  let nextNumber = 1;
  if (currentMonthDeliveries.length > 0) {
    const numbers = currentMonthDeliveries.map(d => {
      const parts = d.minuteNumber.split('/');
      return parseInt(parts[0], 10);
    });
    nextNumber = Math.max(...numbers) + 1;
  }
  return `${String(nextNumber).padStart(3, '0')}/${month}/${year}`;
};

/**
 * Check if a minute number already exists for a client
 */
export const checkMinuteNumberExists = (
  deliveries: Delivery[],
  minuteNumber: string,
  clientId: string
): boolean => {
  return deliveries.some(d =>
    d.minuteNumber === minuteNumber && d.clientId === clientId
  );
};
