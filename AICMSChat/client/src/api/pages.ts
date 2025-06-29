import api from './api';

// Description: Get all pages with hierarchy
// Endpoint: GET /api/pages
// Request: {}
// Response: { pages: Array<{ _id: string, name: string, layout: any, createdAt: string, published: boolean, parentId?: string, children?: Array<any> }> }
export const getPages = () => {
  // Mocking the response with hierarchical data
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        pages: [
          {
            _id: '1',
            name: 'Homepage',
            layout: {
              sections: [
                { id: '1', type: 'hero', content: { title: 'Welcome to AI CMS', subtitle: 'Build amazing content with AI' } },
                { id: '2', type: 'content-grid', contentIds: ['1', '2'] }
              ]
            },
            createdAt: '2024-01-15T10:30:00Z',
            published: true,
            parentId: null,
            children: [
              {
                _id: '3',
                name: 'Features',
                layout: { sections: [] },
                createdAt: '2024-01-16T10:30:00Z',
                published: false,
                parentId: '1'
              },
              {
                _id: '4',
                name: 'Pricing',
                layout: { sections: [] },
                createdAt: '2024-01-17T10:30:00Z',
                published: true,
                parentId: '1'
              }
            ]
          },
          {
            _id: '2',
            name: 'About Us',
            layout: {
              sections: [
                { id: '1', type: 'text-block', content: { title: 'About Our Company', text: 'We are building the future of content management...' } }
              ]
            },
            createdAt: '2024-01-12T14:20:00Z',
            published: false,
            parentId: null,
            children: [
              {
                _id: '5',
                name: 'Our Team',
                layout: { sections: [] },
                createdAt: '2024-01-18T10:30:00Z',
                published: false,
                parentId: '2'
              },
              {
                _id: '6',
                name: 'Our Mission',
                layout: { sections: [] },
                createdAt: '2024-01-19T10:30:00Z',
                published: true,
                parentId: '2'
              }
            ]
          },
          {
            _id: '7',
            name: 'Contact',
            layout: { sections: [] },
            createdAt: '2024-01-20T10:30:00Z',
            published: true,
            parentId: null,
            children: []
          }
        ]
      });
    }, 500);
  });
  // Uncomment the below lines to make an actual API call
  // try {
  //   return await api.get('/api/pages');
  // } catch (error) {
  //   throw new Error(error?.response?.data?.error || error.message);
  // }
}

// Description: Create a new page
// Endpoint: POST /api/pages
// Request: { name: string, layout: any, parentId?: string }
// Response: { success: boolean, page: { _id: string, name: string, layout: any, parentId?: string } }
export const createPage = (data: { name: string; layout: any; parentId?: string }) => {
  // Mocking the response
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        page: {
          _id: Date.now().toString(),
          name: data.name,
          layout: data.layout,
          parentId: data.parentId || null,
          createdAt: new Date().toISOString(),
          published: false,
          children: []
        }
      });
    }, 500);
  });
  // Uncomment the below lines to make an actual API call
  // try {
  //   return await api.post('/api/pages', data);
  // } catch (error) {
  //   throw new Error(error?.response?.data?.error || error.message);
  // }
}

// Description: Update a page
// Endpoint: PUT /api/pages/:id
// Request: { id: string, name?: string, layout?: any, parentId?: string }
// Response: { success: boolean, page: { _id: string, name: string, layout: any, parentId?: string } }
export const updatePage = (id: string, data: { name?: string; layout?: any; parentId?: string }) => {
  // Mocking the response
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        page: {
          _id: id,
          ...data,
          updatedAt: new Date().toISOString()
        }
      });
    }, 500);
  });
  // Uncomment the below lines to make an actual API call
  // try {
  //   return await api.put(`/api/pages/${id}`, data);
  // } catch (error) {
  //   throw new Error(error?.response?.data?.error || error.message);
  // }
}