import { IncomingMessage, ServerResponse } from 'http';
import { MessageService, RoomService, UserService } from '../services';
import { ObjectId } from 'mongoose';
import { useResponse } from '../helpers';

export function useMessageController() {
  const service = new MessageService();
  const userService = new UserService();
  const roomService = new RoomService();
  const { onServerResponse } = useResponse();

  const findMessages = async (res: ServerResponse) => {
    onServerResponse({
      statusCode: 200,
      headers: { contentType: 'application/json' },
      data: await service.findAll(),
    })(res);
  };

  const findMessagesByUser = async (
    userId: string | ObjectId,
    res: ServerResponse,
  ) => {
    const user = await userService.findById(userId);
    onServerResponse({
      statusCode: 200,
      headers: { contentType: 'application/json' },
      data: await service.findAllByUser(user),
    })(res);
  };

  const createMessage = (req: IncomingMessage, res: ServerResponse) => {
    let requestBody = '';

    req.on('data', (chunk) => {
      requestBody += chunk;
    });

    req.on('error', (err) => {
      onServerResponse({
        statusCode: 500,
        headers: { contentType: 'application/json' },
        data: `${err}`,
      })(res);
    });

    req.on('end', async () => {
      const requiredFields = ['userId', 'content', 'roomId'];
      const missingFields = requiredFields.filter(
        (field) => !JSON.parse(requestBody)[`${field}`],
      );
      if (missingFields.length > 0) {
        return onServerResponse({
          statusCode: 406,
          headers: { contentType: 'application/json' },
          data: '',
        })(res);
      }
      const { content, userId, roomId } = JSON.parse(requestBody);
      const newMessage = await service.create({
        content,
        user: await userService.findById(userId as string),
        sentAt: new Date(),
      });
      await roomService.patchMessage(roomId, newMessage);

      onServerResponse({
        statusCode: 201,
        headers: { contentType: 'application/json' },
        data: newMessage,
      })(res);
    });
  };

  return {
    findMessages,
    findMessagesByUser,
    createMessage,
  };
}
