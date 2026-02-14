// mock/notifications.mock.ts
import { ApiNotificationsResponse } from '@/shared/types/notification.types';

export const mockNotificationsResponse: ApiNotificationsResponse = {
  status: 'success',
  data: {
    notifications: [
      {
        id: '3',
        type: 'report',
        action: 'Report Alert:',
        reportDetails: {
          message:
            'Your video “Beach Vlog in Bali” has been reported by users. Our team is reviewing the content. You’ll be notified if any action is required.',
          reportsReceived: 3,
        },
        title: 'Beach Vlog in Bali',
        timeAgo: '1 day ago',
      },
      {
        id: '3',
        type: 'report',
        action: 'Report Alert:',
        reportDetails: {
          message:
            'Your video “Beach Vlog in Bali” has been reported by users. Our team is reviewing the content. You’ll be notified if any action is required.',
          reportsReceived: 3,
        },
        title: 'Beach Vlog in Bali',
        timeAgo: '1 day ago',
      },
      {
        id: '3',
        type: 'report',
        action: 'Report Alert:',
        reportDetails: {
          message:
            'Your video “Beach Vlog in Bali” has been reported by users. Our team is reviewing the content. You’ll be notified if any action is required.',
          reportsReceived: 3,
        },
        title: 'Beach Vlog in Bali',
        timeAgo: '1 day ago',
      },
    ],
  },
};
