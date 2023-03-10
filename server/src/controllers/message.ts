import { IncomingMessage, ServerResponse } from 'http';
import { MessageService, UserService } from '../services';
import { ObjectId } from 'mongoose';
import { useResponse } from '../helpers';
import { IMessage } from '../models';

export function useMessageController() {
  const service = new MessageService();
  const userService = new UserService();
  const { onServerResponse } = useResponse();

  const findMessages = async (res: ServerResponse) => {
    const messages = await service.findAll();

    onServerResponse({
      statusCode: 200,
      headers: { contentType: 'application/json' },
      data: messages,
    })(res);
  };

  const findMessagesByUser = async (
    userId: string | ObjectId,
    res: ServerResponse,
  ) => {
    const user = await userService.findById(userId);
    const messages = await service.findAllByUser(user);

    onServerResponse({
      statusCode: 200,
      headers: { contentType: 'application/json' },
      data: messages,
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
        data: err,
      })(res);
    });

    req.on('end', async () => {
      const { content, userId } = JSON.parse(requestBody);
      const user = await userService.findById(userId as string);
      const message: IMessage = {
        content,
        user,
        sentAt: new Date(),
      };
      const newMessage = await service.create(message);

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
