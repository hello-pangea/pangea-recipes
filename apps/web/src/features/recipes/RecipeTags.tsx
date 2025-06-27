import { isSxArray } from '#src/utils/isSxArray';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import ClearRoundedIcon from '@mui/icons-material/ClearRounded';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import {
  Box,
  Button,
  Chip,
  IconButton,
  InputAdornment,
  Popover,
  Stack,
  TextField,
  Typography,
  type SxProps,
  type Theme,
} from '@mui/material';
import type { Tag } from '@open-zero/features';
import {
  useRecipe,
  useUpdateRecipe,
  useUsedRecipeTags,
} from '@open-zero/features/recipes';
import { useMemo, useRef, useState } from 'react';
import { useMaybeSignedInUserId } from '../auth/useMaybeSignedInUserId';

interface Props {
  recipeId: string;
  readOnly?: boolean;
  sx?: SxProps<Theme>;
}

export function RecipeTags({ recipeId, readOnly, sx = [] }: Props) {
  const userId = useMaybeSignedInUserId();
  const { data: recipe } = useRecipe({ recipeId });
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [search, setsSearch] = useState('');
  const inputRef = useRef<HTMLInputElement | null>(null);
  const updateRecipe = useUpdateRecipe();
  const { data: usedTags } = useUsedRecipeTags({
    userId: userId ?? '',
    queryConfig: {
      enabled: !!userId,
    },
  });

  const tags = useMemo(() => recipe?.tags ?? [], [recipe?.tags]);

  const filteredUsedTags = useMemo(() => {
    if (!usedTags) {
      return [];
    }

    const possibleTags = usedTags
      .filter((tag) => !tags.some((t) => t.name === tag.name))
      .sort((a, b) => a.name.localeCompare(b.name));

    if (!search) {
      return possibleTags;
    }

    return possibleTags.filter((tag) => tag.name.includes(search));
  }, [usedTags, search, tags]);

  function handleClose() {
    setAnchorEl(null);

    setsSearch('');
  }

  function handleAddTag(tag: string) {
    if (!tag) {
      return;
    }

    const newTags = [...tags, { name: tag }];

    updateRecipe.mutate({
      id: recipeId,
      tags: newTags,
    });

    handleClose();
  }

  function handleRemoveTag(tag: Tag) {
    const newTags = tags.filter((t) => t.id !== tag.id);

    updateRecipe.mutate({
      id: recipeId,
      tags: newTags,
    });
  }

  return (
    <Box
      sx={[
        {
          display: 'flex',
          rowGap: 2,
          columnGap: 1,
          flexWrap: 'wrap',
        },
        ...(isSxArray(sx) ? sx : [sx]),
      ]}
    >
      {tags.map((tag) => (
        <Chip
          key={tag.id}
          label={tag.name}
          size="small"
          deleteIcon={<ClearRoundedIcon />}
          onDelete={
            readOnly
              ? undefined
              : () => {
                  handleRemoveTag(tag);
                }
          }
        />
      ))}
      {!readOnly && (
        <>
          <Chip
            label="Add Tag"
            color="primary"
            variant="outlined"
            size="small"
            icon={<AddRoundedIcon />}
            onClick={(event) => {
              setAnchorEl(event.currentTarget);

              setTimeout(() => {
                inputRef.current?.focus();
              }, 100);
            }}
          />
          <Popover
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleClose}
            slotProps={{
              paper: {
                sx: {
                  p: 1.5,
                  width: 250,
                },
              },
            }}
          >
            <Typography sx={{ fontWeight: 'bold', mb: 1 }}>Add tag</Typography>
            <TextField
              inputRef={inputRef}
              variant="outlined"
              size="small"
              placeholder="Search"
              value={search}
              fullWidth
              onChange={(event) => {
                setsSearch(event.target.value);
              }}
              onKeyDown={(event) => {
                if (event.key === 'Enter') {
                  handleAddTag(search);
                }
              }}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchRoundedIcon
                        sx={{
                          color: (theme) => theme.vars.palette.text.disabled,
                        }}
                      />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="clear search"
                        size="small"
                        onClick={() => {
                          setsSearch('');
                        }}
                      >
                        <ClearRoundedIcon fontSize="small" />
                      </IconButton>
                    </InputAdornment>
                  ),
                  sx: {
                    pr: 0.5,
                    pl: 1,
                    mb: 1,
                  },
                },
              }}
            />
            <Stack
              direction="column"
              spacing={1}
              sx={{
                maxHeight: 200,
                overflowY: 'auto',
                alignItems: 'flex-start',
                mb: 1,
              }}
            >
              {filteredUsedTags.map((tag) => (
                <Chip
                  size="small"
                  key={tag.id}
                  label={tag.name}
                  onClick={() => {
                    handleAddTag(tag.name);
                  }}
                />
              ))}
            </Stack>
            <Button
              onClick={() => {
                handleAddTag(search);
              }}
            >
              Add
            </Button>
          </Popover>
        </>
      )}
    </Box>
  );
}
