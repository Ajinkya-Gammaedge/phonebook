import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Avatar,
  Box,
  Chip,
} from '@mui/material';

const ContactDetails = ({ open, onClose, contact }) => {
  if (!contact) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Contact Details</DialogTitle>
      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
          <Avatar
            sx={{ 
              width: 120, 
              height: 120,
              bgcolor: contact.avatarColor,
              fontSize: '3rem'
            }}
          >
            {contact.name[0].toUpperCase()}
          </Avatar>
          
          <Typography variant="h5" component="div">
            {contact.name}
          </Typography>

          <Chip 
            label={contact.label}
            color="primary"
            variant="outlined"
          />

          <Box sx={{ width: '100%', mt: 2 }}>
            <Typography variant="subtitle1" color="text.secondary">
              Phone Number
            </Typography>
            <Typography variant="body1" gutterBottom>
              {contact.phone}
            </Typography>

            <Typography variant="subtitle1" color="text.secondary" sx={{ mt: 2 }}>
              Address
            </Typography>
            <Typography variant="body1" gutterBottom>
              {contact.address}
            </Typography>
          </Box>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
};

export default ContactDetails; 