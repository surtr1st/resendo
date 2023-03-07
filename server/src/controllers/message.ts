import url from 'url';
import querystring from 'querystring';
import { IncomingMessage, ServerResponse } from 'http';
import { MessageService, UserService } from '../services';
import { ObjectId } from 'mongoose';

const service = new MessageService();
const userService = new UserService();
export function useMessageController() {
  const findMessages = async (res: ServerResponse) => {
    const messages = await service.findAll();
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.write(JSON.stringify(messages));
    res.end();
  };

  const findMessagesByUser = async (
    userId: string | ObjectId,
    res: ServerResponse,
  ) => {
    const user = await userService.findById(userId);
    const messages = await service.findAllByUser(user);
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.write(JSON.stringify(messages));
    res.end();
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
      const message = {
        content,
        user,
      };
      const newMessage = await service.create(message);
      res.statusCode = 201;
      res.setHeader('Content-Type', 'application/json');
      res.write(JSON.stringify(newMessage));
      res.end();
    });
  };

  return {
    findMessages,
    findMessagesByUser,
    createMessage,
  };
}
