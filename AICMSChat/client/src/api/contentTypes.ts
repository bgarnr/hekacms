import api from './api';

// Description: Get all content types
// Endpoint: GET /api/content-types
// Request: {}
// Response: { contentTypes: Array<{ _id: string, name: string, fields: Array<any>, createdAt: string, instanceCount: number }> }
export const getContentTypes = () => {
  // Mocking the response
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        contentTypes: [
          {
            _id: '1',
            name: 'Appointment',
            fields: [
              { name: 'place', type: 'text', required: true },
              { name: 'time', type: 'datetime', required: true },
              { name: 'subject', type: 'text', required: true },
              { name: 'attendees', type: 'multiselect', required: true }
            ],
            createdAt: '2024-01-15T10:30:00Z',
            instanceCount: 12
          },
          {
            _id: '2',
            name: 'Blog Post',
            fields: [
              { name: 'title', type: 'text', required: true },
              { name: 'content', type: 'richtext', required: true },
              { name: 'author', type: 'text', required: true },
              { name: 'publishedDate', type: 'date', required: true },
              { name: 'tags', type: 'multiselect', required: false }
            ],
            createdAt: '2024-01-10T14:20:00Z',
            instanceCount: 8
          },
          {
            _id: '3',
            name: 'Product',
            fields: [
              { name: 'name', type: 'text', required: true },
              { name: 'description', type: 'textarea', required: true },
              { name: 'price', type: 'number', required: true },
              { name: 'category', type: 'select', required: true },
              { name: 'images', type: 'image', required: false }
            ],
            createdAt: '2024-01-08T09:15:00Z',
            instanceCount: 25
          }
        ]
      });
    }, 500);
  });
  // Uncomment the below lines to make an actual API call
  // try {
  //   return await api.get('/api/content-types');
  // } catch (error) {
  //   throw new Error(error?.response?.data?.error || error.message);
  // }
}

// Description: Create a new content type
// Endpoint: POST /api/content-types
// Request: { name: string, fields: Array<{ name: string, type: string, required: boolean }> }
// Response: { success: boolean, contentType: { _id: string, name: string, fields: Array<any> } }
export const createContentType = (data: { name: string; fields: Array<{ name: string; type: string; required: boolean }> }) => {
  // Mocking the response
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        contentType: {
          _id: Date.now().toString(),
          name: data.name,
          fields: data.fields,
          createdAt: new Date().toISOString(),
          instanceCount: 0
        }
      });
    }, 500);
  });
  // Uncomment the below lines to make an actual API call
  // try {
  //   return await api.post('/api/content-types', data);
  // } catch (error) {
  //   throw new Error(error?.response?.data?.error || error.message);
  // }
}

// Description: Delete a content type
// Endpoint: DELETE /api/content-types/:id
// Request: { id: string }
// Response: { success: boolean, message: string }
export const deleteContentType = (id: string) => {
  // Mocking the response
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        message: 'Content type deleted successfully'
      });
    }, 500);
  });
  // Uncomment the below lines to make an actual API call
  // try {
  //   return await api.delete(`/api/content-types/${id}`);
  // } catch (error) {
  //   throw new Error(error?.response?.data?.error || error.message);
  // }
}