import CONFIG from '../config';

const ENDPOINTS = {
  REGISTER: `${CONFIG.BASE_URL}/register`,
  LOGIN: `${CONFIG.BASE_URL}/login`,
  GET_ALL_STORIES: `${CONFIG.BASE_URL}/stories`,
  ADD_STORY: `${CONFIG.BASE_URL}/stories`,
  GET_STORY_DETAIL: (id) => `${CONFIG.BASE_URL}/stories/${id}`,
  SUBSCRIBE_PUSH_NOTIFICATION: `${CONFIG.BASE_URL}/notifications/subscribe`,
  UNSUBSCRIBE_PUSH_NOTIFICATION: `${CONFIG.BASE_URL}/notifications/subscribe`,
};

//helper function (token)
export const saveToken = (token) => {
  if (token) {
    localStorage.setItem('token', token);
  } else {
    localStorage.removeItem('token');
  }
}
export const getToken = () => {
  return localStorage.getItem('token');
}


// register user function
export async function registerUser(name, email, password) {
  try {
    const response = await fetch(ENDPOINTS.REGISTER, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name,
        email,
        password,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to register user');
    }

    const data = await response.json();
    return data;
  }
  catch (error) {
    console.error('Error registering user:', error);
    throw error;
  }
}
// login user function
export async function loginUser(email, password) {
  try {
    const response = await fetch(ENDPOINTS.LOGIN, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        password,
      }),
    });

    const data = await response.json(); 

    if (!response.ok || data.error) {
      throw new Error(data.message || 'Gagal login user');
    }

    saveToken(data.loginResult.token);
    return data;
  } catch (error) {
    console.error('Error logging in user:', error.message); 
    throw error;
  }
}

// get all stories function
export async function getAllStories() {
  const token = getToken();

  try {
    const response = await fetch(ENDPOINTS.GET_ALL_STORIES, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();
    return data;

  }
  catch (error) {
    console.error('Error fetching stories:', error);
    throw error;
  }
};

// get story detail function
export async function getStoryDetail(id) {
  const token = getToken();
  
  try {
    const response = await fetch(ENDPOINTS.GET_STORY_DETAIL(id), {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch story detail');
    }

    const data = await response.json();
    return data;
  }
  catch (error) {
    console.error('Error fetching story detail:', error);
    throw error;
  }
};

// add story function
export async function addStory(data) {
  const token = getToken();

  const formData = new FormData();
  formData.append('description', data.description);
  formData.append('photo', data.photo);
  if (data.lat && data.lon) {
    formData.append('lat', data.lat);
    formData.append('lon', data.lon);
  }

  try {
    const response = await fetch(ENDPOINTS.ADD_STORY, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    const result = await response.json();
    if (result.error) {
      throw new Error(result.message || 'Failed to add story');
    }
    return result;
  }
  catch (error) {
    console.error('Error adding story:', error);
    throw error;
  }
};

// export async function notification 
export async function subscribePushNotification({endpoint, keys}) {
  const token = getToken();
  if (!token) {
    throw new Error('User is not authenticated');
  }

  const response = await fetch(ENDPOINTS.SUBSCRIBE_PUSH_NOTIFICATION, {
    method:'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      endpoint,
      keys: {
        p256dh: keys.p256dh,
        auth: keys.auth,  
      }
    })
  });
  return response;
}

export async function unsubscribePushNotification({endpoint}) {
  const token = getToken();
  if (!token) {
    throw new Error('User is not authenticated');
  }

  const response = await fetch(ENDPOINTS.UNSUBSCRIBE_PUSH_NOTIFICATION, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ endpoint }),
  });
  
  return response;
}