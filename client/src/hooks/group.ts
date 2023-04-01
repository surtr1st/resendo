import { BASE_URL } from '.';
import { AccessToken, Group, GroupResponse } from '../types';

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

  const checkIfAdded = async (groupId: string, userId: string) => {
    const options: RequestInit = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({ userId }),
    };
    const data = await fetch(`${BASE_URL}/group/joined?id=${groupId}`, options);
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

  const removeMembers = async (
    groupId: string,
    users: string[],
    accessToken: AccessToken,
  ) => {
    const options: RequestInit = {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      credentials: 'include',
      body: JSON.stringify({ groupId, users }),
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
    getLatestMessageWithinGroup,
    createGroup,
    addMembers,
    removeMembers,
    checkIfAdded,
    deleteGroup,
  };
}
