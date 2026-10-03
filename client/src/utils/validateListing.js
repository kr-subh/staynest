export const validateListingForm = (values = {}) => {
  const errors = {};
  const title = (values.title || '').trim();
  if (title.length < 10) {
    errors.title = 'Title must be at least 10 characters';
  } else if (title.length > 100) {
    errors.title = 'Title must be 100 characters or fewer';
  }

  const description = (values.description || '').trim();
  if (description.length < 30) {
    errors.description = 'Description must be at least 30 characters';
  }

  const price = Number(values.pricePerNight);
  if (values.pricePerNight === '' || !Number.isFinite(price) || price <= 0) {
    errors.pricePerNight = 'Price per night must be greater than 0';
  }

  if (values.imageUrl && values.imageUrl.trim()) {
    try {
      const url = new URL(values.imageUrl.trim());
      if (!['http:', 'https:'].includes(url.protocol)) {
        errors.imageUrl = 'Image URL must start with http:// or https://';
      }
    } catch {
      errors.imageUrl = 'Please enter a valid image URL';
    }
  }

  return errors;
};
