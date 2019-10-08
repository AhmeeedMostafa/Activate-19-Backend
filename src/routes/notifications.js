const router = require('express').Router();
const { addNotification } = require('../queries/notifications');
const { success, error } = require('../assets/responses');
const { Expo } = require('expo-server-sdk');
const { getAll } = require('../queries/delegates');

router.post('/notify', (req, res) => {
  const { lc, body, title, data } = req.body;
  let page = 0;
  const pushTokens = [];
  const errors = [];
  let currentPageDelegates = [];

  while (currentPageDelegates.length >= 1 || page === 0) {
    page++;
    return getAll(page, 100, lc)
      .then(delegates => {
        currentPageDelegates = delegates;
        if (delegates.length >= 1)
          delegates.map(delegate => pushTokens.push(delegate.notificationToken))
      })
      .catch(err => errors.push(`Error: ${err}.`))
  }

  const expo = new Expo();
  const messages = [];

  pushTokens.map(pushToken => {
    if (!Expo.isExpoPushToken(pushToken)) {
      errors.push(`Error: Push token ${pushToken} is not a valid Expo push token`)
    } else
      messages.push({ to: pushToken, sound: 'default', title, body, data })
  });

  const chunks = expo.chunkPushNotifications(messages);
  const tickets = [];
  (async () => {
    chunks.map(async (chunk) => {
      try {
        let ticketChunk = await expo.sendPushNotificationsAsync(chunk);
        tickets.push(...ticketChunk);
      } catch (error) {
        errors.push(error);
      }
    })
  })();

  const receiptIds = [];
  tickets.map(ticket => {
    // NOTE: Not all tickets have IDs; for example, tickets for notifications
    // that could not be enqueued will have error information and no receipt ID.
    if (ticket.id) {
      receiptIds.push(ticket.id);
    }
  });

  // Checking if they received the notifications successfully
  const receiptIdChunks = expo.chunkPushNotificationReceiptIds(receiptIds);
  (async () => {
    receiptIdChunks.map(async (chunk) => {
      try {
        let receipts = await expo.getPushNotificationReceiptsAsync(chunk);

        // The receipts specify whether Apple or Google successfully received the
        // notification and information about an error, if one occurred.
        receipts.map(receipt => {
          if (receipt.status === 'error') {
            errors.push(`There was an error sending a notification: ${receipt.message}`);
            if (receipt.details && receipt.details.error) {
              errors.push(`--The error code is ${receipt.details.error}`);
            }
          }
        });
      } catch (error) {
          errors.push(error)
      }
    });

    if (errors.length <= 0) {
      addNotification({ lc, body, title, data }, req.user.name)
        .then(respone => res.status(200).json(success(respone)))
        .catch(err => res.status(400).json(error(err)));
    } else {
      return res.status(400).json(error(JSON.stringify(errors)));
    }
  })();
});

module.exports = router;
