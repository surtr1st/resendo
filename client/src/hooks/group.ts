import { BASE_URL } from '.';
import {
  AccessToken,
  Group,
  GroupResponse,
  InsensitiveResponseUserInfo,
} from '../types';

export function useGroup() {
  const getGroupsByUser = async (userId: string, accessToken: AccessToken) => {
    const options: RequestInit = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      credentials: 'include',
    };
    const data = await fetch(`${BASE_URL}/groups?userId=${userId}`, options);
    return await data.json();
  };

  const getGroupById = async (
    groupId: string,
    accessToken: AccessToken,
  ): Promise<GroupResponse> => {
    const options: RequestInit = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      credentials: 'include',
    };
    const data = await fetch(`${BASE_URL}/group?id=${groupId}`, options);
    return await data.json();
  };

  const getMembersWithinGroup = async (
    groupId: string,
    accessToken: AccessToken,
  ): Promise<InsensitiveResponseUserInfo[]> => {
    const options: RequestInit = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      credentials: 'include',
    };
    const data = await fetch(`${BASE_URL}/group/${groupId}/members`, options);
    return await data.json();
  };

  const isGroupOwner = async (
    groupId: string,
    userId: string,
    accessToken: AccessToken,
  ): Promise<boolean> => {
    const options: RequestInit = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      credentials: 'include',
      body: JSON.stringify({ userId }),
    };
    const data = await fetch(`${BASE_URL}/group/${groupId}/owner`, options);
    return await data.json();
  };

  const getOutsideGroupUsers = async (
    groupId: string,
    userIds: string[],
  ): Promise<InsensitiveResponseUserInfo[]> => {
    const options: RequestInit = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({ userIds }),
    };
    const data = await fetch(`${BASE_URL}/group/${groupId}/outside`, options);
    return await data.json();
  };

  const getLatestMessageWithinGroup = async (
    groupId: string,
    userId: string,
    accessToken: AccessToken,
  ) => {
    const options: RequestInit = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      credentials: 'include',
      body: JSON.stringify({ userId }),
    };
    const data = await fetch(`${BASE_URL}/group/latest?id=${groupId}`, options);
    return await data.json();
  };

  const createGroup = async (group: Group, accessToken: AccessToken) => {
    const options: RequestInit = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      credentials: 'include',
      body: JSON.stringify(group),
    };
    return await fetch(`${BASE_URL}/group`, options);
  };

  const addMembers = async (
    groupId: string,
    users: string[],
    accessToken: AccessToken,
  ) => {
    const options: RequestInit = {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      credentials: 'include',
      body: JSON.stringify({ groupId, users }),
    };
    return await fetch(`${BASE_URL}/group/member/add`, options);
  };

  const removeMember = async (
    groupId: string,
    userId: string,
    accessToken: AccessToken,
  ) => {
    const options: RequestInit = {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      credentials: 'include',
      body: JSON.stringify({ groupId, userId }),
    };
    return await fetch(`${BASE_URL}/group/member/remove`, options);
  };

  const deleteGroup = async (groupId: string, accessToken: AccessToken) => {
    const options: RequestInit = {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      credentials: 'include',
    };
    return await fetch(`${BASE_URL}/group?id=${groupId}`, options);
  };

  return {
    getGroupsByUser,
    getGroupById,
    getMembersWithinGroup,
    isGroupOwner,
    getLatestMessageWithinGroup,
    createGroup,
    addMembers,
    removeMember,
    getOutsideGroupUsers,
    deleteGroup,
  };
}
