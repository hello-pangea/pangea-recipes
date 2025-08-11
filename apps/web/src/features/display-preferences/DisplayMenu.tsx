import ArrowDownwardRoundedIcon from '@mui/icons-material/ArrowDownwardRounded';
import ArrowUpwardRoundedIcon from '@mui/icons-material/ArrowUpwardRounded';
import FormatListBulletedRoundedIcon from '@mui/icons-material/FormatListBulletedRounded';
import GridViewRoundedIcon from '@mui/icons-material/GridViewRounded';
import SortByAlphaRoundedIcon from '@mui/icons-material/SortByAlphaRounded';
import TodayRoundedIcon from '@mui/icons-material/TodayRounded';
import ViewHeadlineRoundedIcon from '@mui/icons-material/ViewHeadlineRounded';
import {
  ListItemIcon,
  ListItemText,
  ListSubheader,
  Menu,
  MenuItem,
  type MenuProps,
} from '@mui/material';
import type { Sort } from './sort';
import { useViewPreference } from './view';

interface Props extends Pick<MenuProps, 'anchorEl'> {
  onClose: () => void;
  sort: Sort;
  onSortChange: (sort: Sort) => void;
  disableDateSort?: boolean;
}

export function DisplayMenu({
  anchorEl,
  onClose,
  sort,
  onSortChange,
  disableDateSort,
}: Props) {
  const [view, setView] = useViewPreference();

  const open = Boolean(anchorEl);

  function handleClose() {
    onClose();
  }

  function changeSort(newSortKey: Sort['key']) {
    if (newSortKey === sort.key) {
      onSortChange({
        key: sort.key,
        direction: sort.direction === 'asc' ? 'desc' : 'asc',
      });
    } else {
      onSortChange({ key: newSortKey, direction: sort.direction });
    }
  }

  return (
    <Menu
      anchorEl={anchorEl}
      open={open}
      onClose={handleClose}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'right',
      }}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      slotProps={{
        paper: {
          sx: {
            minWidth: 200,
          },
        },
      }}
    >
      <ListSubheader>Sort by</ListSubheader>
      {!disableDateSort && (
        <MenuItem
          selected={sort.key === 'date'}
          onClick={() => {
            changeSort('date');
          }}
        >
          <ListItemIcon>
            <TodayRoundedIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Date added</ListItemText>
          {sort.key === 'date' &&
            (sort.direction === 'asc' ? (
              <ArrowUpwardRoundedIcon
                color="primary"
                fontSize="small"
                sx={{ ml: 'auto' }}
              />
            ) : (
              <ArrowDownwardRoundedIcon
                color="primary"
                fontSize="small"
                sx={{ ml: 'auto' }}
              />
            ))}
        </MenuItem>
      )}
      <MenuItem
        selected={sort.key === 'name'}
        onClick={() => {
          changeSort('name');
        }}
      >
        <ListItemIcon>
          <SortByAlphaRoundedIcon fontSize="small" />
        </ListItemIcon>
        <ListItemText>Name</ListItemText>
        {sort.key === 'name' &&
          (sort.direction === 'asc' ? (
            <ArrowUpwardRoundedIcon
              color="primary"
              fontSize="small"
              sx={{ ml: 'auto' }}
            />
          ) : (
            <ArrowDownwardRoundedIcon
              color="primary"
              fontSize="small"
              sx={{ ml: 'auto' }}
            />
          ))}
      </MenuItem>
      <ListSubheader>View as</ListSubheader>
      <MenuItem
        selected={view === 'grid'}
        onClick={() => {
          setView('grid');
        }}
      >
        <ListItemIcon>
          <GridViewRoundedIcon fontSize="small" />
        </ListItemIcon>
        <ListItemText>Grid</ListItemText>
      </MenuItem>
      <MenuItem
        selected={view === 'list'}
        onClick={() => {
          setView('list');
        }}
      >
        <ListItemIcon>
          <FormatListBulletedRoundedIcon fontSize="small" />
        </ListItemIcon>
        <ListItemText>List</ListItemText>
      </MenuItem>
      <MenuItem
        selected={view === 'compact'}
        onClick={() => {
          setView('compact');
        }}
      >
        <ListItemIcon>
          <ViewHeadlineRoundedIcon fontSize="small" />
        </ListItemIcon>
        <ListItemText>Compact</ListItemText>
      </MenuItem>
    </Menu>
  );
}
