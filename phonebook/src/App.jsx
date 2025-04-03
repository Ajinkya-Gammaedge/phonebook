import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  Container,
  Typography,
  Box,
  TextField,
  IconButton,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Button,
  InputAdornment,
  Paper,
  Popover,
  Switch,
  FormGroup,
  FormControlLabel,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Stack,
  Avatar,
  Tooltip,
} from '@mui/material';
import {
  Add as AddIcon,
  Search as SearchIcon,
  FilterList as FilterIcon,
  BookmarkBorder as BookmarkBorderIcon,
  Bookmark as BookmarkIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import { setSearchQuery, setSelectedLabel } from './store/contactSlice';
import { deleteContact, toggleBookmark } from './store/contactSlice';
import ContactForm from './components/ContactForm';
import ContactDetails from './components/ContactDetails';

const ITEMS_PER_PAGE = 10;

const getLabelColor = (label) => {
  switch (label) {
    case 'Work':
      return '#1976d2';
    case 'School':
      return '#2e7d32';
    case 'Friends':
      return '#ed6c02';
    case 'Family':
      return '#9c27b0';
    default:
      return '#1976d2';
  }
};

function App() {
  const dispatch = useDispatch();
  const { contacts, searchQuery, selectedLabel } = useSelector((state) => state.contacts);
  const [openForm, setOpenForm] = useState(false);
  const [selectedContact, setSelectedContact] = useState(null);
  const [openDetails, setOpenDetails] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [filterAnchorEl, setFilterAnchorEl] = useState(null);
  const [showBookmarked, setShowBookmarked] = useState(false);
  const [isFilterEnabled, setIsFilterEnabled] = useState(true);

  const handleSearch = (e) => {
    dispatch(setSearchQuery(e.target.value));
    setCurrentPage(1);
  };

  const handleLabelChange = (e) => {
    dispatch(setSelectedLabel(e.target.value));
    setCurrentPage(1);
  };

  const handleFilterClick = (event) => {
    setFilterAnchorEl(event.currentTarget);
  };

  const handleFilterClose = () => {
    setFilterAnchorEl(null);
  };

  const toggleBookmarkedFilter = () => {
    setShowBookmarked(!showBookmarked);
    setCurrentPage(1);
  };

  const handleDeleteContact = (contactId) => {
    if (window.confirm('Are you sure you want to delete this contact?')) {
      dispatch(deleteContact(contactId));
    }
  };

  const handleToggleBookmark = (contactId, event) => {
    event.stopPropagation();
    dispatch(toggleBookmark(contactId));
  };

  const filteredContacts = contacts
    .filter((contact) => {
      const matchesSearch = contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        contact.phone.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesLabel = !isFilterEnabled || selectedLabel === 'all' || contact.label === selectedLabel;
      const matchesBookmark = !showBookmarked || contact.bookmarked;
      return matchesSearch && matchesLabel && matchesBookmark;
    })
    .sort((a, b) => {
      if (a.bookmarked && !b.bookmarked) return -1;
      if (!a.bookmarked && b.bookmarked) return 1;
      return a.name.localeCompare(b.name);
    });

  const indexOfLastContact = currentPage * ITEMS_PER_PAGE;
  const indexOfFirstContact = indexOfLastContact - ITEMS_PER_PAGE;
  const currentContacts = filteredContacts.slice(indexOfFirstContact, indexOfLastContact);
  const totalPages = Math.ceil(filteredContacts.length / ITEMS_PER_PAGE);

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Paper elevation={0} sx={{ p: 3, bgcolor: 'background.default' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="h4" component="h1" sx={{ fontWeight: 500 }}>
              Phonebook
            </Typography>
            <Typography variant="subtitle1" color="text.secondary" sx={{ mt: 1 }}>
              {filteredContacts.length} Contact{filteredContacts.length !== 1 ? 's' : ''} {showBookmarked ? '(Bookmarked)' : ''}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
            <TextField
              placeholder="Search by name or phone"
              value={searchQuery}
              onChange={handleSearch}
              size="small"
              sx={{
                width: 250,
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                }
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
            <IconButton
              onClick={toggleBookmarkedFilter}
              color={showBookmarked ? 'primary' : 'default'}
              sx={{ borderRadius: 2 }}
            >
              {showBookmarked ? <BookmarkIcon /> : <BookmarkBorderIcon />}
            </IconButton>
            <IconButton
              onClick={handleFilterClick}
              sx={{
                bgcolor: filterAnchorEl ? 'action.selected' : 'transparent',
                borderRadius: 2,
              }}
            >
              <FilterIcon />
            </IconButton>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => {
                setSelectedContact(null);
                setOpenForm(true);
              }}
              sx={{ borderRadius: 2 }}
            >
              Create contact
            </Button>
          </Box>
        </Box>

        <Popover
          open={Boolean(filterAnchorEl)}
          anchorEl={filterAnchorEl}
          onClose={handleFilterClose}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          PaperProps={{
            sx: { width: 280, p: 2 }
          }}
        >
          <Typography variant="subtitle1" sx={{ mb: 2 }}>Filter Options</Typography>
          <FormGroup>
            <FormControlLabel
              control={
                <Switch
                  checked={isFilterEnabled}
                  onChange={(e) => setIsFilterEnabled(e.target.checked)}
                />
              }
              label="Enable Label Filter"
            />
            {isFilterEnabled && (
              <FormControl fullWidth sx={{ mt: 2 }}>
                <InputLabel>Filter by Label</InputLabel>
                <Select
                  value={selectedLabel}
                  onChange={handleLabelChange}
                  label="Filter by Label"
                  size="small"
                >
                  <MenuItem value="all">All Labels</MenuItem>
                  <MenuItem value="Work">Work</MenuItem>
                  <MenuItem value="School">School</MenuItem>
                  <MenuItem value="Friends">Friends</MenuItem>
                  <MenuItem value="Family">Family</MenuItem>
                </Select>
              </FormControl>
            )}
          </FormGroup>
        </Popover>

        <TableContainer component={Paper} elevation={0}>
          <Table sx={{ minWidth: 650 }} aria-label="contacts table">
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell align="right">Phone Number</TableCell>
                <TableCell align="right"></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {currentContacts.map((contact) => (
                <TableRow
                  key={contact.id}
                  hover
                  onClick={() => {
                    setSelectedContact(contact);
                    setOpenDetails(true);
                  }}
                  sx={{
                    cursor: 'pointer',
                    bgcolor: contact.bookmarked ? `${getLabelColor(contact.label)}08` : 'inherit'
                  }}
                >
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Avatar
                        sx={{
                          bgcolor: contact.imageUrl ? 'transparent' : getLabelColor(contact.label),
                          width: 40,
                          height: 40,
                        }}
                        src={contact.imageUrl}
                      >
                        {!contact.imageUrl && contact.name[0].toUpperCase()}
                      </Avatar>
                      <Box>
                        <Typography variant="subtitle2">{contact.name}</Typography>
                        <Chip
                          label={contact.label}
                          size="small"
                          sx={{
                            bgcolor: `${getLabelColor(contact.label)}20`,
                            color: getLabelColor(contact.label),
                            fontWeight: 500,
                            mt: 0.5,
                          }}
                        />
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell align="right">
                    <Typography>{contact.phone}</Typography>
                  </TableCell>
                  <TableCell align="right">
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                      <Tooltip title={contact.bookmarked ? "Remove bookmark" : "Add bookmark"}>
                        <IconButton
                          size="small"
                          onClick={(e) => handleToggleBookmark(contact.id, e)}
                        >
                          {contact.bookmarked ? (
                            <BookmarkIcon color="primary" />
                          ) : (
                            <BookmarkBorderIcon />
                          )}
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Edit contact">
                        <IconButton
                          size="small"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedContact(contact);
                            setOpenForm(true);
                          }}
                        >
                          <EditIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete contact">
                        <IconButton
                          size="small"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteContact(contact.id);
                          }}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
              {currentContacts.length === 0 && (
                <TableRow>
                  <TableCell colSpan={3} align="center" sx={{ py: 4 }}>
                    <Typography color="text.secondary">
                      No contacts found
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>

        {totalPages > 1 && (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
            <Stack direction="row" spacing={1}>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <Chip
                  key={page}
                  label={page}
                  onClick={() => setCurrentPage(page)}
                  variant={currentPage === page ? "filled" : "outlined"}
                  color={currentPage === page ? "primary" : "default"}
                  clickable
                />
              ))}
            </Stack>
          </Box>
        )}
      </Paper>

      <ContactForm
        open={openForm}
        onClose={() => {
          setOpenForm(false);
          setSelectedContact(null);
        }}
        contact={selectedContact}
      />

      <ContactDetails
        open={openDetails}
        onClose={() => {
          setOpenDetails(false);
          setSelectedContact(null);
        }}
        contact={selectedContact}
      />
    </Container>
  );
}

export default App;