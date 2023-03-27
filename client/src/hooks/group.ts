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
    const groups = await data.json();
    return groups;
  };

  const getGroupById = async (groupId: string, accessToken: AccessToken) => {
    const options: RequestInit = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      credentials: 'include',
    };
    const data = await fetch(`${BASE_URL}/group?id=${groupId}`, options);
    const group: GroupResponse = await data.json();
    return group;
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
    const result = await data.json();
    return result;
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
    await fetch(`${BASE_URL}/group`, options);
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
    await fetch(`${BASE_URL}/group/member/add`, options);
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
    await fetch(`${BASE_URL}/group/member/remove`, options);
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
    await fetch(`${BASE_URL}/group?id=${groupId}`, options);
  };

  return {
    getGroupsByUser,
    getGroupById,
    createGroup,
    addMembers,
    removeMembers,
    checkIfAdded,
    deleteGroup,
  };
}
