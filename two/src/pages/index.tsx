import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getPosts } from '../features/posts/postsSlice';
import { RootState } from '../app/store';
import useAWCache from '../hooks/useSPCache';
import Table from '../components/Table';
import { useSPCatch } from '../context/SPCatchContext';
import { CircularProgress, Box, Typography, Button } from '@mui/material';

const IndexPage: React.FC = () => {
  const dispatch = useDispatch();
  const posts = useSelector((s: RootState) => s.posts);
  const { payload, setPayload } = useSPCatch();

  const SPCatch = (offset: number, limit: number) => {
    return dispatch<any>(getPosts({ offset, limit }));
  };

  const fetcher = (offset: number, limit: number) => {
    return SPCatch(offset, limit);
  };

  const {
    dataList,
    changePage,
    meta,
    tableReset,
    loading,
    handleNextPage,
    handlePrevPage,
    changeLimit,
  } = useAWCache({
    payload: { data: posts.data, meta: posts.meta, status: posts.status },
    fetcher,
    defaultLimit: 10,
    defaultOffset: 0,
    usingCache: true,
  });

  useEffect(() => {
    tableReset();
    changePage(1);
  }, []);

  useEffect(() => {
    setPayload({ data: posts.data, meta: posts.meta, status: posts.status });
  }, [posts.data, posts.meta, posts.status, setPayload]);

  return (
      <div style={{ padding: 20 }}>
        <Typography variant="h4" gutterBottom>
          Posts (simple MVP)
        </Typography>

        {posts.status === 'failed' && (
            <Typography color="error">{posts.error}</Typography>
        )}

        {loading ? (
            <Box display="flex" justifyContent="center" my={4}>
              <CircularProgress />
            </Box>
        ) : (
            <>
              <Table items={dataList} />

              <Box
                  display="flex"
                  alignItems="center"
                  gap={1}
                  mt={2}
              >
                <Button
                    variant="contained"
                    onClick={() => handlePrevPage()}
                    disabled={meta.offset === 0}
                >
                  Prev
                </Button>

                <Button
                    variant="contained"
                    onClick={() => handleNextPage()}
                    disabled={meta.offset + meta.limit >= meta.total}
                >
                  Next
                </Button>

                <Box marginLeft="auto">
                  <Typography variant="body1">
                    Page: {Math.floor(meta.offset / meta.limit) + 1} /{' '}
                    {Math.ceil(meta.total / meta.limit)}
                  </Typography>
                </Box>
              </Box>
            </>
        )}
      </div>
  );
};

export default IndexPage;
