import { useSearchParams } from 'react-router-dom';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setAccessToken, setRefreshToken, setRole } from '../store/slices/user';
import {
  useLazyFetchAuthTokensQuery,
  useLazyGetProfileQuery,
} from '../api/modules/auth';

export default function GoogleCallback() {
  const dispatch = useDispatch();
  const [fetchTokens] = useLazyFetchAuthTokensQuery();
  const [fetchProfile] = useLazyGetProfileQuery();

  const [urlSearchParams] = useSearchParams();

  useEffect(() => {
    const queryParams: any = {};

    for (const [key, value] of urlSearchParams.entries()) {
      queryParams[key] = value;
    }

    const getTokens = async () => {
      const tokens = await fetchTokens(queryParams).unwrap();
      dispatch(setAccessToken(tokens.accessToken));
      dispatch(setRefreshToken(tokens.refreshToken));
      await fetchProfile()
        .unwrap()
        .then((fullfilled) => {
          dispatch(setRole(fullfilled.role.id));
          window.location.href = 'http://localhost:3001/chat';
        });
    };

    getTokens();
  }, [urlSearchParams, dispatch, fetchTokens]);

  return null;
}
