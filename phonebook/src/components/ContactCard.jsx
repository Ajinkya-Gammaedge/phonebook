import React from 'react';
import { useDispatch } from 'react-redux';
import {
  Card,
  CardContent,
  Typography,
  IconButton,
  Avatar,
  Box,
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Bookmark as BookmarkIcon,
  BookmarkBorder as BookmarkBorderIcon,
} from '@mui/icons-material';
import { toggleBookmark, deleteContact } from '../store/contactSlice';

const ContactCard = ({ contact, onEdit, onClick }) => {
  const dispatch = useDispatch();

  const handleBookmarkClick = (e) => {
    e.stopPropagation();
    dispatch(toggleBookmark(contact.id));
  };

  const handleDeleteClick = (e) => {
    e.stopPropagation();
    dispatch(deleteContact(contact.id));
  };

  const handleEditClick = (e) => {
    e.stopPropagation();
    onEdit(contact);
  };

  return (
    <Card 
      onClick={() => onClick(contact)}
      sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        mb: 1, 
        cursor: 'pointer',
        '&:hover': { bgcolor: 'action.hover' }
      }}
    >
      <Avatar
        sx={{ 
          width: 40, 
          height: 40, 
          m: 1,
          bgcolor: contact.avatarColor
        }}
      >
        {contact.name[0].toUpperCase()}
      </Avatar>
      <CardContent sx={{ flex: 1, py: 1, '&:last-child': { pb: 1 } }}>
        <Typography variant="subtitle1" component="div">
          {contact.name}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {contact.phone}
        </Typography>
      </CardContent>
      <Box sx={{ display: 'flex', pr: 1 }}>
        <IconButton size="small" onClick={handleBookmarkClick}>
          {contact.bookmarked ? <BookmarkIcon color="primary" /> : <BookmarkBorderIcon />}
        </IconButton>
        <IconButton size="small" onClick={handleEditClick}>
          <EditIcon />
        </IconButton>
        <IconButton size="small" onClick={handleDeleteClick}>
          <DeleteIcon />
        </IconButton>
      </Box>
    </Card>
  );
};

export default ContactCard; 