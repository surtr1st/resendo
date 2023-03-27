import { Request, Response, Router } from 'express';
import { IGroup } from '../models';
import {
  ADD_MEMBERS,
  CREATE_GROUP,
  GROUPS_BY_USER_ID,
  GROUP_BY_ID,
  REMOVE_MEMBERS,
} from '../routes';
import { GroupService, MessageService, UserService } from '../services';

export function GroupController() {
  const router = Router();
  const service = new GroupService();
  const userService = new UserService();
  const messageService = new MessageService();

  router.get(GROUPS_BY_USER_ID, async (req: Request, res: Response) => {
    const { userId } = req.query;
    const group = await service.findAllByOwner(userId as string);
    if (group.length === 0) {
      res.status(200).json(await service.findGroupsByMember(userId as string));
      return;
    }
    res.status(200).json(group);
  });

  router.get(GROUP_BY_ID, async (req: Request, res: Response) => {
    const { id } = req.query;
    const group = await service.findById(id as string);
    const { title, owner, users, messages } = group!;

    const usersInRoom = [];
    for (const user of users) {
      const detailUser = await userService.findByIdExcludePassword(user._id);
      usersInRoom.push(detailUser);
    }

    const messagesInRoom = [];
    // Response only 12 messages for each request
    const limitedMessages =
      messages.length > 12
        ? messages.slice(messages.length - 12, messages.length)
        : messages;
    for (const message of limitedMessages) {
      const detailMessage = await messageService.findById(message._id);
      messagesInRoom.push(detailMessage);
    }
    const result = {
      _id: id,
      title,
      owner: await userService.findByIdExcludePassword(owner._id),
      users: usersInRoom,
      messages: messagesInRoom,
    };
    res.status(200).json(result);
  });

  router.post(CREATE_GROUP, async (req: Request, res: Response) => {
    const { title, owner, users } = req.body;
    const group: Partial<IGroup> = {
      title,
      owner,
      users: users.length > 0 ? [...users, owner] : [owner],
    };
    const newGroup = service.create(group);
    res.status(201).json(newGroup);
  });

  router.patch(ADD_MEMBERS, async (req: Request, res: Response) => {
    const { id } = req.query;
    const { users } = req.body;
    if ((users as string[]).length === 1)
      await service.addMember(id as string, users[0]);
    else await service.addMembers(id as string, users);
    res.status(200).send();
  });

  router.patch(REMOVE_MEMBERS, async (req: Request, res: Response) => {
    const { id } = req.query;
    const { userId } = req.body;
    await service.removeMember(id as string, userId);
    res.status(200).send();
  });

  router.delete(GROUP_BY_ID, async (req: Request, res: Response) => {
    const { id } = req.query;
    await service.remove(id as string);
    res.status(200).send();
  });

  return router;
}
