import { Request, Response, Router } from 'express';
import { IGroup, IUser } from '../models';
import {
  ADD_MEMBERS,
  CREATE_GROUP,
  GROUPS_BY_USER_ID,
  GROUP_BY_ID,
  GROUP_MEMBERS,
  IS_GROUP_OWNER,
  OUTSIDE_GROUP_USERS,
  REMOVE_MEMBERS,
} from '../routes';
import { GroupService, MessageService, UserService } from '../services';

export function GroupController() {
  const router = Router();
  const service = new GroupService();
  const userService = new UserService();
  const messageService = new MessageService();

  router.get(GROUPS_BY_USER_ID, async (req: Request, res: Response) => {
    try {
      const { userId } = req.query;
      const group = await service.findAllByOwner(userId as string);

      if (group.length === 0) {
        res
          .status(200)
          .json(await service.findGroupsByMember(userId as string));
        return;
      }
      res.status(200).json(group);
    } catch (e) {
      res.status(500).json({ message: `${e}` });
    }
  });

  router.get(GROUP_BY_ID, async (req: Request, res: Response) => {
    try {
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
    } catch (e) {
      res.status(500).json({ message: `${e}` });
    }
  });

  router.post(IS_GROUP_OWNER, async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const { userId } = req.body;
      const group = await service.findById(id);
      if (!group) return res.status(400).json({ message: 'Not found' });
      const isOwner = group.owner._id.toString() === userId;
      res.status(200).json(isOwner);
    } catch (e) {
      res.status(500).json({ message: `${e}` });
    }
  });

  router.post(OUTSIDE_GROUP_USERS, async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const { userIds } = req.body;
      const group = await service.findById(id as string);
      if (!group) return res.status(400).json({ message: 'Not found' });
      const outsideUsers: IUser[] = [];
      for (const userId of userIds) {
        if (group.owner._id.toString() === userId) continue;
        else if (!group.users.includes(userId))
          outsideUsers.push(await userService.findById(userId));
      }
      res.status(200).json(outsideUsers);
    } catch (e) {
      res.status(500).json({ message: `${e}` });
    }
  });

  router.get(GROUP_MEMBERS, async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const group = await service.findById(id as string);
      if (group) {
        const members = [];
        for (const user of group.users) {
          const detailUser = await userService.findById(user._id);
          members.push(detailUser);
        }
        res.status(200).json(members);
        return;
      }
      res.status(400).json({ message: 'Not found' });
    } catch (e) {
      res.status(500).json({ message: `${e}` });
    }
  });

  router.post(CREATE_GROUP, async (req: Request, res: Response) => {
    try {
      const { title, owner, users } = req.body;
      const group: Partial<IGroup> = {
        title,
        owner,
        users: users.length > 0 ? [...users, owner] : [owner],
        lastMessage: {
          sender: '',
          content: '',
        },
      };
      const newGroup = service.create(group);
      res.status(201).json(newGroup);
    } catch (e) {
      res.status(500).json({ message: `${e}` });
    }
  });

  router.patch(ADD_MEMBERS, async (req: Request, res: Response) => {
    try {
      const { groupId, users } = req.body;
      if ((users as string[]).length === 1)
        await service.addMember(groupId, users[0]);
      else await service.addMembers(groupId, users);
      res.status(200).send();
    } catch (e) {
      res.status(500).json({ message: `${e}` });
    }
  });

  router.delete(REMOVE_MEMBERS, async (req: Request, res: Response) => {
    try {
      const { groupId, userId } = req.body;
      await service.removeMember(groupId, userId);
      res.status(200).send();
    } catch (e) {
      res.status(500).json({ message: `${e}` });
    }
  });

  router.delete(GROUP_BY_ID, async (req: Request, res: Response) => {
    try {
      const { id } = req.query;
      await service.remove(id as string);
      res.status(200).send();
    } catch (e) {
      res.status(500).json({ message: `${e}` });
    }
  });

  return router;
}
