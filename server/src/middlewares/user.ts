import { ServerResponse } from 'http';
import { ObjectId } from 'mongoose';
import { useResponse } from '../helpers';
import { UserService } from '../services';

const { onServerResponse } = useResponse();
const userService = new UserService();

export const validateUser = (
  userId: string | ObjectId,
  res: ServerResponse,
  next: () => void | Promise<void>,
) => {
  try {
    userService
      .findById(userId)
      .then(() => next())
      .catch((err) =>
        onServerResponse({
          statusCode: 400,
          headers: { contentType: 'application/json' },
          data: `${err}`,
        })(res),
      );
  } catch (e) {
    return onServerResponse({
      statusCode: 500,
      headers: { contentType: 'application/json' },
      data: 'Unknown error has occur',
    })(res);
  }
};
