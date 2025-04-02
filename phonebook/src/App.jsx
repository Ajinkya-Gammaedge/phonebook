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
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from '@mui/material';
import {
  Add as AddIcon,
  Search as SearchIcon,
  FilterList as FilterIcon,
} from '@mui/icons-material';
import { setSearchQuery, setSelectedLabel } from './store/contactSlice';
import ContactCard from './components/ContactCard';
import ContactForm from './components/ContactForm';
import ContactDetails from './components/ContactDetails';


function App() {
  const dispatch = useDispatch();
  const { contacts, searchQuery, selectedLabel } = useSelector((state) => state.contacts);
  const [openForm, setOpenForm] = useState(false);
  const [selectedContact, setSelectedContact] = useState(null);
  const [openDetails, setOpenDetails] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [filterAnchorEl, setFilterAnchorEl] = useState(null);
  const [isFilterEnabled, setIsFilterEnabled] = useState(true);
  const contactsPerPage = 10;

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

  const filteredContacts = contacts
    .filter((contact) => {
      const matchesSearch = contact.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesLabel = !isFilterEnabled || selectedLabel === 'all' || contact.label === selectedLabel;
      return matchesSearch && matchesLabel;
    })
    .sort((a, b) => {
      if (a.bookmarked && !b.bookmarked) return -1;
      if (!a.bookmarked && b.bookmarked) return 1;
      return a.name.localeCompare(b.name);
    });

  const indexOfLastContact = currentPage * contactsPerPage;
  const indexOfFirstContact = indexOfLastContact - contactsPerPage;
  const currentContacts = filteredContacts.slice(indexOfFirstContact, indexOfLastContact);
  const totalPages = Math.ceil(filteredContacts.length / contactsPerPage);

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Paper elevation={0} sx={{ p: 3, bgcolor: 'background.default' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="h4" component="h1" sx={{ fontWeight: 500 }}>
              Phonebook
            </Typography>
          </Box>
          <TextField
            fullWidth
            placeholder="Search contacts by name"
            value={searchQuery}
            onChange={handleSearch}
            size="small"
            sx={{
              m:3,
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
            onClick={handleFilterClick}
            sx={{ 
              bgcolor: filterAnchorEl ? 'action.selected' : 'transparent',
              borderRadius: 2,
              m:3,
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
            sx={{ borderRadius: 2, p:2,m:2 , width: 500}}
          >
            Create contact
          </Button>
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
            sx: { width: 250, p: 2 }
          }}
        >
          <FormGroup>
            <FormControlLabel
              control={
                <Switch
                  checked={isFilterEnabled}
                  onChange={(e) => setIsFilterEnabled(e.target.checked)}
                />
              }
              label="Enable Filtering"
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
                  <MenuItem value="All">All</MenuItem>
                  <MenuItem value="Work">Work</MenuItem>
                  <MenuItem value="School">School</MenuItem>
                  <MenuItem value="Friends">Friends</MenuItem>
                  <MenuItem value="Family">Family</MenuItem>
                </Select>
              </FormControl>
            )}
          </FormGroup>
        </Popover>
        <Typography variant="subtitle1" color="text.secondary">
              {contacts.length} Contact{contacts.length !== 1 ? 's' : ''}
            </Typography>
        <Box sx={{ mb: 3 }}>

          <TableContainer component={Paper}>
            <Table sx={{minWidth:650}} aria-label="phonebook label">
              <TableHead>
                <TableRow>
                  <TableCell sx={{pl:5}}> Name</TableCell>

                  <TableCell align='left'> Phone Number</TableCell>

                </TableRow>
              </TableHead>
              <TableBody>
              {currentContacts.map((contact, index) => 
          (
            <ContactCard
              key={index}
              contact={contact}
              onEdit={(contact) => {
                setSelectedContact(contact);
                setOpenForm(true);
              }}
              onClick={(contact) => {
                setSelectedContact(contact);
                setOpenDetails(true);
              }}
            />
          ))}
              </TableBody>
            </Table>
          </TableContainer>

          {currentContacts.length === 0 && (
            <Typography color="text.secondary" align="center" sx={{ py: 4 }}>
              No contacts found
            </Typography>
          )}
        </Box>
        
        {totalPages > 1 && (
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1 }}>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <Button
                key={page}
                variant={currentPage === page ? 'contained' : 'outlined'}
                size="small"
                onClick={() => setCurrentPage(page)}
                sx={{ minWidth: 40, borderRadius: 2 }}
              >
                {page}
              </Button>
            ))}
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

      {/* <AdvancedImage cldImg={img}/> */}

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




