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
    let body = '';
    req.on('data', (chunk) => {
      body += chunk;
    });
    req.on('error', (err) => console.log(err));
    req.on('end', async () => {
      const { content, userId } = JSON.parse(body);
      const user = await userService.findById(userId as string);
      const message: IMessage = {
        content,
        user,
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
