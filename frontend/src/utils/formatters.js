import { format, formatDistanceToNow } from 'date-fns';

export const formatDate = (dateString) => {
  if (!dateString) return '';
  return format(new Date(dateString), 'dd MMM yyyy');
};

export const formatDateTime = (dateString) => {
  if (!dateString) return '';
  return format(new Date(dateString), 'dd MMM yyyy, h:mm a');
};

export const formatTime = (dateString) => {
  if (!dateString) return '';
  return format(new Date(dateString), 'h:mm a');
};

export const formatCurrency = (amount) => {
  return `৳ ${Number(amount).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};

export const formatNumber = (num) => {
  return Number(num).toLocaleString('en-IN');
};

export const getRelativeTime = (dateString) => {
  if (!dateString) return '';
  return formatDistanceToNow(new Date(dateString), { addSuffix: true });
};
