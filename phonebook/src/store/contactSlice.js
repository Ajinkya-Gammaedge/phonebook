import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  contacts: [],
  searchQuery: '',
  selectedLabel: 'all',
};

const contactSlice = createSlice({
  name: 'contacts',
  initialState,
  reducers: {
    addContact: (state, action) => {
      state.contacts.push(action.payload);
      state.contacts.sort((a, b) => a.name.localeCompare(b.name));
    },
    editContact: (state, action) => {
      
      const index = state.contacts.findIndex(contact => contact.id === action.payload.id);
      if (index !== -1) {
        state.contacts[index] = action.payload;
        state.contacts.sort((a, b) => a.name.localeCompare(b.name));
        
      }
    },
    deleteContact: (state, action) => {
      state.contacts = state.contacts.filter(contact => contact.id !== action.payload);
    },
    toggleBookmark: (state, action) => {
      const contact = state.contacts.find(contact => contact.id === action.payload);
      console.log(contact);
      if (contact) {
        contact.bookmarked = !contact.bookmarked;
      }
    },
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
    },
    setSelectedLabel: (state, action) => {
      state.selectedLabel = action.payload;
    },
  },
});

export const {
  addContact,
  editContact,
  deleteContact,
  toggleBookmark,
  setSearchQuery,
  setSelectedLabel,
} = contactSlice.actions;

export default contactSlice.reducer; 