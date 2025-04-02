import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Box,
  Avatar,
} from '@mui/material';
import { useDispatch } from 'react-redux';
import { addContact, editContact } from '../store/contactSlice';
import { nanoid } from '@reduxjs/toolkit';

const ContactForm = ({ open, onClose, contact = null }) => {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    phone: '',
    address: '',
    label: 'Work',
    avatarColor: '',
    bookmarked: false,
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (contact) {
      setFormData(contact);
    } else {
      setFormData({
        id: nanoid(),
        name: '',
        phone: '',
        address: '',
        label: 'Work',
        bookmarked: false,
      });
    }
  }, [contact]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validateForm(formData);
    if(Object.keys(validationErrors).length === 0){
      if (contact) {
        dispatch(editContact(formData));
      } else {
        dispatch(addContact(formData));
      }
    }else{
      setErrors(validationErrors);
    }
    onClose();
  };

  const validateForm = (data) =>
    {
      // let errors = {};
      if(!data.name){
        errors.name = "Name is required";
      }
      return errors;
    }

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{contact ? 'Edit Contact' : 'Add New Contact'}</DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
              <Avatar
                sx={{ 
                  width: 100, 
                  height: 100,
                  fontSize: '2.5rem'
                }}
              >
                {formData.name ? formData.name[0].toUpperCase() : '?'}
              </Avatar>
            </Box>
            <TextField
              required
              label="Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              fullWidth
            />
            <TextField
              required
              label="Phone Number"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              fullWidth
            />
            <TextField
              required
              label="Address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              fullWidth
              multiline
              rows={2}
            />
            <FormControl fullWidth>
              <InputLabel>Label</InputLabel>
              <Select
                name="label"
                value={formData.label}
                onChange={handleChange}
                label="Label"
              >
                <MenuItem value="Work">Work</MenuItem>
                <MenuItem value="School">School</MenuItem>
                <MenuItem value="Friends">Friends</MenuItem>
                <MenuItem value="Family">Family</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="contained">
            {contact ? 'Save Changes' : 'Add Contact'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default ContactForm; 