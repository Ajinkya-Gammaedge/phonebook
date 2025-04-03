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
  InputAdornment,
  IconButton,
  Badge,
  CircularProgress,
} from '@mui/material';
import { useDispatch } from 'react-redux';
import { addContact, editContact } from '../store/contactSlice';
import { nanoid } from '@reduxjs/toolkit';
import { getCountries, getCountryCallingCode } from 'libphonenumber-js';
import getUnicodeFlagIcon from 'country-flag-icons/unicode';
import { PhotoCamera, Delete as DeleteIcon } from '@mui/icons-material';
import { Cloudinary } from '@cloudinary/url-gen';
import CountrySelect from './CountrySelect';

const cld = new Cloudinary({
  cloud: {
    cloudName: 'dmwaxokqb'
  }
});

const initialFormState = {
  id: '',
  name: '',
  phone: '',
  countryCode: 'IN',
  address: '',
  label: 'Work',
  avatarColor: '',
  bookmarked: false,
  imageUrl: '',
  imagePublicId: '',
};

const ContactForm = ({ open, onClose, contact = null }) => {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState(initialFormState);
  const [errors, setErrors] = useState({});
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    if (contact) {
      setFormData(contact);
    } else {
      setFormData({
        ...initialFormState,
        id: nanoid(),
      });
    }
  }, [contact, open]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
      ...(name === 'countryCode' ? { phone: '' } : {})
    }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
    if (!allowedTypes.includes(file.type)) {
      alert('Please upload an image file (jpg or png)');
      return;
    }

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', 'phonebook_preset'); 

      const response = await fetch(
        `https://api.cloudinary.com/v1_1/dmwaxokqb/image/upload`, 
        {
          method: 'POST',
          body: formData,
        }
      );

      const data = await response.json();
      if (data.secure_url) {
        setFormData(prev => ({
          ...prev,
          imageUrl: data.secure_url,
          imagePublicId: data.public_id,
        }));
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Failed to upload image. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemoveImage = () => {
    setFormData(prev => ({
      ...prev,
      imageUrl: '',
      imagePublicId: '',
    }));
  };

  const validatePhoneNumber = (phone) => {
    const phoneRegex = /^\d+$/;
    return phoneRegex.test(phone);
  };

  const validateForm = (data) => {
    const newErrors = {};

    if (!data.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!data.phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (!validatePhoneNumber(data.phone, data.countryCode)) {
      newErrors.phone = "Please enter a valid phone number (numbers only)";
    }

    if (!data.address.trim()) {
      newErrors.address = "Address is required";
    }

    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validateForm(formData);

    if (Object.keys(validationErrors).length === 0) {
      const formattedData = {
        ...formData,
        phone: `+${getCountryCallingCode(formData.countryCode)} ${formData.phone}`
      };

      if (contact) {
        dispatch(editContact(formattedData));
      } else {
        dispatch(addContact(formattedData));
      }
      setFormData(initialFormState);
      onClose();
    } else {
      setErrors(validationErrors);
    }
  };

  const countries = getCountries();

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{contact ? 'Edit Contact' : 'Add New Contact'}</DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2, position: 'relative' }}>
              <Badge
                overlap="circular"
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                badgeContent={
                  <label htmlFor="icon-button-file">
                    <input
                      accept="image/*"
                      id="icon-button-file"
                      type="file"
                      style={{ display: 'none' }}
                      onChange={handleImageUpload}
                      disabled={isUploading}
                    />
                    <IconButton
                      aria-label="upload picture"
                      component="span"
                      sx={{
                        bgcolor: 'primary.main',
                        color: 'white',
                        '&:hover': {
                          bgcolor: 'primary.dark',
                        },
                      }}
                      disabled={isUploading}
                    >
                      {isUploading ? (
                        <CircularProgress size={24} color="inherit" />
                      ) : (
                        <PhotoCamera />
                      )}
                    </IconButton>
                  </label>
                }
              >
                {formData.imageUrl ? (
                  <Box sx={{ position: 'relative' }}>
                    <Avatar
                      sx={{
                        width: 100,
                        height: 100,
                      }}
                      src={formData.imageUrl}
                    />
                    <IconButton
                      size="small"
                      sx={{
                        position: 'absolute',
                        top: -8,
                        right: -8,
                        bgcolor: 'background.paper',
                        boxShadow: 1,
                      }}
                      onClick={handleRemoveImage}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Box>
                ) : (
                  <Avatar
                    sx={{
                      width: 100,
                      height: 100,
                      fontSize: '2.5rem',
                      bgcolor: formData.avatarColor || '#1976d2',
                    }}
                  >
                    {formData.name ? formData.name[0].toUpperCase() : '?'}
                  </Avatar>
                )}
              </Badge>
            </Box>
            <TextField
              required
              label="Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              fullWidth
              error={!!errors.name}
              helperText={errors.name}
            />
            <Box sx={{ display: 'flex', gap: 1 }}>
              <FormControl sx={{ width: '40%' }}>
                <InputLabel>Country</InputLabel>
                <Select
                  name="countryCode"
                  value={formData.countryCode}
                  onChange={handleChange}
                  label="Country"
                >
                  {countries.map((country) => (
                    <MenuItem key={country} value={country}>
                      {getUnicodeFlagIcon(country)} {country} (+{getCountryCallingCode(country)})
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <TextField
                required
                label="Phone Number"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                fullWidth
                error={!!errors.phone}
                helperText={errors.phone}
   
              />
            </Box>
            <TextField
              required
              label="Address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              fullWidth
              multiline
              rows={2}
              error={!!errors.address}
              helperText={errors.address}
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
          <Button type="submit" variant="contained" disabled={isUploading}>
            {contact ? 'Save Changes' : 'Add Contact'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default ContactForm; 