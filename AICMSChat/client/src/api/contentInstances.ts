import api from './api';

// Description: Get all content instances
// Endpoint: GET /api/content-instances
// Request: { contentTypeId?: string }
// Response: { instances: Array<{ _id: string, contentType: string, data: any, createdAt: string, updatedAt: string }> }
export const getContentInstances = (contentTypeId?: string) => {
  // Mocking the response
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        instances: [
          {
            _id: '1',
            contentType: 'Appointment',
            contentTypeId: '1',
            data: {
              place: 'Conference Room A',
              time: '2024-01-20T14:00:00Z',
              subject: 'Team Standup Meeting',
              attendees: ['John Doe', 'Jane Smith', 'Mike Johnson']
            },
            createdAt: '2024-01-15T10:30:00Z',
            updatedAt: '2024-01-15T10:30:00Z'
          },
          {
            _id: '2',
            contentType: 'Blog Post',
            contentTypeId: '2',
            data: {
              title: 'Getting Started with AI CMS',
              content: 'This is a comprehensive guide to using our AI-powered content management system...',
              author: 'Sarah Wilson',
              publishedDate: '2024-01-18T00:00:00Z',
              tags: ['AI', 'CMS', 'Tutorial']
            },
            createdAt: '2024-01-16T09:20:00Z',
            updatedAt: '2024-01-16T09:20:00Z'
          },
          {
            _id: '3',
            contentType: 'Product',
            contentTypeId: '3',
            data: {
              name: 'Wireless Headphones',
              description: 'Premium quality wireless headphones with noise cancellation',
              price: 299.99,
              category: 'Electronics',
              images: ['headphones1.jpg', 'headphones2.jpg']
            },
            createdAt: '2024-01-14T16:45:00Z',
            updatedAt: '2024-01-14T16:45:00Z'
          }
        ]
      });
    }, 500);
  });
  // Uncomment the below lines to make an actual API call
  // try {
  //   const params = contentTypeId ? { contentTypeId } : {};
  //   return await api.get('/api/content-instances', { params });
  // } catch (error) {
  //   throw new Error(error?.response?.data?.error || error.message);
  // }
}

// Description: Create a new content instance
// Endpoint: POST /api/content-instances
// Request: { contentTypeId: string, data: any }
// Response: { success: boolean, instance: { _id: string, contentType: string, data: any } }
export const createContentInstance = (data: { contentTypeId: string; data: any }) => {
  // Mocking the response
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        instance: {
          _id: Date.now().toString(),
          contentTypeId: data.contentTypeId,
          data: data.data,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      });
    }, 500);
  });
  // Uncomment the below lines to make an actual API call
  // try {
  //   return await api.post('/api/content-instances', data);
  // } catch (error) {
  //   throw new Error(error?.response?.data?.error || error.message);
  // }
}

// Description: Update a content instance
// Endpoint: PUT /api/content-instances/:id
// Request: { id: string, data: any }
// Response: { success: boolean, instance: { _id: string, contentType: string, data: any } }
export const updateContentInstance = (id: string, data: any) => {
  // Mocking the response
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        instance: {
          _id: id,
          data: data,
          updatedAt: new Date().toISOString()
        }
      });
    }, 500);
  });
  // Uncomment the below lines to make an actual API call
  // try {
  //   return await api.put(`/api/content-instances/${id}`, { data });
  // } catch (error) {
  //   throw new Error(error?.response?.data?.error || error.message);
  // }
}

// Description: Delete a content instance
// Endpoint: DELETE /api/content-instances/:id
// Request: { id: string }
// Response: { success: boolean, message: string }
export const deleteContentInstance = (id: string) => {
  // Mocking the response
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        message: 'Content instance deleted successfully'
      });
    }, 500);
  });
  // Uncomment the below lines to make an actual API call
  // try {
  //   return await api.delete(`/api/content-instances/${id}`);
  // } catch (error) {
  //   throw new Error(error?.response?.data?.error || error.message);
  // }
}