export const PAYMENT_STATUS = [
	'pending',
	'paid',
	'failed',
	'cancelled',
] as const;

export const ORDER_STATUS = [
	'confirmed',
	'pending',
	'processing',
	'cancelled',
	'delivered',
] as const;
