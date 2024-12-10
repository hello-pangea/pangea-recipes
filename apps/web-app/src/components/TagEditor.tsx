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
  TextField,
  Typography,
  type SxProps,
  type Theme,
} from '@mui/material';
import type { CreateTagDto, Tag } from '@open-zero/features';
import { useState } from 'react';

interface Props {
  tags: Tag[];
  onTagsChange: (tags: (Tag | CreateTagDto)[]) => void;
  sx?: SxProps<Theme>;
}

export function TagEditor({ tags, onTagsChange, sx = [] }: Props) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [search, setsSearch] = useState('');

  function handleClose() {
    setAnchorEl(null);

    setsSearch('');
  }

  return (
    <Box
      sx={{
        display: 'flex',
        rowGap: 2,
        columnGap: 1,
        flexWrap: 'wrap',
        ...sx,
      }}
    >
      {tags.map((tag) => (
        <Chip
          key={tag.id}
          label={tag.name}
          variant="outlined"
          deleteIcon={<ClearRoundedIcon />}
          onDelete={() => {
            onTagsChange(tags.filter((t) => t.id !== tag.id));
          }}
        />
      ))}
      <Chip
        label="Add Tag"
        color="primary"
        variant="outlined"
        icon={<AddRoundedIcon />}
        onClick={(event) => {
          setAnchorEl(event.currentTarget);
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
              width: 200,
            },
          },
        }}
      >
        <Typography sx={{ fontWeight: 'bold', mb: 1 }}>Add tag</Typography>
        <TextField
          variant="outlined"
          size="small"
          placeholder="Search"
          value={search}
          fullWidth
          onChange={(event) => {
            setsSearch(event.target.value);
          }}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <SearchRoundedIcon
                    sx={{ color: (theme) => theme.palette.text.disabled }}
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
        <Button
          onClick={() => {
            handleClose();

            onTagsChange([...tags, { name: search }]);
          }}
        >
          Add
        </Button>
      </Popover>
    </Box>
  );
}
