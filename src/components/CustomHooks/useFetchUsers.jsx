import useSWR from "swr";
import UserService from "../../services/UserService";

const fetcher = async () => {
  const fetchedUsers = await UserService.getAllUsers();
  if (fetchedUsers && Array.isArray(fetchedUsers.userList)) {
    return fetchedUsers.userList;
  }
  throw new Error(
    'Invalid data format received. Expected an array inside "userList".'
  );
};

export const useFetchUsers = () => {
  const { data, error, mutate } = useSWR("users", fetcher, {
    refreshInterval: 3000,
    dedupingInterval: 3000,
    suspense: false,
  });

  return {
    users: data || [],
    error,
    mutate,
    isLoading: !data && !error,
  };
};
